var _           = require('lib/underscore');
var config      = require('lib/config');
var locate      = require('lib/MyLocation');
var geo         = require('lib/geo');
var Search		= require('lib/PropertySearch');
var osname      = config.getValue('osname');

// construct
/***********************************************************************************
 ***********************************************************************************
 * @name {ClassName}								
 * @description {Description}						
 * @return {TiUIView}	
------------------------------------------------------------------------------------
 * @param {Object} options
    ↳ {String} value, color, top, value		
    ↳ {Integer} width, height								
------------------------------------------------------------------------------------
 * @event locationChanged()  					⇒ the text field value changed	
 * @event currentLocationRetrieved				⇒ location received // same as below
   	↳ {Object} GeoData
    	↳ {Float} latitude, longitude
    	↳ {Integer} zoom							
 * @event currentLocationClick()				⇒ user clicked the current location
   	↳ {Object} GeoData
    	↳ {Float} latitude, longitude
    	↳ {Integer} zoom
 * @event blur();								⇒ location text field blurred
 * @event locationClear()						⇒ location clear button clicked
 * @event locationTextFieldKeyboardDismissed()	⇒ text field keyboard dismissed
   	↳ {String} newValue 
------------------------------------------------------------------------------------
 * @method _setValue({String});
 * @method _blur(); 					
------------------------------------------------------------------------------------
 * @property _myProperty							
 ***********************************************************************************
 ***********************************************************************************/
LocationTextField = function(options){
    var defaults = {
        value : '',
        color : '#000',
        top   : '10dp',
        value : ''
    }
    options = _.extend({}, defaults, options);
    
    var currentLocationText = 'Current Location';
    var isCurrentLocation = (options.value == currentLocationText) ? true : false;
    var locateInstance = false;
    
    var locationView = Ti.UI.createView({
        layout : 'horizontal',
        width: '280dp',
        left: '10dp',
        top: options.top,
        height: '38dp',
        borderRadius: 8,
        borderWidth: 1, 
        borderColor: '#2377ba'
    });
        var iconContainer = Ti.UI.createView({
            backgroundColor : '#2377ba',
            width: '50dp'
        });
        locationView.add(iconContainer);
        
            var iconView = Ti.UI.createView({
                height: '26dp',
                width: '26dp',
                top: '5dp',
                left: '12dp',
                backgroundImage: "/images/icon-nearby.png"
            });   
            iconContainer.add(iconView);
        
        // Click Current Location Icon
        iconView.addEventListener('click', function(){
            if (!isCurrentLocation){
                // Set the location text field only if device location services is enabled
                if (Ti.Geolocation.getLocationServicesEnabled()) {
                    locationTF.setValue(currentLocationText);
                    locationTF.setFont({
                        fontWeight: 'bold',
                        fontSize  : '16dp'   
                    });
                    locationTF.blur();
                    isCurrentLocation = true;
                }
                
                locateInstance = locate(function(c){        // Requires a callback function                    
                    var returnData = {
                    	geoData : {
                    		latitude    : c.latitude,
                            longitude   : c.longitude,
                            zoom        : Search.MAP_ZOOM.CURRENT_LOCATION,
                            shortName   : currentLocationText,
                            longName    : currentLocationText,
                            query       : currentLocationText
                    	}
                    };
                    locationView.fireEvent('currentLocationClick', returnData);
                    
                });
            }
        });
        
        var locationTFOptions = {
            height:'40dp',
            width: '196dp',
            left: '10dp',
            font: {
                fontWeight: isCurrentLocation ? 'bold' : 'normal',
                fontSize  : '16dp'    
            },
            hintText: 'Location',
            color: options.color,
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
            backgroundColor: 'transparent', 
            borderWidth: 0, 
            borderColor: 'transparent',
            value: options.value
        };
        if (osname !== 'android'){
            locationTFOptions.autocapitalization = false;
        }    
    
        var locationTF = Ti.UI.createTextField(locationTFOptions);
        
        // Blur Text Field
        locationTF.addEventListener('blur', function(e){
            var value = locationTF.getValue();
            
            if (value == currentLocationText){
                return;
            }else if (value === ''){
                locationView.fireEvent('locationClear', {});
                return;
            }
            
            geo.forwardGeocode(value, function(geoData) {
                if (!geoData){
                    locationView.fireEvent('reset');
                    return;
                }

                locationTF.setValue(geoData.longName);  
                              
                locationView.fireEvent('locationChanged', {
                    location : value,
                    geoData  : geoData,
                    reverseGeocode : false
                }); 
            }); 
            
               
        });
        
        // Change Of the Text Field
        locationTF.addEventListener('change', function(e){
            if (e.value != currentLocationText && isCurrentLocation){
                locationTF.setFont({
                    fontWeight: 'normal',
                    fontSize  : '16dp'    
                });
                isCurrentLocation = false;
                locationTF.setValue('');
                
                locationView.fireEvent('locationClear', {});
            }
        });
        
        locationTF.addEventListener('blur', function(e) {
        	locationView.fireEvent('locationTextFieldKeyboardDismissed', { newValue : e.source.getValue() });
        });
        
        locationView.add(locationTF);

        // Grab current location and reverse geocode if there is no set value
        if (options.value === '' && Ti.Geolocation.getLocationServicesEnabled()) {
            locate(function(position){        // Requires a callback function
                
                geo.reverseGeocode(position.latitude, position.longitude, function(reverseData){
                    // Go through results and find the zipcode level results
                    var currentResultSet = null
                    for (var i = 0; i < reverseData.length; i++){
                        currentResultSet = reverseData[i];
                        if (currentResultSet.address_components[0].types.indexOf("postal_code") != -1){
                            break;
                            
                        }
                    }
                    
                    if (currentResultSet){
                        var value =  currentResultSet.formatted_address.replace(/, USA/g,"");
                        
                        locationTF.setValue(value);
                        locationView.fireEvent('locationChanged', {
                            location : value,
                            geoData  : {
                                type        : 'zip',
                                latitude    : currentResultSet.geometry.location.lat,
                                longitude   : currentResultSet.geometry.location.lng,
                                query       : value, 
                                bounds      : currentResultSet.geometry.bounds,
                                shortName   : currentResultSet.address_components[0].short_name,
                                longName    : value
                            },
                            reverseGeocode : true
                        }); 
                    }
                });
                
            });
        }
        
    locationView._blur = function(){
        locationTF.blur();
    }
    
    locationView.addEventListener('reset', function(e){
        locationTF.setValue('');  
        e.cancelBubble = true;
        locationView.fireEvent('locationClear', {});
    });
    
    locationView._setValue = function(value){
        locationTF.setValue(value);
    }

    // The "Clear Location" Icon on the far right
    var clearLocationIconView = Ti.UI.createImageView({
        height: '20dp',
        width: '20dp',
        top: '9dp',
        right: 0,
        image: "/images/icon-clear-criteria.png"
    });
    
    clearLocationIconView.addEventListener('click', function(e){
        locationTF.focus();
        isCurrentLocation = false;
        locationView.fireEvent('reset', {});
    });
    
    locationView.add(clearLocationIconView);

    return locationView;
}

module.exports = LocationTextField;
