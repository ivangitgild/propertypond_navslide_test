var util 			= require('lib/utilities');
var _				= util._;
var SavedSearch 	= require('local_db/models/LocalSearch');
var Criteria 		= require('lib/Criteria');
var formData 		= require('lib/formData');

/*************
 * CONSTANTS *
 *************/

/***********
 * Methods *
 ***********/
/*
 * 
 * @method ~ load(default<boolean>) 
 * @params	default : overrides the existing property search with the default property search
 * @return void 
 * 
 * @method ~ savePropertySearch();
 * @return void
 * 
 * @method ~ setIncludeHistorical(historical<boolean>)
 * @return void
 * 
 * @method ~ setPropertySearch(propertySearch<Search.PropertySearch>);
 * @return void
 * 
 * @method ~ setPropertySearchType(Search.PROPERTY_SEARCH_TYPE>);
 * @return void
 *  
 * @method ~ getPropertySearch();  
 * @return <Search.PropertySearch>;   
 * 
 * @method ~ setCriteria(criteriaDef <CriteriaDef>)
 * @return void
 * 
 * @method ~ getCriteria()
 * @return <lib/Criteria.js>
 * 
 * @method ~ addField(field<string>,operator<Criteria.CRITERIA_OPERATOR>,value<object>,isString<boolean>)
 * @return void
 * 
 * @method ~ appendField(field<string>,operator<Criteria.CRITERIA_OPERATOR>,value<object>,isString<boolean>)
 * @return void
 * 
 * @method ~ addFunction(fn<function>)
 * @return void
 * 
 * @method ~ removeFunction(fn<function>)
 * @return void
 * 
 * @method ~ removeField(field<string>)
 * @return void
 * 
 * @method ~ reset()
 * @return void
 * 
 * @method ~ setIncludeHistorical(historical<boolean>)
 * @return void
 * 
 */ 
/*************
 * CONSTANTS *
 *************/
var __PROP_SEARCH_VAR  = null; // This gets set in function below

/***************
 * Constructor *
 ***************/
Search = Object.create(Criteria);

// Save the property Search
Search.savePropertySearch = function() {
	var PropertySearchAsString = JSON.stringify(this.PropertySearch); 
	// console.log('savePropertySearch: ', PropertySearchAsString);
	Ti.App.Properties.setObject(__PROP_SEARCH_VAR, this.PropertySearch);	
};

// Sets the property search object
Search.setPropertySearch = function(propertySearch) {
	propertySearch = propertySearch ? propertySearch : _.clone(this.DefaultPropertySearch);
	this.PropertySearch = propertySearch;
	this.setCriteria(propertySearch.criteria);
	this.savePropertySearch();
	return this.PropertySearch;
}

// Sets the property search type
Search.setPropertySearchType = function(type) {
	if (!this.PropertySearch) {
		this.PropertySearch = _.clone(this.DefaultPropertyListSearch);
	}
	this.PropertySearch.type = type;
	this.savePropertySearch();
}

// gets the property search type;
Search.getPropertySearchType = function() {
	return this.PropertySearch.type;
}

// Returns the property search object
Search.getPropertySearch = function() {
	return this.PropertySearch;
}

Search.setMapInformation = function(mapInfo){
    this.PropertySearch.mapInfo = mapInfo;
    this.savePropertySearch();
}

Search.getMapInformation = function(){
    if (!_.isObject(this.PropertySearch.mapInfo)){
        this.PropertySearch.mapInfo = {};
    }
    return this.PropertySearch.mapInfo;
}

Search.removeMapInformation = function(){
    this.PropertySearch.mapInfo = false;
    // console.log('removeMapInformation: ', JSON.stringify(this.PropertySearch));
}

Search.createMapMarker = function(listing, selected) {
    if (typeof(listing.status) == 'undefined') {
        throw('Status is required to create map marker');
    }
    
    selected = typeof(selected) !== 'undefined' ? selected : false;
    
    var status_str;
    if (Search.STATUS_STRING[listing.status]) {
        status_str = Search.STATUS_STRING[listing.status];
    }
    else {
        status_str = 'active';
        console.error("Missing status string for status '"+listing.status+"'!");
    }
    
    if (selected) {
        status_str = 'selected';
    }
    
    // Figure out what to show as the price. If it's sold show sold price, otherwise list price or lease price, if available.
    var price;
    if (listing.status == 8) {
        price = listing.sold_price ? Search.shortFormatPrice(listing.sold_price) : 'N/A';
    }
    else if (listing.listprice !== null) {
        price = Search.shortFormatPrice(listing.listprice);
    }
    else if (listing.leaseprice !== null) {
        price = Search.shortFormatPrice(listing.leaseprice);
    }
    else {
        price = 'N/A';
    }

    
    var iconView = Titanium.UI.createView({
        width: '36dp', // orig 72, x0.5
        height: '25dp', // orig 50, x0.5
        backgroundImage: '/images/map-markers/'+status_str+'.png'
    });
    
    var label = Titanium.UI.createLabel({
        top: '3dp',
        text: price,
        width: '32dp',
        height: '26dp',
        font: { fontSize: '10dp', fontWeight: 'bold' },
        color: '#ffffff',
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
    });
    iconView.add(label);
    
    if (util.Android) {
    	iconView._userData = listing;
    	iconView.userData = listing;
    }
    
    
    return iconView;
}

// Formats a price as, for example, '100k' or '1.1m'... used on map markers
Search.shortFormatPrice = function(listprice) {
    if (listprice < 1000) {
        return listprice;
    }
    if (listprice < 1000000) {
        return Math.floor(listprice / 1000) + 'k';
    }
    else {
        return (Math.floor(listprice / 100000) / 10).toFixed(1) + 'm';
    }
}


// Adds or replaces a field in the criteria
Search.addPropertyField = function(field,operator,value,fieldValue,isString) {
	this.PropertySearch.criteria = this.addField(field,operator,value,fieldValue,isString);
	this.savePropertySearch();
};

// Appends a field to the criteria
Search.appendPropertyField = function(field,operator,value,fieldValue) {
	this.PropertySearch.criteria = this.appendField(field,operator,value,fieldValue);
	this.savePropertySearch();
}

// Removes a field from the criteria
Search.removePropertyField = function(fieldName) {
    this.removeField(fieldName);
    this.savePropertySearch();
}

// Removes a field from the criteria by matching operator
Search.removePropertyFieldByOperator = function(fieldName, operator) {
    this.removeFieldOperator(fieldName, operator);
    this.savePropertySearch();
}

// Adds function
Search.addPropertyFunction = function(fn) {
	// invalid input that is being added to the iPad
	if (fn === "georect(-180,-180,-180,-180)") { return; }
	this.PropertySearch.criteria = this.addFunction(fn);
	this.savePropertySearch();
}

Search.removePropertyAll = function(exceptionFields) {
	this.removeAll(exceptionFields);
	this.savePropertySearch();
}

// Remove a function
Search.removePropertyFunction = function(fn) {
	this.removeFunction(fn);
	this.savePropertySearch();
}

// Remove a function using the function name
Search.removePropertyFunctionByName = function(fn) {
    this.removeFunctionByName(fn);
    this.savePropertySearch();
}

// Resets the propertySearch to default
Search.reset = function() {
    // Clone
    var newPropertySearch;
    if (__PROP_SEARCH_VAR === 'propertylist') {
    	newPropertySearch = JSON.parse( JSON.stringify( this.DefaultPropertyListSearch ) );
    } else if (__PROP_SEARCH_VAR === 'listingInventory') {
    	newPropertySearch = JSON.parse( JSON.stringify( this.DefaultInventorySearch ) );
    } else {
    	newPropertySearch = JSON.parse( JSON.stringify( this.DefaultPropertySearch ) );
    }
    
    this.setPropertySearch(newPropertySearch);
	this.setCriteria(this.PropertySearch.criteria);
}

// Sets the include historical property of the search object
Search.setIncludeHistorical = function(historical) {
	this.PropertySearch.includeHistorical = historical;
	this.savePropertySearch();
}

// Converts criteria to a description
Search.toDescription = function() {
	var fields = [];
	for (var fieldName in this.PropertySearch.criteria) {
		var field = this.PropertySearch.criteria[fieldName];
		var CRITERIA_FIELD = this.CRITERIA_FIELD[fieldName.toUpperCase()];
		if (CRITERIA_FIELD) {
			CRITERIA_FIELD.fieldName = fieldName;
			if (fieldName == 'listno') {
				CRITERIA_FIELD.formDataField = field.value;	
			}
			fields.push(CRITERIA_FIELD);
		}
	}
	// Sort based upon priority(value)
	fields.sort(this.__sortByValue);
	var display = this.PropertySearch.type;
	
	if (this.getCurrentNamespace() == 'listingNearby') {
		var location = this.getFunctionValue("geoclose");
		display += "location:"+location;
	}
	
	for (var a = 0; a < fields.length; a++) {
		var _field = fields[a];
		var obj = this.PropertySearch.criteria[_field.fieldName];
		
		if (_field.fieldName == 'listno') {
			display += (display.length > 0 ? ", " : "") + "MLS #"+_field.formDataField;
			continue;
		}		
		
		if (_.isArray(obj)) {
			var subvalue = "";			
			for (var b= 0; b < obj.length; b++) {
				var subobj = obj[b];
				var displayValue = this.__getFormDataTitle(_field.formDataField, subobj.value);
				if (displayValue != null) {
					subvalue += (subvalue.length > 0 ? " to " : "") + displayValue;	
				}
			}
			display += (display.length > 0 ? ", " : "") + subvalue;	
		} else {
			var displayValue = this.__getFormDataTitle(_field.formDataField, obj.value);
			if (displayValue != null) {
				display += (display.length > 0 ? ", " : "") + displayValue;	
			}
		}
	}
	return display;
}

Search.setCurrentNamespace = function(searchNamespace){
    if (searchNamespace != __PROP_SEARCH_VAR){
        console.log('New search namespace used: ', searchNamespace);
        __PROP_SEARCH_VAR = searchNamespace;        
        Search.__load();
        
    }
}

Search.getCurrentNamespace = function(){
    return __PROP_SEARCH_VAR;
}

Search.getDefaultCriteria = function(namespace) {
	var criteriaDef;
	switch (namespace) {
		case 'listingFormFarm' : 
		case 'listingFormResidential' : 
		case 'listingFormLand' : 
		case 'listingForm' : 
		case 'listingFormMultiunit' : 
		case 'listingFormCommercial' :
			criteriaDef = { status : {value:1,operator:1}}; 
			break;
		default :
			criteriaDef = {};
		break;
	}
	return criteriaDef;
}

/**
 * Handles the switching of the search namespace to property list
 */
Search.setPropertyListNamespace = function(type) {
    __PROP_SEARCH_VAR = 'propertylist';
};


/**
 * Handles the switching of the search namespace to favorites inventory and
 * the initializing of the favorites inventory search criteria
 */
Search.setFavoritesNamespace = function(favoritesNamespace) {
    Search.setCurrentNamespace(favoritesNamespace);
    Search.setPropertySearch(Search.DefaultFavoritesSearch);
};

Search.__getFormDataTitle = function(field,value) {
	var options = formData[field];
	if (!options) { return null; }
	for (var a=0;a<options.length;a++) {
		var opt = options[a];
		if (_.isArray(opt)) {
			for (var b = 0; b < opt.length;b++) {
				var subopt = opt[b];
				if (subopt.value == value) {
					return subopt.title;
				}
			}
		} else {
			if (opt.value == value) {
				return opt.title;
			}	
		}
		
	}
	console.log('Could not find value for field : ' + field);
	return null;
}

Search.__sortByValue = function(a,b) {
	return a.displayOrder - b.displayOrder;
}

Search.__load = function() {
	this.PropertySearch = Ti.App.Properties.getObject(__PROP_SEARCH_VAR);
	
	// Checks whether the property search exists, if not adds cloned version of default
	if (!this.PropertySearch) {
		this.PropertySearch = JSON.parse( JSON.stringify( this.DefaultPropertySearch ) );
	}
	this.setCriteria(this.PropertySearch.criteria);

	// Saves the property search
	this.savePropertySearch();
}

/*********
 * ENUMS *
 *********/
// Property Search Types
Search.PROPERTY_SEARCH_TYPE = {
	RESIDENTIAL    : 'Residential',
	FARM           : 'Farm',
	LAND           : 'Land',
	COMMERCIAL     : 'Commercial',
	MULTI          : 'Multi'
};

Search.MAP_ZOOM = {
    CURRENT_LOCATION    : 14,
    ZIPCODE             : 13,
    CITY                : 12,
    COUNTY              : 9,
    ADDRESS             : 16,
    STATE               : 7
};


// Fields to convert into a description
Search.CRITERIA_FIELD = {
	LISTNO 		: { displayOrder 	: 3, 	formDataField 	: null },
	TOT_BED 	: { displayOrder 	: 6, 	formDataField 	: 'bedData' },
	PROPTYPE 	: { displayOrder 	: 1, 	formDataField 	: 'typeData' },
	TOT_BATH 	: { displayOrder 	: 7, 	formDataField	: 'bathData' },
	DIM_ACRES 	: { displayOrder 	: 9, 	formDataField	: 'lotSizeData' },
	LISTPRICE 	: { displayOrder 	: 4, 	formDataField	: 'priceData' },
	STATUS 		: { displayOrder 	: 2, 	formDataField	: 'statusData' },
	TOTAL_SQF 	: { displayOrder 	: 5,	formDataField	: 'sqftData' },
	YEAR_BUILT 	: { displayOrder 	: 10, 	formDataField	: 'ageOfHomeData' }
};

// Convert a numeric status into a string. Strings parallel Metis.
Search.STATUS_STRING = {
    1: 'active',
    2: 'active_tc',
    3: 'under_contract',
    4: 'withdrawn',
    5: 'offmarket',
    6: 'expired',
    8: 'sold',
    9: 'active_ss',
    10: 'title',
    11: 'cert_occ',
    40: 'withdrawn_un'
}

Search.DefaultInventorySearch = {
	includeHistorical : false,
	mapInfo: { // Roughly shows the state of utah
	    latitude   : 39.99921417236328,
	    longitude  : -112.31401824951172,
	    zoom       : Search.MAP_ZOOM.STATE,
	    bounds     : false,
	    currentLocation : false,
	    query      : null,
	    longName   : null
	},
	type : Search.PROPERTY_SEARCH_TYPE.RESIDENTIAL,
	criteria: { }
}
	
// Default property search object
Search.DefaultPropertySearch = {
	includeHistorical : false,
	type : Search.PROPERTY_SEARCH_TYPE.RESIDENTIAL,
	mapInfo: { // Roughly shows the state of utah
	    latitude   : 39.99921417236328,
	    longitude  : -112.31401824951172,
	    zoom       : Search.MAP_ZOOM.STATE,
	    bounds     : false,
	    currentLocation : false,
	    query      : null,
	    longName   : null
	},
	criteria: {
	    status : {
	        operator : 1,
	        value    : 1
	    }
	}
}

// Default favorites inventory search params
Search.DefaultFavoritesParams = {
    isFavoritesSearch: true,
    criteria: {
        'property_rating/rating' : {
            operator : 3,
            value    : -1
        }
    }
};

Search.DefaultPropertyListSearch = {
	includeHistorical : true,
	type : Search.PROPERTY_SEARCH_TYPE.RESIDENTIAL,
	mapInfo: { // Roughly shows the state of utah
	    latitude   : 39.99921417236328,
	    longitude  : -112.31401824951172,
	    zoom       : Search.MAP_ZOOM.STATE,
	    bounds     : false,
	    currentLocation : false,
	    query      : null,
	    longName   : null
	},
	criteria : { }
};

// Default favorites inventory search object
Search.DefaultFavoritesSearch = _.extend({}, Search.DefaultPropertySearch, Search.DefaultFavoritesParams);

module.exports = Search;