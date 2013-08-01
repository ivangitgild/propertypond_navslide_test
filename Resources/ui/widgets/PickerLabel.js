/**
 * The Picker Label is actually built on top of the picker view. It provides the label and the picker view
 * that is associated with that label.
 */

var _           = require('lib/underscore');
var config      = require('lib/config');
var PickerView  = require('ui/widgets/PickerView');

var osname = config.getValue('osname');

var PickerLabel = function(name, values, container, options){
    var defaults = {
        labelHeight : '40dp',
        labelWidth  : '220dp',
        labelRight  : '10dp',
        defaultText : 'Any',
        labelColor  : '#2377ba',
        labelFontSize : '16dp',
        selectedValue: false, 
        labelTextParser : function(value, title){
            if (_.isArray(title)) {
                var titles = [];
                _.each(value, function(value, index){
                    if (value != '-1'){
                        titles.push(title[index]);
                    }
                });
                return titles.join(',');
            } else {
                return title
            }
        }
    }
    options = _.extend({}, defaults, options);
    
    // Go through the selectedValues and come up with the proper values for the label and pickerView
    var labelText = false;
    var rowIndex  = 0;
    if (_.isArray(values[0]) && options.selectedValue){
        options.selectedIndex = [];
        var labelTextPieces = [];
        var labelValuePieces = [];
        for (var i = 0; i < values.length; i++){
            var indexPosition = -1;
            var labelText = null;
            if (options.selectedValue[i]){
                labelText = _.find(values[i], function(row){
                    indexPosition++; 
                    if (row.value == options.selectedValue[i]){
                        return true;
                    }
                });
            }
            
            if (typeof(labelText) != 'undefined' && labelText != null) {
                options.selectedIndex.push(indexPosition);
            }
            else {
                options.selectedIndex.push(0);
            }
            
            labelValuePieces.push( (labelText) ? labelText.value : -1 );    
            labelTextPieces.push( (labelText) ? labelText.title : '' );
            
             
        }
        labelText = options.labelTextParser(labelValuePieces, labelTextPieces);
    } else if (options.selectedValue) {
        var indexPosition = -1;
        var selectedRow = _.find(values, function(row){
                indexPosition++; 
                if (row.value.toString() == options.selectedValue.toString()){
                    return true;
                }
            });
        if (selectedRow != undefined) {
        	labelText = options.labelTextParser(selectedRow.value, selectedRow.title);
        	options.selectedIndex = indexPosition;
        }  
    }
    
    // Instance Variables
    var pickerShowing = false;
    var openingThisPicker = false;
    
    // Picker View Widget (pass through options)
    options.beforeClose = function(callback){
        messageView.animate({
            opacity : 0,
            duration: 250
        }, function(){
            callback();
        });
    }
    var pickerView = PickerView(name, values, options);
    container.add(pickerView);
    
    // Message View
    var messageView = Ti.UI.createView({
        height          : 30,
        bottom          : 281,
        backgroundColor : 'black',
        zIndex          : 3,
        opacity         : 0,
        visible         : false
    });
    container.add(messageView);
        var messageLabel = Ti.UI.createLabel({
            color:'white',
            text: '',
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            height: 30            
        });
        messageView.add(messageLabel);
    
    // Label
    var label = Ti.UI.createLabel({
        height: options.labelHeight,
        width:  options.labelWidth,
        right:  options.labelRight,
        text: labelText || options.defaultText,
        color: options.labelColor,
        textAlign:"right",
        font: { fontSize: options.labelFontSize }
    });    
    
    // Events
    label.addEventListener('click', function(e) { 
        if (pickerShowing){
            return;
        }
        
        openingThisPicker = true;
        
        Ti.App.fireEvent('App:hideAllDialogs', {});
        pickerView.fireEvent('slidein');  
    });
    
    pickerView.addEventListener('pickerDone', function(e){
        label.setText(options.labelTextParser(e.value, e.title));
        
        label.fireEvent('pickerDone', e); // Pass through to label since that is what we pass back
    });
    
    label.addEventListener('pickerShowOptions', function(e){
        pickerView.fireEvent('slidein');
    });
    
    label.addEventListener('pickerHideOptions', function(e){
        messageView.animate({
            opacity : 0,
            duration: 250
        }, function(){
            pickerView.fireEvent('slideout');
        });
              
    });    
    
    Ti.App.addEventListener('App:hideAllDialogs', function(){
        if (openingThisPicker){
            openingThisPicker = false;
            return;
        }
        
        pickerView.fireEvent('slideout');
    });
    
    label.addEventListener('reset', function(e){
        var labelText = '';
        if (_.isArray(values[0])){
            options.selectedIndex = [];
            var labelTextPieces = [];
            var labelValuePieces = [];
            for (var i = 0; i < values.length; i++){
                labelValuePieces.push( values[i][0].value );    
                labelTextPieces.push( values[i][0].title );
                
                labelText = options.labelTextParser(labelValuePieces, labelTextPieces); 
            }
        } else {
            labelText = options.labelTextParser(values[0].value, values[0].title);      
        }        
        label.setText(labelText);
        
        pickerView.fireEvent('reset');
    });  
    
    pickerView.addEventListener('pickerChange', function(e){
        label.fireEvent('pickerChange', e);  
    });
    
    label._showMessage = function(text){
        messageLabel.setText(text);
        messageView.setVisible(true);
        messageView.animate({
            opacity : .8,
            duration: 250
        });
    }
    
    label._hideMessage = function(text){
        
        messageView.animate({
            opacity : 0,
            duration: 250
        }, function(){
            messageView.setVisible(false);
        });
        
    }
    
    label._disableButtons = function(disable){
        pickerView._disableButtons(disable);
    }
    
    // Return    
    return label;
};

module.exports = PickerLabel;