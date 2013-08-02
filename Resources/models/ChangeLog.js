/**
 * @Name : ChangeLog
 * @database : r3d0
 * @table : s_changelog
 * @author : Jason Foster (January 23, 2013)
 */

/**
 * Require/Imported Classes
 */
var _			= require('lib/underscore');
var ParentModel = require('./ParentModel');

/**
 * Create a new object that inherits from the parent
 */
ChangeLog = Object.create(ParentModel);
ChangeLog.resource = 'ChangeLog';
ChangeLog.limitfields = null;

/**
 * Grabs a SINGLE listing using it's unique listing number
 * 
 * @param {int} listno
 * @param {function} callback
 */
ChangeLog.getOne = function(id, callback){
    this.getWithId('ChangeID', id, callback);
}

/**
 * This calls the parent's object of the same name
 * 
 * @param {int} offset
 * @param {function} callback
 */
ChangeLog.getMany = function(criteria, offset, callback) {
    this.getRowsWithOffset(this.limitfields, criteria, offset, callback);
}

module.exports = ChangeLog;
