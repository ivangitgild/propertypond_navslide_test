var config 	= require('lib/config');
var _      	= require('lib/underscore');
var util	= require('lib/utilities');


var UreTableRow = function(leftView, rightView, options){
    var defaults = {
        top: -1,
        width: '300dp',
        height: '45dp',
        
        borderColor: '#cbcbcb',
        title : false
    }
   

    
    options = _.extend({}, defaults, options);
        
    options.backgroundColor = options.backgroundColor === undefined ? '#ffffff' : options.backgroundColor;
    options.color = options.color === undefined ? '#000' : options.color;
    
    // Create the Row. On Android we simulate this with a view. Why? 
    // Because textfields in rows on Android does unexpected stuff.
    var row = null;
    if (config.getValue('osname') === 'android') {
        row = Ti.UI.createView({
            top: options.top,
            height : options.height,
            width: options.width ,
            backgroundColor: options.backgroundColor,
            borderColor: options.borderColor,
            borderWidth: 1,
            borderRadius: 5
        });
    // Iphone Or Mobile Web
    } else {
        // Row Options
        var rowOptions = {
            height: options.height,
            backgroundColor:  options.backgroundColor,
            color : options.color
        };

        // Iphone ONly
        if (config.getValue('osname') === 'iphone' || config.getValue('osname') === 'ipad') {
            rowOptions.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE; 
        } 

        var row = Ti.UI.createTableViewRow(rowOptions);
    }
    
        // Add Left View First, if it's not falsy
        if (leftView){
            if (_.isString(leftView)){
                row.add(Ti.UI.createLabel({
                    left: '8dp',
                    color: options.color,
                    font: { fontSize: '15dp', fontWeight: 'bold' },
                    text: leftView,
                    top: '11dp'
                }));
            } else {
                row.add(leftView);    
            }
            
        }
        
        // Add Right View Next, if it's not falsy
        if (rightView){
            row.add(rightView);
        }
        
        if (!(leftView && rightView) && options.title){
            row.add(Ti.UI.createLabel({
                width: Ti.UI.FILL,
                color: options.color,
                font: { fontSize: '15dp', fontWeight: 'bold' },
                text: options.title,
                textAlign: 'center',
                top: '11dp'
            }));
        }
        
    row._getRightView = function(){
        return rightView;
    } 
    
    row._getLeftView = function(){
        return leftView;
    }         
        
    return row;
}  
  
module.exports = UreTableRow;

  
  