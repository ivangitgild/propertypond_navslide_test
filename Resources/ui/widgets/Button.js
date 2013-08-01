var _      = require('lib/underscore');

/**
 * 
 * @param {String} text
 * @param {Object} options
 * @param {Function} callback - Not Required
 */
var Button = function(text, options, callback){
    options = options || {};
    var defaults = {
        top: '10dp',
        left: '10dp',
        width: '300dp',
        height:'45dp',
        theme: 'white',
        enabled : true,
        buttonLabelTop: '10dp',
        buttonLabelSize: '17dp',
        onclick : function(){},
        index : false 
    }
    options = _.extend({}, defaults, options);
    
    var isEnabled       = options.enabled;
    var isSelected		= false;
    
    // White Theme, default
    var gradientColors  = [
        { color: '#ffffff', offset: 0}, 
        { color: '#ffffff', offset: .08 },
        { color: '#f1f1f1', offset: 1 } 
    ];
    var focusGradientColors = [
        { color: '#ffffff', offset: 0}, 
        { color: '#f4f4f4', offset: .08 },
        { color: '#e7e7e7', offset: 1 } 
    ];
    var color           = '#808284';
    var borderColor     = '#c7c7c7';
    
    // Disabled Colors and Gradients
    var disabledGradientColors  = [
        { color: '#fbfbfb', offset: 0}, 
        { color: '#efefef', offset: .08 },
        { color: '#dfdfdf', offset: 1 } 
    ];
    var disabledColor           = '#FFFFFF';
    var disabledBorderColor     = '#cbcbcb';
    
    // Blue Theme
    if (options.theme == 'blue' ){
        gradientColors = [
            { color: '#72b1e8', offset: 0}, 
            { color: '#5e9ce2', offset: .08 },
            { color: '#377cca', offset: 1 } 
            
        ]; 
        focusGradientColors = [
            { color: '#3776a8', offset: 0}, 
            { color: '#1d4667', offset: .08 },
            { color: '#27486c', offset: 1 } 
            
        ]; 
        var color           = '#FFFFFF';
        var borderColor     = '#285f9c';
    }
    
    // Initial Colors
    var initialColor            = options.enabled ? color           : disabledColor;
    var initialBorderColor      = options.enabled ? borderColor     : disabledBorderColor;
    var initialGradientColors   = options.enabled ? gradientColors  : disabledGradientColors;     
    
    // ButtonView, the base baseview of the button
    var buttonViewOptions = {
        width: options.width,
        height: options.height,
        layout: 'vertical',
        borderColor: initialBorderColor,
        backgroundGradient : {
            type: 'linear',
            startPoint: { x: '0%', y: '0%' },
            endPoint: { x: '0%', y: '100%' },
            colors:  initialGradientColors,
        },
        borderWidth: 1,
        borderRadius: 5
    }
    if (options.left){
        buttonViewOptions.left = options.left
    }
    if (options.top){
        buttonViewOptions.top = options.top
    }
    var buttonView = Ti.UI.createView(buttonViewOptions);
        // Login Text
        var textLabel = Ti.UI.createLabel({
            color: initialColor,
            text: text,
            top: options.buttonLabelTop,
            font: { fontSize: options.buttonLabelSize }
        });  
        buttonView.add(textLabel);
        
    // Touch Start, Highlight
    buttonView.addEventListener('touchstart', function(){
        if (!isEnabled){
            return false;
        }
        
        buttonView.setBackgroundGradient({
            type: 'linear',
            startPoint: { x: '0%', y: '0%' },
            endPoint: { x: '0%', y: '100%' },
            colors:  focusGradientColors
        });
    });
    
    // Touch End, End Highlight (click event called here)
    buttonView.addEventListener('touchend', function(e){
        if (!isEnabled){
            return false;
        }
        
        buttonView.setBackgroundGradient({
            type: 'linear',
            startPoint: { x: '0%', y: '0%' },
            endPoint: { x: '0%', y: '100%' },
            colors:  gradientColors
        });
        
        e.index = options.index; // Used for when this button class is used in a group scenario
        
        options.onclick(e);        
    });
    
    buttonView.setSelected = function(sender, selected) {
    	if (selected) {
    		sender.setBackgroundGradient({
                type: 'linear',
                startPoint: { x: '0%', y: '0%' },
                endPoint: { x: '0%', y: '100%' },
                colors:  focusGradientColors
            });
    	} else {
    		sender.setBackgroundGradient({
                type: 'linear',
                startPoint: { x: '0%', y: '0%' },
                endPoint: { x: '0%', y: '100%' },
                colors:  gradientColors
            });	
    	}
    	
    }
    
    // Set Enabled
    buttonView._setEnabled = function(enabled){
        isEnabled = enabled;
        // console.log('Enabled: ', buttonView);
        if (enabled){
            buttonView.setBackgroundGradient({
                type: 'linear',
                startPoint: { x: '0%', y: '0%' },
                endPoint: { x: '0%', y: '100%' },
                colors:  gradientColors
            });
            buttonView.setBorderColor(borderColor);
            textLabel.setColor(color);
        } else {
            buttonView.setBackgroundGradient({
                type: 'linear',
                startPoint: { x: '0%', y: '0%' },
                endPoint: { x: '0%', y: '100%' },
                colors:  disabledGradientColors
            });  
            buttonView.setBorderColor(disabledBorderColor);
            textLabel.setColor(disabledColor);      
        }
        
    }
    
   
    
    return buttonView;
};

module.exports = Button;
