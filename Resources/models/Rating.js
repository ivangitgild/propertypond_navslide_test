/**
 * Require/Imported Classes
 */
var _			= require('lib/underscore');
var ParentModel = require('./ParentModel');
/**
 * Create a new object that inherits from the parent
 */
Rating = Object.create(ParentModel);
Rating.resource = 'Rating';
Rating.allFields = new Array( 
	'agent_id',
	'branded_url_id',
	'client_id',
	'listno',
	'modified_time',
	'rating',
	'rating_id',
	'visibility'
);

Rating.limitedField = null;
Rating.keyField = "rating_id";

/**
 * 
 */
Rating.getRatingsByUser = function(agentId, propertyType, callback){
    // Select Fields
    var propertyTypeModel   = require('models/'+propertyType);
    
    this.resource = 'Rating' + propertyTypeModel.resource;
    
    var select              = propertyTypeModel.limitfields.slice(0);   // Clone with slice
    select.push('rating');
    select.push('agent_id');
    select.push('client_id');
    
    this.getWithQueryOptions("$filter=client_id eq "+agentId.toString()+ " and rating gt -1&$select=" + escape(select.join(','))+" &$orderby=rating&$top=300", callback);
    
    this.resource = 'Rating';   
}

/**
 * @param 	{int} 		listNo		required	listing number to retrieve rating
 * @param 	{function} 	callback 	required	function called when data is returned
 */
Rating.getRatingByListNumber = function(listNo, callback) {
	this.resource = 'Rating';
	if (!_.isFunction(callback)) {
		throw "The callback parameter provided was not a function";
	}
	
	this.getWithQueryOptions("$filter=listno eq " + listNo.toString()+' and client_id eq '+Ti.App.Properties.getInt('agent_id').toString(), callback);
}

Rating.createFavorite = function(listNo, callback) {
	var ratingData = {
		listno : listNo,
		client_id : Ti.App.Properties.getInt('agent_id'),
		rating : 0,
		visibility : 0,
		agent_id : 0,
		branded_url_id : 0
	};
	
	this.post(ratingData, callback);
}

/**
 * @param 	{int}   	rating 		required	/^[1-5]$/
 * @param	{function}	callback	required	function called when PUT request is complete 	 
 */
Rating.update = function(ratingData, callback) {
	if (ratingData.rating > 5 || ratingData.rating < 0) {
		Ti.API.debug("Your rating must be between 0-5");
		return;
	}
	
	if (ratingData.rating_id == undefined || ratingData.rating_id == null) {
		this.post(ratingData, callback);
	} else {
		this.put(ratingData, callback);
	}
}

module.exports = Rating;




