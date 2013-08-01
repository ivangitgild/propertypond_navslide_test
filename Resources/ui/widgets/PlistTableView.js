// import  
var _                       = require('lib/underscore');
var RowContent              = require('ui/widgets/PlistRowContent');

// construct
/***********************************************************************************
 ***********************************************************************************
 * @name {ClassName}                                
 * @description {Description}   
 * @param {Object} options                              
 *  ↳ {Array} data                                                  
 *  ↳ {String} backgroundColor, seperatorColor      
 *  ↳ {Integer} columns  ** 1 or 2 **           
 * @return {TiUIView}                               
------------------------------------------------------------------------------------
 * @method _addResultSet({ResultSet})
 * @method _setDataSource({ResultSet})                  
 ***********************************************************************************
 ***********************************************************************************/

/*************
 * CONSTRUCT *
 *************/
function PlistTableView(options, resultSet) {
    var defaults = {
        backgroundColor : '#eaeaea',
        seperatorColor : '#cdcdcd',
        loading : false
    };
    options = _.extend({}, defaults, options);

    var self = Ti.UI.createTableView(options);
    self._tableRows  = [];
    self._countStart = 0;
    self._countEnd   = 0;

    /***********
     * METHODS *
     ***********/

    /**
     * Appends new data to table
     * @param {ResultSet} resultSet
     */
    self._addResultSet = function(resultSet) {

        // Set up some of the counter vars
        self._countStart  = self._countEnd + 1;
        self._countEnd   += resultSet.length;
        var rows = [];

        // Zero Results
        if (resultSet.length == 0) {
            var NoResultsRow = require('ui/common/listingreports/listview/NoResults');
            var noResultsRow = NoResultsRow({
                text: 'You have no saved Property Lists.'
            });
            rows.push(noResultsRow);
        } else {
            for (var i = 0, j = resultSet.length; i < j; i++) {
                var data = resultSet[i];       // Get the data for this row
                var rowContainer= new RowContent(data);
                rows.push(rowContainer);
            }
        }
        self._tableRows = self._tableRows.concat(rows);
        self.setData(self._tableRows);
    };
    
    /**
     * Clears old result set and adds a new one 
     * @param {Object} resultSet
     */
    self._setDataSource = function(resultSet) {
        self._tableRows = [];
        self._countStart = 0;
        self._countEnd   = 0;
        self._addResultSet(resultSet);
    }

    if (resultSet && !options.loading) {
        self._setDataSource(resultSet);
    }

    return self;
}

module.exports = PlistTableView;