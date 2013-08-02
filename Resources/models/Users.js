// Require the underscore.js lib and the Parent Model
var config		= require('lib/config');
var _           = require('lib/underscore');
var ParentModel = require('./ParentModel');

// Create new object inheriting from the parent
var Users = Object.create(ParentModel); 

// Set the resource that applies to this model
Users.resource = 'Users';

// Field lists for search and detail views.
Users.searchfields = new Array('userid','email','type');
Users.detailfields = new Array('userid','email','firstname','lastname','phone');

/**
 * Grabs a SINGLE listing using its unique listing number
 * 
 * @param {int} AgentID
 * @param {function} callback
 */
Users.getUser = function(UserID, callback){
    this.getWithId('userid', UserID, callback);
}

/**
 * This calls the parent's object of the same name
 * 
 * @param {int} offset
 * @param {function} callback
 */
Users.getUsers = function(criteria, offset, callback) {
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
Users.authenticate = function(username, password, callback){
    this.getWithQueryOptions('/user/login',"email="+username+"&password="+password, callback);
}

Users.register = function(email, password, callback){
	var client_id = config.getValue('client_id');
    var client_secret = config.getValue('client_secret');
    var grant_type	= config.getValue('grant_type');
    this.getAccessToken(function(data){
    	if(_.size(data) > 0) {
    		console.log(_.size(data));
    		console.log(callback);
    		var postData = {
    			client_id : client_id,
    			client_secret : client_secret,
    			grant_type : grant_type,
    			access_token : data.access_token,
    			email : email,
    			password : password
    		};
    		ParentModel._httpRequest('POST', null, postData, '/user/register', callback);
    	}
    });
}
// Return Agent Model
module.exports = Users;