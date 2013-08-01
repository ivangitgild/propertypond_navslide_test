var util			= require('lib/utilities');
var _               = util._;
var moment			= util.moment;
var location		= require('local_db/models/CurrentLocation');

// Get the User's Current Location from the phone / device
// This requires that you pass in a callback function that gets called upon success


var MIN_ACCEPTABLE_ACCURACY = 1000;
var MAX_ATTEMPTS_PER_INDEX	= 3;
var DEFAULT_TIMEOUT 		= 5000; 

// 5 seconds
var NEW_LOCATION_TIMEOUT_SEC 	= 15;

// variables used to store locally 
var LOCATION_MESSAGE_OBJ_NAME = '__LOCATION_MESSAGE_OBJECT__';
var LOCATION_STORAGE = '__LOCATION_STORAGE_VAR__';
function MyLocation(callback, options){
	// check null
	options = options ? options : {};
	// helpers
	var android = util.Android;
	
	this.eventHasFired = false;
	
	
	
	/********
	 * Init *
	 ********/
   	var self = {
   		timeout : DEFAULT_TIMEOUT,
   		lastLocationReturned : null,
   		date : null,
   		currentLocation : null,
   		locationServicesRunning : false,
   		foundNearbyLocation : false,
   		attempts : 0,
		accuracyIndex : (!android ? 2 : 0),
   		geolocationEnabled : Ti.Geolocation.getLocationServicesEnabled(),
    	accuracyLevels : (!android ? [
        	Ti.Geolocation.ACCURACY_BEST,  					// 0
        	Ti.Geolocation.ACCURACY_HIGH, 					// 1
        	Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS,		// 2
        	Ti.Geolocation.ACCURACY_HUNDRED_METERS,			// 3
        	Ti.Geolocation.ACCURACY_KILOMETER,				// 4
        	Ti.Geolocation.ACCURACY_LOW,					// 5
        	Ti.Geolocation.ACCURACY_THREE_KILOMETERS		// 6
        ] : [
        	Ti.Geolocation.ACCURACY_HIGH, 					// 0
        	Ti.Geolocation.ACCURACY_LOW						// 1
        ]),
        warning : null, // { name : <string>, message : <string> }
        error : null // { name : <string>, message : <string> }	
        
   	};
   	
   	self = _.extend({}, self, options);
   	
   	var locationObject = Ti.App.Properties.getObject(LOCATION_STORAGE);
	
	if (locationObject && locationObject.date) {
		var currentDate = moment();
		
		if(!_.isDate(locationObject.date)) { locationObject.date = moment(locationObject.date); }
		var diff = currentDate.diff(locationObject.date, 'seconds');
		if (diff < NEW_LOCATION_TIMEOUT_SEC) {
			self.currentLocation = locationObject;
			self.latitude = locationObject.latitude;
			self.longitude = locationObject.longitude;
			callback(self);
			return;
		} 
	};
   	
   	
   	/****************************************
   	 * Check settings for location services *
   	 ****************************************/
   	var errorMessage = null;
	if (self.geolocationEnabled) {
		// check the authorization
		var geo = Titanium.Geolocation;
		
		if (!android) {
			var authorization = Titanium.Geolocation.locationServicesAuthorization;
			if (authorization === Ti.Geolocation.AUTHORIZATION_DENIED) {
				errorMessage = {
					name : 'Authorization Denied',
					message : 	'Location services have been disabled for this '+
								'device or application. We suggest you enable your '+
								'services to take advantage of all of the applications features.'
				};
			} else if (authorization === Ti.Geolocation.AUTHORIZATION_RESTRICTED) {
			    errorMessage = {
			    	name : 'Authorization Restricted',
			    	message : 	'Your system has disallowed Titanium from '+
			    			 	'running geolocation services.' 
			    };
			}	
		} else {
			// check if device has wifi
			
			
			
		}
		
	} else {
		errorMessage = {
			name : 'Location Services Disabled',
			message : 'To use this feature you must first allow this '+
					  'application to use location services.'	
		};
	}
	
	/******************
   	 * Event Handlers *
   	 ******************/
   	
   	/**
   	 * Cancel the request, stop location services
   	 */
   	self.cancelCallback = function(e) {
		self.locationServicesRunning = false;
		Titanium.Geolocation.removeEventListener('location', locationEvent);
	};
   	
   	/**
   	 * 
   	 */
	var locationEvent = function(e) {
		// if (this.eventHasFired) { return; }
		this.eventHasFired = true;
		if (self.foundNearbyLocation) {
			self.cancelCallback();
			return;
		}
		
		self.locationServicesRunning = true;
		self.attempts++;
		
		// check if the location is found
		var coords = e.coords;
		
		if (!coords && !coords.accuracy) { 
			if (self.attempts > MAX_ATTEMPTS_PER_INDEX) {
				self.cancelCallback();
				callback(self);
			} return; 
		}
		
		// set the last location returned
		self.lastLocationReturned = coords;
		
		var createLocation = function(coordinate) {
		
			// get location object
			var lat = coordinate.latitude.toString();
			var lng = coordinate.longitude.toString();
			
			// remove unneeded accuracy levels
			if (lat.length > 8) { lat = lat.slice(0,8); } 
	        if (lng.length > 8) { lng = lng.slice(0,8); }
	        
	        location.location_id = null;
	        location.datetime = new Date();
	        location.latitude = lat;
	        location.accuracy = coords.accuracy;
	        location.longitude = lng;
	       	location.insert();
	       	
			return location;
		}
		
		// if the location is accurate
		if (coords.accuracy < MIN_ACCEPTABLE_ACCURACY) {
			
			self.cancelCallback();
			// stop the event handler
			self.foundNearbyLocation = true;
			self.latitude = coords.latitude;
			self.longitude = coords.longitude;
			self.currentLocation = createLocation(coords);
			// fire callback
			self.date = new Date();
			Ti.App.Properties.setObject(LOCATION_STORAGE, {
				date : self.currentLocation.datetime,
				latitude : self.currentLocation.latitude,
				longitude : self.currentLocation.longitude,
				accuracy : location.accuracy,
			});
			callback(self);
		
		} else { // if the location is not accurate enough
			
			// if the attempts reaches MAX_ATTEMPTS_PER_INDEX 
			if (self.attempts > MAX_ATTEMPTS_PER_INDEX) {
				// check if it can go to a lower index
				if (self.accuracyIndex + 1 > self.accuracyLevels.length) {
					// lower the index and reset attempts
					self.accuracyLevel++;
					self.cancelCallback();
					startGeolocation();
				} else {
					if (self.lastLocationReturned) {
						self.currentLocation = self.lastLocationReturned;
						callback(self);
					} else {
						self.error = {
							name : 'No Location Found',
							message : 'Could not find the current location.'
						};
						callback(self);
					}
				} 
			}			
		}
	};
	

	
	this.locationEventCount = 0;
var startGeolocation = function() {
	this.locationEventCount++;
	this.eventHasFired = false;
	// set manual mode for android
	if (android) { Titanium.Geolocation.Android.manualMode = false;	 }	
	
	// set purpose and accuracy
	Titanium.Geolocation.accuracy = self.accuracyLevels[self.accuracyIndex];
	Titanium.Geolocation.purpose = 'For Finding Nearby Properties';
	//Titanium.Geolocation.distanceFilter = 10;
	//Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
	if (android) {
		if (Ti.Network.networkType !== Ti.Network.NETWORK_WIFI) {
			// check if device has gps
			var gpsRule = Ti.Geolocation.Android.createLocationRule({
			    provider: Ti.Geolocation.PROVIDER_GPS,
			    // Updates should be accurate to 100m
			    accuracy: 500,
			    // Updates should be no older than 5m
			    maxAge: 300000,
			    // But  no more frequent than once per 10 seconds
			    minAge: 10000
			});
			Ti.Geolocation.Android.addLocationRule(gpsRule);
		}
	}
	
	// start location services
	
	
	Titanium.Geolocation.addEventListener('location', locationEvent);
	if (this.locationEventCount < 3) {
			setTimeout(function() {
	
			// check if the location services has been called, if it hasn't then call it
			if (!this.eventHasFired) {
				startGeolocation();
			}
		}, 2000);
	} else {
		if (!this.eventHasFired) {
			self.cancelCallback();
			//callback(null);	
		}
		
	}
			
};
    

	var messageDialog = function(message) {
		// check if this is the first time this error message has been displayed
		var locationMessage = locationMessageExists(message.name);
		// if yes, then display message then mark it as being display
		if (!locationMessage) {
			var dialog = Ti.UI.createAlertDialog({
	            cancel: 0,
	            buttonNames: message.buttons ? message.buttons : ['OK'],
	            message: message.message,
	            title: message.name
	        });	
	        
	        dialog.addEventListener('click', function(e){
	        	markMessageAsDisplayed(message);
	            if (e.index === e.source.cancel){
	                self.cancelCallback();
	            } else {
	                dialog.hide();
	            }
	        });
	        dialog.show();
		}
		// if no, ignore message
	};
	
	// if error message exists don't attempt request
	if (errorMessage) {
		self.error = errorMessage;
		callback(self);
		return self;
	}

	// start
	startGeolocation();
   	
   	return self;
}

/**
 *  
 * HELPER -- Sets a location message
 * @param {Object} name
 * @param {Object} value
 */
var locationMessageExists = function(messageName) {
	var lmo = __getLocationMessageObject();
	// check if the message has been displayed
	if (lmo[messageName]) {
		// object has displayed 
		return lmo[messageName];
	} else {
		return false;
	}
}

var markMessageAsDisplayed = function(message) {
	var lmo = __getLocationMessageObject();
	lmo[message.name] = message.message;
	__setLocationMessageObject(lmo);
}

var __setLocationMessageObject = function(obj) {
	Ti.App.Properties.setObject(LOCATION_MESSAGE_OBJ_NAME, obj);
};

var __getLocationMessageObject = function() {
	if (Ti.App.Properties.getObject(LOCATION_MESSAGE_OBJ_NAME)) {
		return Ti.App.Properties.getObject(LOCATION_MESSAGE_OBJ_NAME);
	} return {};
};
module.exports = MyLocation;