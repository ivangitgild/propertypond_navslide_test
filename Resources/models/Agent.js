// Require the underscore.js lib and the Parent Model
var _           = require('lib/underscore');
var ParentModel = require('./ParentModel');

// Create new object inheriting from the parent
var Agent = Object.create(ParentModel); 

// Set the resource that applies to this model
Agent.resource = 'Agent';

// Field lists for search and detail views.
Agent.searchfields = new Array('AgentID', 'OfficeID', 'AgtFirst', 'AgtLast', 'photo_url_sm');
Agent.detailfields = new Array('AgentID', 'OfficeID', 'AgtFirst', 'AgtLast', 'AgtEmail', 
	'AgtAdd1', 'AgtAdd2', 'AgtCity', 'AgtState', 'AgtZip',
	'AgtPhone1', 'AgtPhone2', 'AgtPhone3', 'AgtPhone4');

/**
 * Grabs a SINGLE listing using its unique listing number
 * 
 * @param {int} AgentID
 * @param {function} callback
 */
Agent.getAgent = function(AgentID, callback){
    this.getWithId('AgentID', AgentID, callback);
}

/**
 * This calls the parent's object of the same name
 * 
 * @param {int} offset
 * @param {function} callback
 */
Agent.getAgents = function(criteria, offset, callback) {
	// TODO Replace 2nd null with Criteria parameter
    this.getRowsWithOffset(this.searchfields, criteria, offset, callback);
}

/**
 * Returns an agent record, or why it failed
 * 
 * @param {string} query
 * @param {int} limit
 * @param {int} offset
 * @param {function} callback
 */
Agent.authenticate = function(username, password, callback){
    this.getWithQueryOptions("$filter=PublicID eq '"+username+"' and AgtPass eq '"+password+"'", callback);
}

// Return Agent Model
module.exports = Agent;