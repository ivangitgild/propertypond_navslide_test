var _           = require('lib/underscore');
var ParentModel = require('./ParentModel');
var Search      = require('lib/PropertySearch');

var ListingModel = Object.create(ParentModel);

ListingModel.originalResource = null;

ListingModel.useHistoricalResource    = false;

/**
 * Determines whether the resource should be a historical one or not
 */
ListingModel.setHistorical = function(){
    if (Search.PropertySearch.includeHistorical || this.useHistoricalResource){
        this.originalResource = this.resource;
        this.resource = this.originalResource + 'All';
    } else {
        this.resource = this.originalResource;
    }
    //console.log('Set Resource: '+this.resource);
}

/**
 * Resets Resource back to the original resource
 */
ListingModel.resetHistorical = function(){
    this.resource = this.originalResource;
    //console.log('Reset Resource: '+this.resource);
}

/**
 * Change to the rating resource if user is viewing favorites inventory
 */
ListingModel.setViewingFavorites = function(){
    if (Search.PropertySearch.isFavoritesSearch) {
        this.originalResource = this.resource;
        this.resource = this.originalResource + 'All';
        return true;
    } else {
        return false;
    }
}

ListingModel.currentSearch = Search;

// Return Listing Model
module.exports = ListingModel;