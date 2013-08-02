/**
 * @Name : AddressBook
 * @database : r3d0
 * @table : s_addressbk
 * @author : Jason Foster (January 23, 2013)
 */

var _			= require('lib/underscore');
var ParentModel = require('./ParentModel');

/**
 * Create a new object that inherits from the parent
 * This is pulling data from the database table s_addressbk
 * No limited Fields defined yet
 */
AddressBook = Object.create(ParentModel);
AddressBook.resource = 'AddressBook';
AddressBook.limitedField = null;

/**
 * Get Addresss Book Contact
 * @parameter 	{int} 		agentId		required
 * @parameter 	{function} 	callback 	required
 */
AddressBook.getContact = function(agentId, callback) {
	if (!_.isFunction(callback)) {
		throw "Callback provided to the Address Book model query function is not a function";
	}
	this.getWithId("agentid", agentId, callback);
}

/**
 * Get Address Book Contacts with Fitler
 * @parameter 	{string} 	filter		required
 * @parameter 	{int}		offset		required
 * @parameter 	{function} 	callback 	required
 */
AddressBook.getContactsWithPaging = function(filter, offset, callback) {
	var query = "";
	query += filter ? "$filter=" + filter : "";
	query += offset ? "&$skip=" + offset.toString() : "";
	this.getWithQueryOptions(query, 
		// parse and sort data
		function(data) {
			var dataSource = [];
			for (var a = 0; a < data.length; a++) {
				var entry = data[a];
				var firstName = entry.first ? entry.first : "";
	    		var lastName  = entry.last ? entry.last : "";
	    	
	    		if (firstName.length > 0 && lastName.length == 0) {
	    		
	    			var parts = firstName.split(' ');
	    			firstName= "";
	    		
	    			lastName = parts[parts.length - 1];
	    			for (var b = 0; b < parts.length - 1;b++) {
	    				firstName += (b > 0 ? " " : "") + parts[b];
	    			}
	    		}
	    		entry.first = firstName;
	    		entry.last = lastName;
	    		entry.fullName = lastName + ", " + firstName;
	    		entry.headerTitle = lastName[0].toUpperCase();
	    		dataSource.push(entry);	    	
			}
			
	    	dataSource.sort(__sort);
			callback(dataSource); 
	
	});
}

function __sort(a,b) {
// Sorts Ascending
	a.last = a.last.toLowerCase();
	a.first = a.first.toLowerCase();	

	b.last = b.last.toLowerCase();
	b.first = b.first.toLowerCase();


	if (a.last != b.last) {
		return a.last < b.last ? -1 : 1;
	} else {
		if (a.first != b.first) {
			return a.first < b.first ? -1 : 1;
		}
	}
	// no sort needed
	return 0;
}		


module.exports = AddressBook;
