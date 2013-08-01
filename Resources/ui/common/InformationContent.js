var config       = require('lib/config');
var ppmoreinfo = require('lib/ppmoreinfo');
var ResultsRow = require('ui/widgets/ResultsRow');
var InformationDetailView = require('ui/tablet/InformationDetailView');

/**
 * Information Window Constructor
 * 
 * The gives the window to access different sections of information
 * 
 */
function InformationContent(params) {
    var self = Ti.UI.createView({
        layout: 'vertical',
        backgroundColor: '#eaeaea'
    });

    var versionView = Ti.UI.createView({
    	backgroundColor : 'transparent',
    	height : '35dp'
    });
	var versionLabel = Ti.UI.createLabel({
		width : '100%',
		height : '20dp',
		top : '10dp',
		font : { fontWeight : 'normal', fontSize : '13dp' },
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
    	text : 'Version: '+Ti.App.getVersion(),
    	color:'Gray'
    });
    versionView.add(versionLabel);
    
    // var tableOptions =  {
        // objName         : 'table',
        // data            : tableData,
        // backgroundColor : 'transparent',
        // footerView : versionView
    // };
    
    // if (config.getValue('osname') === 'iphone' || config.getValue('osname') === 'ipad' ) {
        // tableOptions.style = Ti.UI.iPhone.TableViewStyle.GROUPED;  
    // }

    var table = Ti.UI.createTableView({
        // objName         : 'table',
        // data            : tableData,
        backgroundColor: 'transparent',
        footerView: versionView
    });
        
    var tableData = [];
    // var labels = [];
    var count = ppmoreinfo.length;
   
    for (var index = 0; index < count; index++) {
        var resultsRow = ResultsRow({
            text: ppmoreinfo[index].title
        });
        
        // Make the first entry in the list the default viewable content for iPad
        if (config.getValue('istablet') && index == 0) {
            var informationDetailView = InformationDetailView({
                title: ppmoreinfo[index].title,
                content: ppmoreinfo[index].content
            });
            params.rightContainer.add(informationDetailView);
        }
        
        // Make the row respond to click events and transition to next page
        resultsRow.addEventListener('click', (function(index) { // closure
            return function() {
                // Determine which results window to use... dedicated for handheld, split for tablet
                if (config.getValue('istablet')) {
                    // params.activityIndicator.show();
        
                    // Remove all child views from the right container... removeAllChildren() not working
                    for (var child in params.rightContainer.children) {
                        if (child > 0) {
                            params.rightContainer.remove(params.rightContainer.children[child]);
                        }
                    }
        
                    informationDetailView = InformationDetailView({
                        title: ppmoreinfo[index].title,
                        content: ppmoreinfo[index].content
                    });
                    params.rightContainer.add(informationDetailView);
                    
                    // params.activityIndicator.hide();
                }
                else {
                    Ti.App.fireEvent('transitionWindow', {
                        window: '../handheld/InformationDetailWindow',
                        argument: {
                            title: ppmoreinfo[index].title,
                            content: ppmoreinfo[index].content
                        }
                    });
                }
            }
        })(index)
        );
        
        tableData.push(resultsRow);
        
       
    }

    table.setData(tableData);
    
    self.add(table);
    
    return self;
}

module.exports = InformationContent;