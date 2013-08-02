// Require the underscore.js lib and the Parent Model
var _           = require('lib/underscore');
var ListingModel = require('./ListingModel');

// Create new object inheriting from the parent
var Residential = Object.create(ListingModel); 

// Set the resource that applies to this model
Residential.resource = 'Residential';
Residential.originalResource = Residential.resource;

// Set the fields to be used when invoking limited results
Residential.limitfields = new Array(
    'listno', 
    'image', 
    'status_tx', 
    'shortsale', 
    'address', 
    'listprice', 
    'sold_price',
    'tot_bed', 
    'tot_bath', 
    'tot_sqf',
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
Residential.getListing = function(listno, callback){
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
Residential.getListings = function(offset, callback) {
    this.setHistorical();
    
    var selectFields = this.limitfields.slice(0);
    
    this.setViewingFavorites();
    
    this.getRowsWithOffset(selectFields, this.currentSearch.getPropertySearch(), offset, callback);
    this.resetHistorical();
}

module.exports = Residential;