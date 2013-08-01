var _           	= require('lib/underscore');
var config      	= require('lib/config');
var util			= require('lib/utilities');
var MapUtilities    = require('lib/MapUtilities');
var TiMap			= null;
var rowtypeMap 		= require('ui/common/listingreports/listview/ListRowContent');
var Search      	= require('lib/PropertySearch');

/**
 * This widget normalizes usage of the google maps module for iOS and Android.
 */
var _BUFFER = 0.0125;
var MAP_WIDTH, MAP_HEIGHT;

/********************************************************************
 * Create View with a map
 ********************************************************************
 * @param {Object} options											
 ********************************************************************
 * @event viewDidAppear												
 * @event viewDidDisappear											
 * @event tapMarker													
 * @event tapAtCoordinate											
 * @event extentChanged												
 ********************************************************************
 * @method _addMarker({Location})
 * @method _clearMarkers()  
 * @method _getMarkerByListno({Integer})
 * @method _selectMarkerByListno({Integer})
 * @method _getSelectedListno()
 * @method _deselectSelectedListno()
 * @method _addCurrentLocationMarker({Location})
 * @method _clearCurrentLocationMarker()
 * @method _addAddressSearchMarker({Location})
 * @method _isSpecialMarker({Options})
 * @method _setLocked()
 * @method _updateExtent({Options})
 * @method _zoomToMarkers()
 * @method _getSuppressDuplicateExtentChanged()
 * @method _setSuppressDuplicateExtentChanged({Boolean})					  
 ********************************************************************
 * @property {Boolean} _locked										
 * @property {Extent} _markerExtent									
 * @property {Coordinates} _currentCoordinate								
 ********************************************************************/

MapView = function(options) {
	var defaults = {
        onload : function() {},
        height : Ti.UI.FILL,
        width  : Ti.UI.FILL,
        bottom : null,
        zIndex: 1,
        coordinates : false,
        bounds : false,
        currentLocation : false,
        // suppress extent changed event when the extent has not actually changed
        suppressDuplicateExtentChanged : true 
	};
	// extend defaults
 	options = _.extend({}, defaults, options);
 	
	// define local variables
    var mapView, 
        googlemaps, 
        currentLocation, 
        currentLocationMarker,
        addressSearch,
        addressSearchMarker,
        selectedMarker, // only available on Android
        defaultCoordinates,
        locationServices,
        currentExtentChangeEvent;
    var markers = []; // list of current regular markers on the map
    var selectedListno = null;
	var isPropertyList = Search.getCurrentNamespace() === 'propertylist' ? true : false;
	
    // Create the container view.
    var self = Ti.UI.createView({
        width   : options.width,
        height  : options.height,
        zIndex  : options.zIndex,
        visible : (util.Android ? false : true)
    });
    // create a default extent
    _markerExtent = MapUtilities.createExtent(null,null,null,null);
    
    self._locked = false;
    self._lastGeoRect = null;


    // Methods ====================================================================================
    
	/**
	 * Adds a marker to the map view
	 * @param {Object} data { 
	 * 		location: { latitude, longitude }, 	// latitude and longitude of the map
	 * 		title: { String },					// name of the map 
	 * 		icon : {String<nullable>}, 			// image url
	 * 	    iconView : {TiUIView},				// view used for custom markers
	 * 		click : {Function} 					// on click
	 * }
	 * @return {Object} Marker object
	 */
	self._addMarker = function(markerOptions) {
	    var marker;
		
		// If this is already a marker object, just add it to the map and return.
		var objectType = util.getObjectTypeName(markerOptions);
		if (objectType === 'ComMoshemarcianoGoogleMapsMarker' || objectType === 'Annotation') {
			if (util.Android) {
				mapView.addAnnotation(markerOptions);
			} else {
				mapView.addMarker(markerOptions);	
			}
			return markerOptions;
		}

		// Convert some marker options to the Android analogues.
		if (util.Android) {
		    if (markerOptions.title) {
		        delete markerOptions.title;
		    }
		    markerOptions.latitude = parseFloat(markerOptions.location.latitude);
		    markerOptions.longitude = parseFloat(markerOptions.location.longitude);
		    if (markerOptions.iconView) {
                markerOptions.customView = markerOptions.iconView;
                delete markerOptions.iconView;
            } else if (markerOptions.icon) {
				markerOptions.image = markerOptions.icon;
				delete markerOptions.icon;
			}
		}
		
		// Update the extent to include the new marker, unless it's a special type.
		if (!self._isSpecialMarker(markerOptions)) {
			_markerExtent = MapUtilities.__checkExtent(markerOptions.location, _markerExtent);
		}
		
        // Create the actual marker object and add it to the map.
		if (util.iOS) {
			marker = googlemaps.createMarker(markerOptions);
			mapView.addMarker(marker);		
		} else if (util.Android) {
			marker = TiMap.createAnnotation(markerOptions);
			marker._userData = markerOptions.customView ? markerOptions.customView._userData : null;
			mapView.addAnnotation(marker);
		} 
		
		// Save the marker object to the current marker list, unless it's a special type.
		if (!self._isSpecialMarker(markerOptions)) {
            markers.push(marker);
		}
		
		return marker;
	};

    /**
     * Clears all of the markers from the map, resets the extent, and then 
     * re-adds any special markers.
     */
    self._clearMarkers = function() {
        if (self._locked) { return; }
        
        // Clear the extent and the list of current markers.
        _markerExtent = MapUtilities.createExtent(null,null,null,null);
        markers = [];
        
        if (util.iOS) {
            mapView.clear();
        } else if (util.Android) {
            mapView.removeAllAnnotations();
        }
        
        // Add the special markers back in if they exist.
        if (currentLocation) {
            currentLocationMarker = self._addMarker(currentLocation);   
        }
        if (addressSearch) {
            addressSearchMarker = self._addMarker(addressSearch);
        }
    };
	
	/**
	 * Finds a specific marker object by its listing number.
	 */
	self._getMarkerByListno = function(listno) {
	    return _.find(markers, function(marker){ 
	        return marker.userData && 
	        	marker.userData.currentRecord && 
	        	marker.userData.currentRecord.listno && 
	        	marker.userData.currentRecord.listno == listno; 
        });
	};
	
	/**
	 * Given a listno, select the corresponding marker on the map. 
	 * If the marker is off the map, it will still be flagged for selection 
	 * when it is shown.
	 * 
	 * @param int listno
	 * @param boolean center
	 */
	self._selectMarkerByListno = function(listno) {
	    // De-select previously selected marker, if it exists.
	    self._deselectSelectedListno();
	    
	    for (var index=0;index<markers.length;index++) {
            var marker = markers[index];
            
	        // Normalize Android _userData.
	        if (!marker.userData && marker._userData) {
                 marker.userData = {
                    currentRecord : marker._userData
                 };
            }

            // If this is the marker we want to select...
            if (marker.userData.currentRecord.listno == listno) {
    	        // Create a new selected custom view.
                var iconView = Search.createMapMarker(marker.userData.currentRecord, true);
                
                // On iOS you can simply change the view on the existing marker.
                if (util.iOS) {
                    marker.iconView = iconView;
                }
                // On Android we create a new selected annotation and overlay it. 
                // You can't modify a marker that is already added to the map.
                else if (util.Android) {
                    selectedMarker = self._addMarker({
                        userData  :  {
                            currentRecord : marker.userData.currentRecord,
                            index : index
                        },
                        location:   {            
                            latitude    : parseFloat(marker.userData.currentRecord.latitude),
                            longitude   : parseFloat(marker.userData.currentRecord.longitude)
                        },
                        iconView: iconView
                    });
                }
                
                selectedListno = listno;
                return true;
    	    }    
    	}
    	
    	return false;
    };
	
    /**
     * Returns the listing number that is currently selected.
     */
    self._getSelectedListno = function() { 
        return selectedListno; 
    };
	
	/*
	 * If there is a selected listing number, deselect it.
	 */
	self._deselectSelectedListno = function() {
	    if (selectedListno) {
	        if (util.iOS) {
    	        var marker = self._getMarkerByListno(selectedListno);
        	    if (marker) {
        	        var iconView = Search.createMapMarker(marker.userData.currentRecord, false);
                    marker.iconView = iconView;
        	    }
    	    } else if (util.Android) {
    	        if (selectedMarker) {
    	            mapView.removeAnnotation(selectedMarker);
    	            selectedMarker = null;
    	        }
    	    }
    	    
    	    selectedListno = null;
	    }
	};
	
	/**
     * Add the current location marker, clearing the old one if it exists.
     * @param {Location} location
     */
    self._addCurrentLocationMarker = function(location) {
        if (currentLocationMarker) {
            self._clearCurrentLocationMarker(); 
        }
        
        if (location.coords) {
            location.latitude = location.coords.latitude;
            location.longitude = location.coords.longitude;
        }

        var lat = location.latitude.toString();
        var lng = location.longitude.toString();
        
        if (lat.length > 8) { lat = lat.slice(0,8); } 
        if (lng.length > 8) { lng = lng.slice(0,8); } 
            
        currentLocation = {
            title       : 'Current Location',
            location    :  MapUtilities.createLocation(lat,lng),
            userData    : { currentLocation : true },
            tappable    : false,
            icon        : '/images/locator.png'
        };
        currentLocationMarker = self._addMarker(currentLocation);    
    };
	
	/**
     * Clear the current location marker, if it exists.
     */
    self._clearCurrentLocationMarker = function() {
        if (currentLocationMarker) {
            if (util.Android) {
                mapView.removeAnnotation(currentLocationMarker);
            } else {
                mapView.removeMarker(currentLocationMarker);
            }
            
            currentLocation = null;
            currentLocationMarker = null;
            
            return true;
        }
        return false;
    };
    
    self._addAddressSearchMarker = function(location) {
        addressSearch = {
            title       : 'Address',
            location    : location,
            userData    : { addressSearch : true },
            height      : '10dp',
            width       : '10dp',
            tappable    : false,
            icon        : '/images/map-markers/address-point.png'
        };
        addressSearchMarker = self._addMarker(addressSearch);
    };
    
    self._isSpecialMarker = function(markerOptions) {
        if (markerOptions.userData && (markerOptions.userData.currentLocation || markerOptions.userData.addressSearch)) {
            return true;
        }
        return false;
    }

    /**
     * Sets whether the map is locked
     * @param {Boolean} locked
     */
    self._setLocked = function(locked) { 
        self._locked = locked; 
    };
    
    /**
     * Updates the extent of the map
     * @param {Object} options<coordinate>
     */
    self._updateExtent = function(extentOptions) {
        var coordinates = extentOptions.coordinates ? extentOptions.coordinates : null;
        if (self._locked || (!coordinates && !_markerExtent) || !coordinates && self._loaded === true) {
            return;
        }
        
        // prevents function from calling itself recursively
        self._locked = true;
        
        // append default values
        var defaults = {
            afterUpdate : function() {},
            coordinates : (!coordinates ? _markerExtent : coordinates),
            forceExtendChangeEvent : false
        }; 
        extentOptions = _.extend({}, defaults, extentOptions);
        
        // removes the event listener
        var afterCameraChange = function() {
            setTimeout(extentOptions.afterUpdate, 100);
            if (util.iOS) {
                mapView.removeEventListener('changeCameraPosition', afterCameraChange);
            } else {
                mapView.removeEventListener('regionchanged', afterCameraChange);
            }
            
            // unlock the viewstate
            self._locked = false;
            self._loaded = true;
        };
        
        // validate the coordinate system
        // this will also convert the coordinate system to the cooresponding device
        var coord = MapUtilities.__validateCoordinate(extentOptions.coordinates);
        
        // add additional event listener
        if (util.iOS) {
            mapView.addEventListener('changeCameraPosition', afterCameraChange);
            if (coord.animate) {
                mapView.animateToCameraPosition(coord);
            } else {
                mapView.setCamera(coord);   
            }
        } else if (util.Android) {
            mapView.addEventListener('regionchanged', afterCameraChange);
            mapView.setRegion(coord);
        }
        self._currentCoordinate = coord;
        
        if (extentOptions.forceExtendChangeEvent){
            var existingLat = parseFloat(currentExtentChangeEvent.latitude).toFixed(4);
            var existingLong= parseFloat(currentExtentChangeEvent.longitude).toFixed(4);
            var passedLat   = parseFloat(extentOptions.coordinates.latitude).toFixed(4);
            var passedLong  = parseFloat(extentOptions.coordinates.longitude).toFixed(4);
            
            if (existingLat === passedLat && existingLong === passedLong){
                // unlock the viewstate
                self._locked = false;
                self._loaded = true;
                self.fireEvent("extentChanged", currentExtentChangeEvent);                 
            }
        }
        
    };
    
    /**
     * Zooms to the extent of the markers
     */
    self._zoomToMarkers = function() {
        if (_markerExtent) {
            
            _markerExtent.xmax += _BUFFER;
            _markerExtent.xmin -= _BUFFER;
            _markerExtent.ymax += _BUFFER;
            _markerExtent.ymin -= _BUFFER;
            
            var coords = MapUtilities.createCoordinate(_markerExtent);
            if (!coords.coordinates) {
                coords = {
                    coordinates : coords
                };
            }
            self._updateExtent(coords); 
        } 
    };
	
	self._getSuppressDuplicateExtentChanged = function(){
	    return options.suppressDuplicateExtentChanged;
	}
	
	self._setSuppressDuplicateExtentChanged = function(value){
	    options.suppressDuplicateExtentChanged = value;
	}
    

    
    // Map ========================================================================================

    // check if coordinate system is bounds and convert to extent if it is
    if (options.bounds) {
        options.coordinates = MapUtilities.convertBoundsToExtent(MapUtilities.createBounds(options.bounds));
    }
    
    // Prepare the map module and the initial coordinates.
    if (util.iOS) {
        googlemaps = require('com.moshemarciano.googleMaps');
        googlemaps.licenseKey("AIzaSyAbbJc2qDkDLZlrDHg_BrvOdIfsLhtTTFI");
        if (!options.coordinates) { // load utah
            options.coordinates = MapUtilities.createGoogleCoordinate(
                39.99921417236328,
                -112.3140182495117,
                7
            );  
        }
    } else if (util.Android) {
        TiMap = require('ti.map');
        if (!options.coordinates) { // load utah
            options.coordinates = MapUtilities.createRegion(
                39.9416495, 
                -112.116922, 
                0.04326357000000506, 
                0.0229079199999984
            );
        } else {
            options.coordinates = MapUtilities.createCoordinate(options.coordinates);
        }
    }
    
    // set the current coordinates
    options.coordinates = MapUtilities.__validateCoordinate(options.coordinates);
    self._currentCoordinate = options.coordinates;
    
    // Create the map.
    if (util.iOS) {
    	mapView = googlemaps.createGoogleMap({
            height: options.height,
            width:  options.width,
            bottom: options.bottom,
            location : options.coordinates
        });
        mapView.rotateGestures = true;
        mapView.tiltGestures = false;	
        mapView.cameraMoveOnMarkerTap = true;
        mapView.customInfoWindow = true;
        
        // Set up event listeners for iOS
        mapView.addEventListener('tapMarker', function(e) { 
            self.fireEvent('markerTapped', e); 
        });
        mapView.addEventListener('tapAtCoordinate', function(e) { 
            self.fireEvent('mapTapped', e); 
        });
        mapView.addEventListener('changeCameraPosition', function(e) {
            // We don't want to fire the extent changed if it's just the same extent, at least usually (optional!)
            if (options.suppressDuplicateExtentChanged && 
            		currentExtentChangeEvent && 
            			(e.latitude === currentExtentChangeEvent.latitude && 
            		 	 e.longitude === currentExtentChangeEvent.longitude)){
                console.log('ExtentChanged event suppressed.');
                return;
            }

            currentExtentChangeEvent = e; 
            self.fireEvent('extentChanged', e); 
        });
        
    	mapView.setCamera(options.coordinates);
    } else if (util.Android) {
    	mapView = TiMap.createView({
			mapType : TiMap.NORMAL_TYPE, 
			regionFit : true,
			hideAnnotationWhenTouchMap : true,
			height 	: options.height,
			width 	: options.width,
			bottom	: options.bottom,
			visible : true,
			animate : false
		});	
		
		// Set up event listeners for Android
		mapView.addEventListener('error', function(e) { 
		    console.log(JSON.stringify(e));	 
		});
		mapView.addEventListener('click', function(e) {
		    // Enforce 'tappable'
		    if (e.annotation.tappable && e.annotation.tappable !== false) {
    			self.fireEvent('markerTapped', { 
    				userData : { 
    					currentRecord : e.annotation.customView._userData  
    				}
    			});
			}
		});
		mapView.addEventListener('singletap', function(e) {
			 self.fireEvent('mapTapped', e);
		});
		mapView.addEventListener('regionchanged', function(e) {
			var region = {
				latitude : e.latitude,
				longitude : e.longitude,
				longitudeDelta : e.longitudeDelta / 2.0,
				latitudeDelta : e.latitudeDelta / 2.0
			}
			 self.fireEvent('extentChanged', { region : region }); 
		 });
		 
        mapView.setRegion(options.coordinates);
    }
   
   

    // For some reason postlayout gets called twice so we need to work around that.
    var postLayoutCalled = false;
    mapView.addEventListener('postlayout', function(e) {
        if (postLayoutCalled){
            return;
        }
        postLayoutCalled = true;

        // Get the map dimensions.
        var view = e.source;
        var image = view.toImage();
        MAP_HEIGHT = image.height;
        MAP_WIDTH = image.width;
        
        // calls the onload function if given
    	options.onload();
    	
    	// use this to display map after the region has been set on the android
    	if (util.Android) {
    		setTimeout(function() { self.setVisible(true); }, 500);
    	}
    	
    	// Use the options current location
    	if (options.currentLocation){
        	self._addCurrentLocationMarker({
                	latitude  : options.currentLocation.latitude,
                    longitude : options.currentLocation.longitude
			});
        // Get this shiz manually
        } else {
            var CurrentLocation	= require('local_db/models/CurrentLocation');
    		var location = CurrentLocation.getLastLocation();
    		if (location && location.datetime.dateIsWithinTheHour()) {
    			self._addCurrentLocationMarker(location);
    		} else if (Ti.Geolocation.getLocationServicesEnabled()) {
    		    var LocationServices = require('lib/MyLocation');
    			var locationService = new LocationServices(
    				function(loc) {
    					self._addCurrentLocationMarker(loc);
    					locationService.cancelCallback(); // This should be getting handled already???/
    					locationService = null;	
    				}
    			);	
    		}
        }
    });

    self.add(mapView);
	return self;
}

module.exports = MapView;
