// Require the underscore.js lib and the Parent Model
var _           = require('lib/underscore');
var ParentModel = require('./ParentModel');

// Create new object inheriting from the parent
var Office = Object.create(ParentModel); 

// Set the resource that applies to this model
Office.resource = 'Office';

/**
 * Grabs a SINGLE listing using its unique listing number
 * 
 * @param {int} OfficeID
 * @param {function} callback
 */
Office.getOffice = function(OfficeID, callback){
    this.getWithId('OfficeID', OfficeID, callback);
}

// Return Office Model
module.exports = Office;