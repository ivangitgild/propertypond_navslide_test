// Require the underscore.js lib and the Parent Model
var _           = require('lib/underscore');
var ListingModel = require('./ListingModel');

// Create new object inheriting from the parent
var Farm = Object.create(ListingModel); 

// Set the resource that applies to this model
Farm.resource = 'Farm';
Farm.originalResource = Farm.resource;

// Set the fields to be used when invoking limited results
Farm.limitfields = new Array(
    'listno', 
    'image', 
    'status_tx', 
    'shortsale', 
    'address', 
    'listprice', 
    'sold_price', 
    'dim_acres', 
    'zoningchar', 
    'office',
    'openhouse_count',
    'latitude', 
    'longitude', 
    'status', 
    'dt_sold', 
    'dt_expire', 
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
Farm.getListing = function(listno, callback){
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
Farm.getListings = function(offset, callback) {
    this.setHistorical();
    
    var selectFields = this.limitfields.slice(0);
    
    this.setViewingFavorites();
    
    this.getRowsWithOffset(selectFields, this.currentSearch.getPropertySearch(), offset, callback);
    this.resetHistorical();
}

module.exports = Farm;