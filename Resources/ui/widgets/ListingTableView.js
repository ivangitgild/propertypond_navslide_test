// import  
var _						= require('lib/underscore');
var util 					= require('lib/utilities');
var MapTableViewRow 		= require('ui/common/listingreports/listview/ListRowContent');
var RowContent              = require('ui/tablet/widgets/ListRowContent');
// construct
/***********************************************************************************
 ***********************************************************************************
 * @name {ClassName}								
 * @description {Description}	
 * @param {Object} options								
 *  ↳ {Array} data													
 *  ↳ {String} backgroundColor, seperatorColor		
 * 	↳ {Integer} columns	 ** 1 or 2 **			
 * @return {TiUIView}								
------------------------------------------------------------------------------------
 * @event viewDidAppear({Sender})					
 * @event viewDidDisappear({Sender})	
 * @event tableRowClicked({TableRow})
 * @event lastTableRow({Object});
 * ↳ {Integer} rowIndex
 * ↳ {TiUITableView} source					
------------------------------------------------------------------------------------
 * @method _setSelectedRow({RowCredentials})
 * @method _addResultSet({ResultSet})
 * @method _setDataSource({ResultSet})					
------------------------------------------------------------------------------------
 * @property _selectedRow {TableRow}							
 ***********************************************************************************
 ***********************************************************************************/

/*************
 * CONSTANTS *
 *************/
var TABLE_ROW_HEIGHT = '150dp';

/*************
 * CONSTRUCT *
 *************/
function ListingTableView(options, resultSet) {
	var isAndroid = util.Android;
	var defaults = {
		backgroundColor : '#eaeaea',
		seperatorColor : '#cdcdcd',
		data : [],
		loading : false
	};
	var rowCount = 0;
	options = _.extend({}, defaults, options);
	
	var role = Ti.App.Properties.getString('role');
	
	var currentCount = 0;
	var self = Ti.UI.createTableView(options);
	self._tableRows = [];
	self._selectedRow = null;
	self._currentViewMode = resultSet ? resultSet.viewMode : 'map';
	self._columns = options.columns ? options.columns : 2; 
	self._selectedRowCell = null;
	delete options.columns;
	/**********
	 * EVENTS *
	 **********/
	// Loads when the view opens or appears
	self.addEventListener("focus", function(e) {
		self.fireEvent('viewDidAppear', e);
	});
	
	// Loads when the view closes or is not visible
	self.addEventListener("blur", function(e) {
		self.fireEvent('viewDidDisappear', e);
	});
	
	self._lastTableRow = false;
	self.addEventListener('scroll', function(e) {
        // check to see if the user is at the bottom of the table 
        // and if the table has more rows available
        if (!isAndroid) {return;}
        if (e.firstVisibleItem+e.visibleItemCount === e.totalItemCount) {
        	self._lastTableRow = true;
            
        }
        Ti.API.info('-------------------');
        Ti.API.info( 'e.firstVisibleItem: ' + e.firstVisibleItem);
        Ti.API.info( 'e.totalItemCount: ' + e.totalItemCount);
        Ti.API.info( 'e.visibleItemCount: '+ e.visibleItemCount);
    });
	
	self.addEventListener('scrollend', function(e) {
        // check to see if the user is at the bottom of the table 
        // and if the table has more rows available
        if (!util.Android) {
        	var rowContentY = e.size.height + e.contentOffset.y;
	        var rowHeight = parseInt(TABLE_ROW_HEIGHT);
	        if (rowContentY === e.contentSize.height) {
	        	self.fireEvent('lastTableRow', { rowIndex : rowCount });
	        }	
        } else  {
        	if (self._lastTableRow) {
        		self.fireEvent('lastTableRow', { rowIndex : rowCount });
        		self._lastTableRow = false;
        	}
        	
        }
        
        
    });
    
	/***********
	 * METHODS *
	 ***********/
	/**
	 * NOTE : REMOVE ME
	 * Sets my Property
	 * @param {Object} obj 
	 */
	self._setSelectedRow = function(rowInformation) {
		// highlight the selected row
	};
	
	/**
	 * 
	 */
	self._getListingCount = function() {
		return currentCount === undefined ? 0 : currentCount;
	};
	
	var selectCell = function(e) {
		if (self._selectedRowCell != e.selectedCell) {
			if (self._selectedRowCell) { 
				self._selectedRowCell._deselect(); 
			}
			self._selectedRowCell = e.selectedCell;
			self.fireEvent('TableView:tableRowClicked', { data : e.data });
		}
	}
	
	/**
	 * Appends new data to table
	 * @param {ResultSet} resultSet
	 */
	self._addResultSet = function(resultSet) {
		// if (resultSet.listings.length === 0) { return; }
		// load the table rows
		var listings = resultSet.listings;
		var next 	 = resultSet.next;
		var totalCount = resultSet.totalCount;
		var listingCount = resultSet.listings.length;
		
		currentCount += resultSet.listings.length;
		
		var viewMode = resultSet.viewMode;
		if (viewMode != self._currentViewMode) {
			rowCount = listings.length;
		} else {
			rowCount += listings.length;
		}
		
		var rows = [];
		self._currentViewMode = viewMode;
		var Search = require('lib/PropertySearch');
		
        // Zero Results
        if (listings.length == 0 && rowCount === 0) {
            var NoResultsRow = require('ui/common/listingreports/listview/NoResults');
            var noResultsRow = NoResultsRow();
            rows.push(noResultsRow);
        } else {
    		for (var i = 0; i < listings.length; i++) {
    			var listing = listings[i];
    			var rowContainer;
    			var historical = false;
    			if (self._columns == 1) {
    				rowContainer= new MapTableViewRow(listing, {
    					propertyType : Search.PropertySearch.type,
    					rating : (_.isNumber(listing.property_rating.rating) && listing.property_rating.rating > -1) ? listing.property_rating.rating : false,
    					hasDetail: true,
    					hasChild: false
    				});
    				
    				historical = util.isHistoricalListing(listing);
    				
    				 // Need to define this here so it doesn't change in DetailView
    				rowContainer.eventData = {
    	            	listno: listing.listno,
    	                type: Search.PropertySearch.type,
    	                isHistorical: historical
    				};
    	            
    	            // Make the row respond to touchend events and transition to next page
    	            rowContainer.addEventListener('click', function(e) {
    	                // Alert consumer user if listing is historical and listing not sent from an agent (not accessible)
                        if (role != 'member' && this._isHistorical()) {
                            alert('This listing is no longer available to view');
                        } else {
                            // If the detail arrow was clicked go to the detail page, otherwise highlight the corresponding marker.
                            if (e.detail) {
            	                Ti.App.fireEvent('transitionWindow', {
            	                    window: '../tablet/DetailWindow',
            	                    argument: this.eventData,
            	                });
        	                }
        	                else {
        	                    self.fireEvent('ListingTableView:rowClicked', { listno: this.eventData.listno, index: e.index });
        	                }
        	            }
    	            });
    					
    			} else if (self._columns === 2) {
    				if (i % 2 === 0) {
        				rowContainer = Ti.UI.createTableViewRow({});
    					rowContainer.selectionStyle = 'none'
    					resultSet.listings[i].cellIndex = i;

    					var leftCell = new RowContent(Ti.UI.createView({
    						left : 0,
    						width : '50%',
    						height : '100dp'
    					}), resultSet.listings[i],{
    					    propertyType : Search.PropertySearch.type,
                            rating : (_.isNumber(listings[i].property_rating.rating) && listings[i].property_rating.rating > -1) ? listings[i].property_rating.rating : false
    					});
    					leftCell.addEventListener('tableRowClicked', selectCell);
    					rowContainer.add(leftCell);

    					if (resultSet.listings[i+1]) {
    						resultSet.listings[i+1].cellIndex = i+1;
    						var rightCell = new RowContent(Ti.UI.createView({
    							left : '50%',
    							width : '50%',
    							height : '100dp'
    						}),resultSet.listings[i+1],{
    						    propertyType : Search.PropertySearch.type,
                                rating : (_.isNumber(listings[i+1].property_rating.rating) && listings[i+1].property_rating.rating > -1) ? listings[i+1].property_rating.rating : false
    						});
    						rightCell.addEventListener('tableRowClicked', selectCell);
    						rowContainer.add(rightCell);
    					}
    				} else {
    					continue; // you need this to avoid double spacing
    				}
    			}
        		rows.push(rowContainer);
    		}
    		
		}
		self._tableRows = rows;
		var oldRows = self.data;
		rows = oldRows.concat(rows);
		self.setData(rows);
		self._data = rows;
		rowCount += rows.length;
		self.fireEvent('ListingTableView:newRowsAdded', { currentCount : currentCount });
	};
	
	/**
	 * Clears old result set and adds a new one 
 	 * @param {Object} resultSet
	 */
	self._setDataSource = function(resultSet) {
		self.setData([]);
		rowCount = 0;
		currentCount = 0;
		self._addResultSet(resultSet);
	}
	
	if (resultSet && !options.loading) {
		self._setDataSource(resultSet);
	}
	
	return self;
}

module.exports = ListingTableView;