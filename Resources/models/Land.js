// Require the underscore.js lib and the Parent Model
var _           = require('lib/underscore');
var ListingModel = require('./ListingModel');

// Create new object inheriting from the parent
var Land = Object.create(ListingModel); 

// Set the resource that applies to this model
Land.resource = 'Land';
Land.originalResource = Land.resource;

// Set the fields to be used when invoking limited results
Land.limitfields = new Array(
    'listno', 
    'image', 
    'status_tx', 
    'shortsale', 
    'address', 
    'listprice', 
    'sold_price', 
    'leaseprice', 
    'dim_acres', 
    'zoningchar', 
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
Land.getListing = function(listno, callback){
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
Land.getListings = function(offset, callback) {
	this.setHistorical();
	
	var selectFields = this.limitfields.slice(0);
    
    this.setViewingFavorites();
	
    this.getRowsWithOffset(selectFields, this.currentSearch.getPropertySearch(), offset, callback);
    this.resetHistorical();
}

module.exports = Land;