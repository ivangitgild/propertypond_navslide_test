var _       = require('lib/underscore');
var config  = require('lib/config');

var osname = config.getValue('osname');

var widgetHeight = (osname != 'android') ? 281 : 300;

var PickerView = function(name, values, options){
    var multiColumns = ( _.isArray(values[0]) ) ? true : false;
    
    var defaults = {
        selectedIndex : ((multiColumns) ? [] : 0),
        beforeClose     : function(callback){
            callback();
        },
        bottom: -widgetHeight
    }
    if (multiColumns){
        for(var i = 0; i < values.length; i++){
            defaults.selectedIndex[i] = 0;        
        }
    }
    options = _.extend({}, defaults, options); 
    
    // variables used throughout
    var currentSelectedIndex = options.selectedIndex;
    var preDoneSelectedIndex = options.selectedIndex;
    var panelShowing         = false;
    var setDefaultValues     = true;

    // Picker View
    var pickerView = Titanium.UI.createView({
        height          : widgetHeight,
        bottom          : options.bottom,
        zIndex          : 50,
        backgroundColor : '#181c18'
    });
    
        // Cancel Button
        var cancelOptions = {
            title:'Cancel',
            style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
        };
        if (osname === 'android'){
            delete cancelOptions.style;
            cancelOptions.left = '5dp';
            cancelOptions.top = 4;
        }
        var cancel =  Titanium.UI.createButton(cancelOptions);
        cancel.addEventListener('click', function(){
            preDoneSelectedIndex = currentSelectedIndex;
            
            pickerView.fireEvent('slideout');
        });
     
        // Done Button
        var doneOptions = {
            title:'Done',
            style:Titanium.UI.iPhone.SystemButtonStyle.DONE
        };
        if (osname === 'android'){
            delete cancelOptions.style;
            doneOptions.right = '5dp';
            doneOptions.top = 4;
        }
        var done =  Titanium.UI.createButton(doneOptions);
        done.addEventListener('click', function(){
            var currentValue = [];
            var currentTitle = [];
            if ( multiColumns ){
                // console.info('values: ', values, 'preDoneSelectedIndex: ', preDoneSelectedIndex);
                for(var i = 0; i < values.length; i++){
                    // console.log('Title '+i+': '+values[i][preDoneSelectedIndex[i]].title);
                    currentValue[i] = values[i][preDoneSelectedIndex[i]].value;
                    currentTitle[i] = values[i][preDoneSelectedIndex[i]].title;
                }   
            } else {
                currentValue = values[preDoneSelectedIndex].value;
                currentTitle = values[preDoneSelectedIndex].title;
            }
            
            currentSelectedIndex = preDoneSelectedIndex;
            pickerView.fireEvent('pickerDone', {
                title : currentTitle,
                value : currentValue
            });
            
            pickerView.fireEvent('slideout');
        });
        
        
        // Toolbar
        if (osname != 'android'){
            // Spacer
            var spacer =  Titanium.UI.createButton({
                systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
            });

            var labelTitle = Ti.UI.createLabel({
                text: name,
                color: 'white'
            });
         
            // Toolbar
            var toolbar = Titanium.UI.iOS.createToolbar({
                top : 0,
                items:[cancel, spacer, labelTitle, spacer, done],
                barImage: '/images/navBar.png',
                barColor: '#4f90d9',
            });
            pickerView.add(toolbar);
        } else {
            var toolbarView = Ti.UI.createView({
                top: 0,
                height: 73,
                backgroundGradient: {
                    type: 'linear',
                    colors: ['#dbe0e2','#a9adb9'],
                    startPoint: {x:0,y:0},
                    endPoint:{x:0,y:56},
                    backFillStart:false
                }
            });
            
            toolbarView.add(Ti.UI.createView({
                top     : 0,
                height  : 1,
                backgroundColor: '#84868c'
            }));
            
            toolbarView.add(cancel);
            toolbarView.add(done);
            pickerView.add(toolbarView);
        }
         
        // Picker (single and multi column)
        var picker = Titanium.UI.createPicker({
                top : ((osname === 'android') ? 95 : 43), //65 (android)
                useSpinner: true
        });
        picker.addEventListener('change', function(e){
            if ( multiColumns ){
                preDoneSelectedIndex[e.columnIndex] = e.rowIndex; 
            } else {
                preDoneSelectedIndex = e.rowIndex;
            }
            
            var currentValue = [];
            var currentTitle = [];
            if ( multiColumns ){
                // console.info('values: ', values, 'preDoneSelectedIndex: ', preDoneSelectedIndex);
                for(var i = 0; i < values.length; i++){
                    // console.log('Title '+i+': '+values[i][preDoneSelectedIndex[i]].title);
                    currentValue[i] = values[i][preDoneSelectedIndex[i]].value;
                    currentTitle[i] = values[i][preDoneSelectedIndex[i]].title;
                }   
            } else {
                currentValue = values[preDoneSelectedIndex].value;
                currentTitle = values[preDoneSelectedIndex].title;
            }
            e.value = currentValue;
            e.title = currentTitle;
            
            // console.log('change something', preDoneSelectedIndex);
            pickerView.fireEvent('pickerChange', e);  
        });
        picker.selectionIndicator = true;
        
        // Setup the rows (columns and rows if necessary)
        if ( multiColumns ){
            var column = [];
            var row    = null;
            for (var i = 0; i < values.length; i++){
                column[i] = Ti.UI.createPickerColumn();

                for(var j = 0; j < values[i].length; j++){
                    row = Titanium.UI.createPickerRow({title: values[i][j].title, value: values[i][j].value});
                    column[i].addRow(row);
                }
            }
            picker.add(column);
        } else {
            var pickerData = [];
            for (var i = 0; i < values.length; i++){
                pickerData[i] = Titanium.UI.createPickerRow({title: values[i].title, value: values[i].value});
            }
            picker.add(pickerData);
        }
        pickerView.add(picker);
    
    // Function to set the picker to the default values the first time
    var setPickerToDefaultValues = function(){
        // Set default values
        if (multiColumns){
            // console.info('selectedIndex: ', i, options.selectedIndex[i]);
            for(var i = 0; i < options.selectedIndex.length; i++){
                picker.setSelectedRow(i, 0, false);
            } 
        } else {
            picker.setSelectedRow(0, 0, false);       
        }
    }
    
    // Function to set the picker to the selected values the first time
    var setPickerToSelectedValues = function(){
        // Set default values
        if (multiColumns){
            // console.info('selectedIndex: ', i, options.selectedIndex[i]);
            for(var i = 0; i < options.selectedIndex.length; i++){
                picker.setSelectedRow(i, options.selectedIndex[i], false);
            } 
        } else {
            picker.setSelectedRow(0, options.selectedIndex, false);       
        }
    }
    
    // Events (custom)
  	pickerView._slidein = function(e){
        if (panelShowing){
            return;
        }
        
        // We have the set the default values here because IOS doesn't like to do it before
        if (setDefaultValues){
            setPickerToSelectedValues();
            setDefaultValues = false;
        }        
        
        pickerView.animate({bottom:0}, function(){
            if (e.afterSlide){
                e.afterSlide();
            }
        });    
        panelShowing = true;
    };
    
    pickerView.addEventListener('slidein',pickerView._slidein);
    
    
    pickerView._slideout = function(e) {
        if (!panelShowing){
            return;
        }
        options.beforeClose(function(){
            pickerView.animate({bottom:-widgetHeight});    
            panelShowing = false; 
        });
   
    };
    pickerView.addEventListener('slideout',pickerView._slideout);
    pickerView.addEventListener('reset', function(){
        setPickerToDefaultValues();
    });
    
    pickerView._disableButtons = function(disable){
        cancel.setEnabled(!disable);
        done.setEnabled(!disable);
    };

    return pickerView;
}

module.exports = PickerView;