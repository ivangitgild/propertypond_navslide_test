var config = require('lib/config');
var _      = require('lib/underscore');

var UreTableView = function(rows, options){
    var defaults = {
        top: 0,
        height: Ti.UI.FILL,
        scrollable: true
    }
    options = _.extend({}, defaults, options);
    
    // Add Sections as needed
    var addSectionHeaders = function(rows){
        var tableData = [];
        var currentSection = null;
        if ( !_.isString(rows[0]) ){
            if (config.getValue('osname') === 'android') {
               currentSection = Ti.UI.createView({
                    top: '5dp',
                    layout:'vertical',
                    height: Ti.UI.SIZE
                });
            } else {
                currentSection = Ti.UI.createTableViewSection({
                    headerTitle: ''
                });  
            }
    
            tableData.push(currentSection);
        }
        for(var i = 0; i < rows.length; i++){
            if (_.isString(rows[i])){
                if (config.getValue('osname') === 'android') {
                    currentSection = Ti.UI.createView({
                       top: '5dp',
                       layout:'vertical',
                       height: Ti.UI.SIZE
                    });
                    currentSection.add(Ti.UI.createLabel({
                        color: '#000',
                        font: { fontSize: '15dp' },
                        text: rows[i],
                        top: '0dp'
                    }));
                } else {
                    
                    currentSection = Ti.UI.createTableViewSection({
                        headerTitle: rows[i]
                    });
                }
                tableData.push(currentSection);  
            } else {
                currentSection.add(rows[i]);  
            } 
        }
        
        return tableData;
    }
    
    
    
    var layoutContainer = null;
    // Create view, table on IOS and web
	if (config.getValue('osname') === 'android') {
	   layoutContainer = Ti.UI.createScrollView({
	       top: options.top,
	       layout:'vertical',
	       windowSoftInputMode: Ti.UI.Android.SOFT_INPUT_STATE_HIDDEN,
	       height: options.height,
	       scrollingEnabled: options.scrollable
	   });
	   var tableData = addSectionHeaders(rows);
       for (var i = 0; i < tableData.length; i++) {
           layoutContainer.add(tableData[i]);
       }
       layoutContainer.add(Ti.UI.createView({
           height: '5dp'
       }));
	} else {
		var tableOptions = {
		    data : addSectionHeaders(rows),
		    top: options.top,
		    height: options.height,
		    backgroundColor: 'transparent',
		    scrollable: options.scrollable
		};
	    if (config.getValue('osname') === 'iphone' || config.getValue('osname') === 'ipad' ) {
	        tableOptions.style = Ti.UI.iPhone.TableViewStyle.GROUPED;  
	    }
	  	layoutContainer = Ti.UI.createTableView(tableOptions);
	  	
	  	

	}
	
    layoutContainer._delayedReload = function(newData){
        if (config.getValue('osname') === 'android') {
            layoutContainer.animate({
                duration : 500,
                opacity: 0
            }, function(){
                var tableData = addSectionHeaders(rows);
                for (var i = 0; i < tableData.length; i++) {
                    layoutContainer.add(tableData[i]);
                }
                layoutContainer.add(Ti.UI.createView({
                    height: '5dp'
                }));
                layoutContainer.animate({
                    duration : 500,
                    opacity: 1
                });
            });
        } else {
            layoutContainer.animate({
                duration : 500,
                opacity: 0
            }, function(){
                layoutContainer.setData(addSectionHeaders(newData));
                layoutContainer.animate({
                    duration : 500,
                    opacity: 1
                });
            });
        }
    }	
    
    layoutContainer._reload = function(newData){
        if (config.getValue('osname') === 'android') {
            var tableData = addSectionHeaders(rows);
            for (var i = 0; i < tableData.length; i++) {
                layoutContainer.add(tableData[i]);
            }
            layoutContainer.add(Ti.UI.createView({
                height: '5dp'
            }));
        } else {        
            layoutContainer.setData(addSectionHeaders(newData));
        }
    }       
	
	return layoutContainer;
}

module.exports = UreTableView;
