// Require the underscore.js lib and the Parent Model
var _           = require('lib/underscore');
var ListingModel = require('./ListingModel');

// Create new object inheriting from the parent
var Commercial = Object.create(ListingModel); 

// Set the resource that applies to this model
Commercial.resource = 'Commercial';
Commercial.originalResource = Commercial.resource;

// Set the fields to be used when invoking limited results
Commercial.limitfields = new Array(
    'listno', 
    'image', 
    'status_tx', 
    'shortsale', 
    'yearblt', 
    'offeringtype_tx', 
    'address', 
    'listprice', 
    'leaseprice', 
    'office',
    'openhouse_count',
    'latitude', 
    'longitude', 
    'status', 
    'dt_sold', 
    'dt_expire',
    'property_rating'
);

/**
 * Grabs a SINGLE listing using it's unique listing number
 * 
 * @param {int} listno
 * @param {function} callback
 */
Commercial.getListing = function(listno, callback){
    this.setHistorical();
    this.getWithId('listno', listno, callback);
    this.resetHistorical();
}

/**
 * This calls the parent's object of the same name
 * 
 * @param {int} offset
 * @param {function} callback
 */
Commercial.getListings = function(offset, callback) {
    this.setHistorical();
    
    var selectFields = this.limitfields.slice(0);
    
    this.setViewingFavorites();
    
	this.getRowsWithOffset(selectFields, this.currentSearch.getPropertySearch(), offset, callback);
	this.resetHistorical();
}

module.exports = Commercial;