/**
 * Require/Imported Classes
 */
var _           = require('lib/underscore');
var ParentModel = require('./ParentModel');

/**
 * Create a new object that inherits from the parent
 */
PlistDetails = Object.create(ParentModel);      // Base this on the parent model of all models
PlistDetails.resource = 'PlistDetails';         // The oData entity we are querying
PlistDetails.keyField = 'stg_id';               // The primary key field of this oData entity
PlistDetails.limitfields = ['stg_id','target_id','viewed','recipient']; // If we want to limit the return fields, create an array here

/**
 * Gets multiple rows
 * 
 * @param {object}      critera     required    must be object of type lib/Criteria
 * @param {int}         offset      required    what offset do we start at ?
 * @param {function}    callback    required    function called when data is returned
 */
PlistDetails.getMany = function(criteria, offset, callback) {
    criteria.addField('stg_removed', criteria.CRITERIA_OPERATOR.EQUALS, 0);
    this.getRowsWithOffset(this.limitfields, criteria, offset, callback);
}

/**
 * Gets just 1 row based upon the primary key field
 * 
 * @param {int}         id          required    primary key value we are looking for
 * @param {function}    callback    required    function called when data is returned
 */
PlistDetails.getOne = function(id, callback) {
    this.getWithId(this.keyField, id, callback);
}

module.exports = PlistDetails;