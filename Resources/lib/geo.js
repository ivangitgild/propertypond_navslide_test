var GOOGLE_BASE_URL = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true&components=country:US&address=';
var ERROR_MESSAGE = 'There was an error geocoding. Please try again.';

var addressComponentsTrans = {
    postal_code                 : 'zip',
    locality                    : 'city',
    administrative_area_level_2 : 'county',
    administrative_area_level_1 : 'state',
    street_number               : 'current_location' // Special value
};

var TYPE = {
	UNKNOWN : 0,
	STATE 	: 1,
	CITY 	: 2,
	COUNTY 	: 3,
	ADDRESS : 4,
	OTHER 	: 5
};

/**
 * A list of know bad locations, and to corresponding value of what they should
 * be converted to, keep the key lowercased.  If this gets too big this cold be
 * a problem
 */

var badLocations = {
	
    'juab'              : 'Juab County, UT',
    'brigham'           : 'Brigham City',
    'cache'             : 'Cache County, UT',
    'clinton'           : 'Clinton, UT',
    'salt lake county'  : 'Salt Lake County, UT',
    'st. george'        : 'St George',
    'adamsville'        : '84731',
    'burbank'           : '84751',
    'glen canyon'       : '84741',
    'cache junction'    : '84304',
    'beaverdam'         : '84306',
    'thatcher'          : '84337',
    'young ward'        : '84339',
    'green lake'        : '84046',
    'red canyon'        : '84023',
    'bryce'             : 'bryce canyon',
    'bethel'            : '84728',
    'petra'             : '84728',
    'topaz'             : '84635',
    'woodrow'           : '84624',
    'swan creek'        : '84028',
    'emigration canyon' : '84108',
    'snowbird'          : '84092',
    'irish green'       : '84533',
    'lake powell'       : '84533',
    'monument valley'   : '84536',
    'natural bridges'   : '84533',
    'bowery haven'      : '84701',
    'gooseberry'        : '84654',
    'fish lake'         : '84701',
    'pine cliff'        : '84017',
    'greenhaven'        : '84083',
    'cedar valley'      : '84013',
    'sundance'          : '84604',
    'daniels'           : '84032',
    'chekshani cliffs'  : '84757',
    'winchester hills'  : '84770',
    'central'           : '84722',
    'slaterville'       : '84404',
    'venice'            : '84701',
    'bridgeland'        : '84021',
    'cisco'             : '84515',
    'newcastle'         : '84756',
    'mount carmel'      : '84755',
    'duck creek village': '84762',
    'oasis'             : '84624',
    'sutherland'        : '84624',
    'brighton'          : '84121',
    'thistle'           : '84629',
    'austin'            : '84754',
    'gusher'            : '84026',
    'ouray'             : '84026',
    'brookside'         : '84782',
    'draper'            : '84020',
    'taylor'            : '84401',
    'petersboro'        : '84325',
    'milford'			: 'Milford, UT',
    '84129'             : 'Taylorsville, UT'        
};

/**
 * An unfortunate function that looks for known locations where googles geocoding
 * comes up short.
 *
 * @param location The location provided by the user to examine
 */
var filterBadLocations = function(location){
    var newValue = badLocations[location.toLowerCase()];
    return (newValue) ? newValue : location;
}

var getAddressComponents = function (address_info, component_type) {
    // search through address components
    for(var i = 0; i < address_info.address_components.length; i++) {
        if (address_info.address_components[i].types[0] == component_type) {
            return address_info.address_components[i]['short_name'];
        }
     }
}

exports.forwardGeocode = function(address, callback) {
    if (address === ''){
        return;
    }
    
    address = filterBadLocations(address); // Check for known bad locations
    console.log('function: ', callback);
    if (Ti.Platform.osname === 'mobileweb') {
        forwardGeocodeWeb(address, callback);
    } else {
        forwardGeocodeNative(address, callback);
    }
};


var parseGoogleData = function(address, results) {

	var result = null;
	var searchType = TYPE.UNKNOWN;
	
	var _check = function(_result) {
		if (!result && (res.formatted_address.indexOf(', UT') !== -1)) {  /* ||
						res.formatted_address.indexOf(', ID') !== -1 ||
						res.formatted_address.indexOf(', WY') !== -1 ||
						res.formatted_address.indexOf(', NV') !== -1 ||
						res.formatted_address.indexOf(', AZ') !== -1))*/ 
							return true;
						}
		return false;			
	};
	
	// get the search type
	if (address.toLowerCase().indexOf('county') != -1) { searchType = TYPE.COUNTY; }
	else if (address.toLowerCase().indexOf('city') != -1) { searchType = TYPE.CITY; }
	
	for (var a=0;a<results.length;a++) {
		var res = results[a];
		var resCheck = _check(res);
		if (searchType != TYPE.UNKNOWN) {
			for (var b=0;b<res.types.length;b++) {
				var resType = res.types[b];
				if (resType === 'locality' && searchType === TYPE.CITY && resCheck) {
					result = res;
					break;
				}
				if (resType === 'administrative_area_level_2' && searchType === TYPE.COUNTY && resCheck) { 
					result = res;
					break;
				}
			}	
		} 
		
		if (results.length === 1 && resCheck) {
			result = res;
		}	
		
		if (result) { break; }
	}
	
	return result;
	
}

var forwardGeocodeNative = function(address, callback) {
    var xhr = Titanium.Network.createHTTPClient();
    
    xhr.open('GET', GOOGLE_BASE_URL + escape(address));
    xhr.onload = function() {
        var json = JSON.parse(this.responseText); // console.log(this.responseText);

        if (json.status == "ZERO_RESULTS"){
            callback(false);
            alert('Unable to geocode the address. Please try improving your current search.');
            return;
        }
        
		var result = parseGoogleData(address, json.results);
		if (!result && address.toLowerCase().indexOf(', ut') === -1) {
			forwardGeocodeNative(address+', UT', callback);
			return;
		} else {
			if (json.results.length > 0) {
				result = json.results[0];
			} else {
				callback(false);
            	alert('Unable to geocode the address. Please try improving your current search.');
            	return;
			}
		}
        
        // Go through the address_components and find our most 
        var firstAddressComponent = result.address_components[0]; // This is the most detailed result
        var typeTranslation       = null
        for (var i = 0; i < firstAddressComponent.types.length; i++){
            typeTranslation = addressComponentsTrans[firstAddressComponent.types[i]]; //console.log('tt: ', typeTranslation);
            if (typeTranslation){
                break;
            }
        }
        
        
        // Callback
        callback({
            query : address, 
            latitude : result.geometry.location.lat,
            longitude: result.geometry.location.lng,
            shortName: firstAddressComponent.short_name,
            longName : result.formatted_address.replace(/, USA/g,""),
            type: typeTranslation,
            bounds : result.geometry.bounds
        });
    };
    xhr.onerror = function(e) {
        Ti.API.error(e.error);
        alert(ERROR_MESSAGE);
    };
    xhr.send();
};

var forwardGeocodeWeb = function(address, callback) {
    var geocoder = new google.maps.Geocoder();
    if (geocoder) {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(new GeoData(
                    address, 
                    results[0].geometry.location.lat(),
                    results[0].geometry.location.lng()
                ));
            } else {
                Ti.API.error(status);
                alert(ERROR_MESSAGE);   
            }
        });
    } else {
        alert('Google Maps Geocoder not supported');    
    }
};

exports.reverseGeocode = function(latitude, longitude, callback){
    var xhr = Titanium.Network.createHTTPClient();
    xhr.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true');
    xhr.onload = function() {
        var json = JSON.parse(this.responseText); // console.log(this.responseText);
        if (json.status == "ZERO_RESULTS"){
            callback(false);
            // 	alert('Unable to reverse geocode the provided lat/long. Please try improving your current search.');
            return;
        }
        
        // Callback
        callback(json.results);
    }
    xhr.onerror = function(e) {
        Ti.API.error(e.error);
        alert(ERROR_MESSAGE);
    };
    xhr.send();
}

exports.queryAddress = function(address) {
	// break down address
	
	// does the address have a street number
	
	// does the address have a street name
	
	//
};
