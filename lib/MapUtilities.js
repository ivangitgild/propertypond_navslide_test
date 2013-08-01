var util            = require('lib/utilities');

/*
 * Map utilities for dealing with the various coordinate systems... creation,
 * conversion, validation, etc.
 */


var MapUtilities = {
    COORDINATE : {
        GOOGLE : 'Google Coordinate System',
        BOUNDS : 'Bounds',
        EXTENT : 'Extent',
        REGION : 'Region',
        LOCATION : 'Location'
    },
    mapSize : null,

    // Zoom level ratios for Google Maps.
    ZOOM_LEVEL_RATIO : {
        LEVEL_20 : 1128.497220,
        LEVEL_19 : 2256.994440,
        LEVEL_18 : 4513.988880,
        LEVEL_17 : 9027.977761,
        LEVEL_16 : 18055.955520,
        LEVEL_15 : 36111.911040,
        LEVEL_14 : 72223.822090,
        LEVEL_13 : 144447.644200,
        LEVEL_12 : 288895.288400,
        LEVEL_11 : 577790.576700,
        LEVEL_10 : 1155581.153000,
        LEVEL_9  : 2311162.307000,
        LEVEL_8  : 4622324.614000,
        LEVEL_7  : 9244649.227000,
        LEVEL_6  : 18489298.450000,
        LEVEL_5  : 36978596.910000,
        LEVEL_4  : 73957193.820000,
        LEVEL_3  : 147914387.600000,
        LEVEL_2  : 295828775.300000,
        LEVEL_1  : 591657550.500000
    },

    // Creation ===================================================================================

    /**
     * Creates a bounds object
     * @param {Results}
     */
    createBounds : function(results) {    
        var northeast,southwest;
        if (results.geometry) {
            northeast = results.geometry.bounds.northeast;
            southwest = results.geometry.bounds.southwest;  
        } else if (results.northeast && results.southwest) {
            northeast = results.northeast;
            southwest = results.southwest;
        }
        return { 
            type : this.COORDINATE.BOUNDS,
            northeast : {
                lat : northeast.lat,
                lng : northeast.lng
            },
            southwest : {
                lat : southwest.lat,
                lng : southwest.lng
            }
        };
    },
    
    /**
     * Creates a google coordinate
     * @param {Float} latitude
     * @param {Float} longitude
     * @param {Integer} zoom
     */
    createGoogleCoordinate : function(lat,lng,zoom) {
        return {
            type : this.COORDINATE.GOOGLE,
            latitude : lat,
            longitude : lng,
            zoom : zoom
        };
    },
        
    /**
     * Creates an extent
     * @param {Float} xmin
     * @param {Float} ymin
     * @param {Float} xmax
     * @param {Float} ymax
     */
    createExtent : function(xmin,ymin,xmax,ymax) {
        return {
            type : this.COORDINATE.EXTENT,
            xmin : xmin,
            ymin : ymin,
            xmax : xmax,
            ymax : ymax
        };
    },
        
    /**
     * Creates a region coordinate
     * @param {Float} latitude
     * @param {Float} longitude 
     * @param {Float} latitudeDelta
     * @param {Float} longitudeDelta
     * */
    createRegion : function(lat,lng,latDelta,lngDelta) {
        return {
            type : this.COORDINATE.REGION,
            latitude : lat,
            longitude  : lng,
            latitudeDelta : latDelta,
            longitudeDelta : lngDelta
        };
    },
    
    /**
     * Creates location coordinate
     * @param {Float} latitude
     * @param {Float} longitude
     */
    createLocation : function(latitude,longitude) {
        return {
            type : this.COORDINATE.LOCATION,
            latitude : latitude,
            longitude : longitude
        };
    },
    
    /**
     * Creates coordinate based upon options given
     * @param {Object} options
     */
    createCoordinate : function(options) {
        if (!options) {
            return null;
        }
        // extent
        if (options.xmin && options.xmax && options.ymin && options.ymax) {
            return this.createExtent(options.xmin, options.ymin, options.xmax, options.ymax);
        }
        if (options.lat) options.latitude = options.lat;
        if (options.lng) options.longitude = options.lng;
        
        if (options.latitude && options.longitude) {
            if (options.lngDelta) options.longitudeDelta = options.lngDelta;
            if (options.latDelta) options.latitudeDelta = options.latDelta;
            
            if (options.geometry) {
                if (options.geometry.bounds) {
                    return this.createBounds(options);
                }
            }
            
            // region
            if (options.latitudeDelta && options.longitudeDelta) {
                return this.createRegion(options.latitude, options.longitude, options.latitudeDelta, options.longitudeDelta);
            }
            
            // google
            if (options.zoom) {
                return this.createGoogleCoordinate(options.latitude, options.longitude, options.zoom);
            }
            
            // location
            return this.createLocation(options.latitude, options.longitude);
        }
        return null;
    },
    
    
    // Conversion =================================================================================
    
    /**
     * Converts bounds to an extent
     * @param {Object} bounds
     */
    convertBoundsToExtent : function(bounds) {
        /*
         * xmin : southwest.lng
         * ymin : southwest.lat
         * xmax : northeast.lng
         * ymax : northeast.lat
         */
        return this.createExtent(bounds.southwest.lng,bounds.southwest.lat,bounds.northeast.lng,bounds.northeast.lat);
    },
    
    /**
     * Converts region to extent envelope 
     * @param {Object} region
     */
    convertRegionToExtent : function(region) {
        var xmin = parseFloat(region.longitude) - region.longitudeDelta;
        var xmax = parseFloat(region.longitude) + region.longitudeDelta;
        var ymin = parseFloat(region.latitude) - region.latitudeDelta;
        var ymax = parseFloat(region.latitude) + region.latitudeDelta;
        return {
            type : this.COORDINATE.EXTENT,
            xmin : xmin,
            ymin : ymin,
            xmax : xmax,
            ymax : ymax
        };
    },
        
    /**
     * Converts extent to google coordinate system
     * @param {Extent} extent
     */
    convertExtentToGoogleCoordinateSystem : function(extent) {
        
        var GLOBE_HEIGHT = 256; // Height of a google map that displays the entire world when zoomed all the way out
        var GLOBE_WIDTH = 256; // Width of a google map that displays the entire world when zoomed all the way out
    	
    	
    
    	var MAP_HEIGHT = this.mapSize.height;
        var MAP_WIDTH = this.mapSize.width;
    	
    
        var latAngle =  extent.ymax - extent.ymin;
        if (latAngle < 0) {
            latAngle += 360;
        }
    
        var lngAngle =  extent.xmax - extent.xmin;
    
        var latZoomLevel = Math.floor(Math.log(MAP_HEIGHT * 360 / latAngle / GLOBE_HEIGHT) / Math.LN2);
        var lngZoomLevel = Math.floor(Math.log(MAP_WIDTH * 360 / lngAngle / GLOBE_WIDTH) / Math.LN2);
    
        var zoom = (latZoomLevel < lngZoomLevel) ? latZoomLevel : lngZoomLevel;
        return {
            type : this.COORDINATE.GOOGLE,
            latitude : extent.ymax - (latAngle / 2),
            longitude : extent.xmax - (lngAngle / 2),
            zoom : zoom
        };
    },
    
        
    /**
    * 
    * @param {Extent} extent
    * @param {Float} buffer <nullable>
    */
    convertExtentToRegion : function(extent, buffer) {
        var BUFFER = buffer ? buffer : 1.0;
        return {
            type : COORDINAT.REGION,
            latitude : (extent.ymin+extent.ymax)/2.0,
            longitude : (extent.xmin+extent.xmax)/2.0,
            latitudeDelta : (extent.ymax - extent.ymin) + ((extent.ymax - extent.ymin) * BUFFER),
            longitudeDelta : (extent.xmax - extent.xmin) + ((extent.xmax - extent.xmin) * BUFFER)
        };
    },
    
    /**
     * Converts google coordinate system to extent 
     * @param {GoogleCoordinateSystem} googleCoordinateSystem
     */
    convertGoogleCoordinateSystemToExtent : function(googleCoordinateSystem) {
        // google tile size 256
        // zoom levels are 0 (most detailed) to 20 (least detailed)
        var MERCATOR_OFFSET  = 268435456;
        var MERCATOR_RADIUS = 85445659.44705395;
        // convert longitude to pixel
        var longitudeToPixelSpaceX = function(longitude) {
            return Math.round(MERCATOR_OFFSET + MERCATOR_RADIUS * 
                googleCoordinateSystem.longitude * Math.PI / 180.0);
        };
        // converts latitude to pixel
        var latitudeToPixelSpaceY = function(latitude) {
            var latSin = Math.sin(googleCoordinateSystem.latitude * 
                Math.PI / 180.0);
            return Math.round(MERCATOR_OFFSET - MERCATOR_RADIUS * 
                Math.log((1 + latSin) / (1 - latSin)) / 2.0);
        };
        // converts pixel to longitude
        var pixelSpaceXToLongitude = function(pixelX) {
            return ((Math.round(pixelX) - MERCATOR_OFFSET) / MERCATOR_RADIUS) * 
                180.0 / Math.PI;    
        };
        // converts pixel to latitude
        var pixelSpaceYToLatitude = function(pixelY) {
            return (Math.PI / 2.0 - 2.0 * 
                Math.tan(Math.exp((Math.round(pixelY) - MERCATOR_OFFSET) / MERCATOR_RADIUS))) * 
                180.0 / Math.PI;
        };  
        // convert zoom to exponent
        var zoomExponent = 20 - googleCoordinateSystem.zoom;
        var zoomScale = Math.pow(2, zoomExponent);
        // get the zoom scaled to a map
        var scaledMapWidth = util.DeviceWidth * zoomScale;
        var scaledMapHeight = util.DeviceHeight * zoomScale;
        
        var centerPixelX = longitudeToPixelSpaceX(googleCoordinateSystem.longitude);
        var centerPixelY = latitudeToPixelSpaceY(googleCoordinateSystem.latitude);
        var topLeftPixelX = centerPixelX - (scaledMapWidth / 2);
        var topLeftPixelY = centerPixelY - (scaledMapHeight / 2);
        // get the longitude or xmin, xmax
        var xmin = pixelSpaceXToLongitude(topLeftPixelX);
        var xmax = pixelSpaceXToLongitude(topLeftPixelX + scaledMapWidth);
        // get the latitude or ymin, ymax
        var ymin = pixelSpaceYToLatitude(topLeftPixelY);
        var ymax = pixelSpaceYToLatitude(topLeftPixelY + scaledMapHeight);
        // create the extent
        return this.createExtent(xmin,ymin,xmax,ymax);
    },
    
    /**
     * Converts google coordinate system to region system used by Android
     * @param {GoogleCoordinateSystem} googleCoordinateSystem
     */
    convertGoogleCoordinateSystemToRegion : function(googleCoordinateSystem) {
        // convert to extent so we can get the xmin,ymin,xmax,ymax
        var extent = this.convertGoogleCoordinateSystemToExtent(googleCoordinateSystem);
        // get deltas
        var longitudeDelta = extent.xmax - extent.xmin;
        var latitudeDelta = -1 * (extent.ymax - extent.ymin);
        // return region
        return this.createRegion(googleCoordinateSystem.latitude,
                            googleCoordinateSystem.longitude, 
                            latitudeDelta, 
                            longitudeDelta);
                            
    },
    
    // Validation =================================================================================
    
    /**
     * check to see if an extent is valid, this is used when only one
     * marker has been set we need to offset the values so we don't end up 
     * at 0,0
     * @param {Extent} extent
     * @param {float} buffer
     */
    __validateExtent: function(extent, buffer) {
        if (extent.xmin === extent.xmax) {
            extent.xmax += buffer;
            extent.xmin -= buffer;
        }
        if (extent.ymax === extent.ymin) {
            extent.ymax += buffer;
            extent.ymin -= buffer;
        }
        return extent;
    },
    
    /*
     * ?
     */
    __checkExtent : function(location, extent) {
        extent.xmin = !extent.xmin || location.longitude < extent.xmin ? parseFloat(location.longitude) : extent.xmin;
        extent.xmax = !extent.xmax || location.longitude > extent.xmax ? parseFloat(location.longitude) : extent.xmax;
        extent.ymin = !extent.ymin || location.latitude < extent.ymin ? parseFloat(location.latitude) : extent.ymin;
        extent.ymax = !extent.ymax || location.latitude > extent.ymax ? parseFloat(location.latitude) : extent.ymax;
        return extent;
    },
    
    /**
     * Will attempt to make a coordinate valid, if it is valid 
     * it will convert it to the proper coordiate system based upon the device.
     * @param {Object} coordinate
     */
    __validateCoordinate : function(coord) {
        if (!coord) { return null; }
        
        coord = !coord.type ? this.createCoordinate(coord) : coord;
        coord.isValid = false;
        switch (coord.type) {
            case this.COORDINATE.BOUNDS :
                if (this.__checkNumberValues([coord.southwest, coord.northeast])) {
                    coord.isValid = true;
                } 
            break;
            case this.COORDINATE.EXTENT :
                if (this.__checkNumberValues([coord.xmin,coord.xmax,coord.ymin,coord.ymax])) {
                    coord = this.__validateExtent(coord);
                    coord.isValid = true;
                } 
                break;
            case this.COORDINATE.REGION : 
                if (this.__checkNumberValues([coord.latitude, coord.longitude, coord.latitudeDelta, coord.longitudeDelta])) {
                    coord.isValid = true;
                }
                break;
            case this.COORDINATE.GOOGLE : 
                if (this.__checkNumberValues([coord.latitude, coord.longitude, coord.zoom])) {
                    coord.isValid = true;
                }
            break;
            case this.COORDINATE.LOCATION : 
                if (this.__checkNumberValues([coord.latitude, coord.longitude])) {
                    coord.isValid = true;
                }
            break;
            default : break;
        }
        
        if (!coord.isValid) return coord;
        if (coord.type === this.COORDINATE.BOUNDS) {
            coord = this.convertBoundsToExtent(coord);
        }
        if (util.iOS) {
            // convert to google coordinate system
            if (coord.type === this.COORDINATE.EXTENT) {
                coord = this.convertExtentToGoogleCoordinateSystem(coord);
                coord.isValid = true;
            } else if (coord.type === this.COORDINATE.REGION) {
                var extent = this.convertRegionToExtent(coord);
                coord = this.convertExtentToGoogleCoordinateSystem(extent);
                coord.isValid = true;
            } else if (coord.type === this.COORDINATE.GOOGLE) {
                coord.isValid = true;
            } else {
                coord.isValid = false;
            }
        } else if (util.Android) {
            // convert to convert to region
            if (coord.type === this.COORDINATE.EXTENT) {
                coord = this.convertExtentToRegion(coord);
                coord.isValid = true;
            } else if (coord.type === this.COORDINATE.REGION) {
                coord.isValid = true;
            } else if (coord.type === this.COORDINATE.GOOGLE) {
                coord = this.convertGoogleCoordinateSystemToRegion(coord);
                coord.isValid = true;
            }else {
                coord.isValid = false;
            }
        }
        coord.animate = coord.animate != undefined ? coord.animate : true;
        return coord;
    },
    
    /**
     * Checks if the numeric value exists then check to see if it is a valid number
     * @param {Array} or {Number} numbers
     */
    __checkNumberValues : function(numbers) {
        if (!_.isArray(numbers)) {
            numbers = [numbers];
        }
        for (var a = 0; a < numbers.length; a++) {
            var _n = numbers[a];
            if (!_n || isNaN(_n)) {
                return false;
            }
        }
        return true;
    }
}

module.exports = MapUtilities;