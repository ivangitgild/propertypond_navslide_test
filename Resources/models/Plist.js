/**
 * Require/Imported Classes
 */
var _           = require('lib/underscore');
var ParentModel = require('./ParentModel');

/**
 * Create a new object that inherits from the parent
 */
Plist = Object.create(ParentModel);     // Base this on the parent model of all models
Plist.resource = 'Plist';               // The oData entity we are querying
Plist.keyField = 'st_id';               // The primary key field of this oData entity
Plist.limitfields = ['st_id','actor','st_lastrun','st_listnum','st_ptype','name','visibility','sender']; // If we want to limit the return fields, create an array here

/**
 * Get the count of matching rows
 * 
 * @param {int}         AgentID     required    AgentID we are interested in
 * @param {function}    callback    required    function called when data is returned
 */
Plist.getCountWithAgentID = function(AgentID, callback) {
    this.getCountWithFilter('actor eq ' + AgentID.toString(), callback);
};

/**
 * Gets multiple rows
 * 
 * @param {object}      critera     required    must be object of type lib/Criteria
 * @param {int}         offset      required    what offset do we start at ?
 * @param {function}    callback    required    function called when data is returned
 */
Plist.getMany = function(criteria, offset, callback) {
    this.getRowsWithOffset(this.limitfields, criteria, offset, callback);
}

/**
 * Gets just 1 row based upon the primary key field
 * 
 * @param {int}         id          required    primary key value we are looking for
 * @param {function}    callback    required    function called when data is returned
 */
Plist.getOne = function(id, callback) {
    this.getWithId(this.keyField, id, callback);
}

module.exports = Plist;