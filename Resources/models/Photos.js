/**
 * Require/Imported Classes
 */
var _           = require('lib/underscore');
var ParentModel = require('./ParentModel');
/**
 * Create a new object that inherits from the parent
 */
Photos = Object.create(ParentModel);
Photos.resource = 'Photos';
Photos.keyField = "ListNo";

/**
 * @param   {int}       listNo      required    listing number to retrieve Photos
 * @param   {function}  callback    required    function called when data is returned
 */

Photos.getCountWithListNo = function(listNo, callback) {
	this.getCountWithFilter('ListNo eq '+listNo.toString(),callback);
};

Photos.getPhotosUsingListNumber = function(listNo, callback) {
	// get a count of all of the photos
	if (!_.isFunction(callback)) {
        throw "The callback parameter provided was not a function";
    }
    
    var self = this;
    this.getCountWithListNo(listNo, function(countData) {
        if (countData && countData.count && countData.count > 0) {
    	   self.getWithQueryOptions("$filter=ListNo%20eq%20"+listNo.toString()+"&$orderby=PhOrder&$top="+countData.count.toString(), callback);	
    	} else {
    	    callback([]); // Return empty array since there were no matching rows
    	}
    });
    
    
};

module.exports = Photos;


