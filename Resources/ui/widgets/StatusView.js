var _           = require('lib/underscore');
var config      = require('lib/config');
var util 		= require('lib/utilities');

var ActivityView = function(options){
    options = options || {};
    var defaults = {
        top             : 0,
        width           : Ti.UI.FILL,
        height          : '30dp',
        borderRadius    : 0,
        zIndex          : 3,
        visible         : false,
        opacity         : .75,
        // visibleOpacity  : .75,
        message         : ' Fetching Results...',
        backGround      : true,
        backgroundColor : 'transparent',
        labelText       : false,
        textAlign 		: Ti.UI.TEXT_ALIGNMENT_CENTER,
        labelFont       : { fontFamily:'Arial', fontSize: '14dp' },
        labelColor      : 'white',
    }
    options = _.extend({}, defaults, options);
    
    var indicatorShowing;
    
    var activityView = Ti.UI.createView({
        opacity: options.opacity,
        height: options.height,
        width: options.width,
        borderRadius: options.borderRadius,
        top: options.top,
        zIndex: options.zIndex,
        backgroundColor : options.backgroundColor,
        visible: options.visible,
    });
    	
    	if (options.right) {
    		activityView.setRight(options.right);
    	}
	    var colors = ["#1a1a1a", '#2e2e2e'];
	    if (util.Android) {
	    	colors = ['#1692ff', '#0b66b6'];
	    	
	    }	

        // If they asked for a background, specify it
        if (options.backGround) {
            activityView.setBackgroundGradient({
                type : 'linear',
                colors : colors,
                startPoint : { x: '0%', y:'0%' },
                endPoint : { x : '0%', y : '100%' }
            });
        }

        // Activity Indicator
        var style = null;
        if (util.iOS) { // For iPhone/iPad
            style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
        } else { // For Android
            style = Ti.UI.ActivityIndicatorStyle.DARK;
        }
        // The actual Activity Indicator
        var activityIndicator = Ti.UI.createActivityIndicator({
          color: options.labelColor,
          font: options.labelFont,
          message: '  '+options.message,
          // style : style,
          top:'5dp',
          left:'5dp',
          height: '20dp',
          width:Ti.UI.SIZE
        });
        activityView.add(activityIndicator);
        
        if (options.message){
            activityIndicator.show();
            indicatorShowing = true;
        }

        // Label, used for status text
        var statusLabel = Ti.UI.createLabel({
            color: options.labelColor,
            font: options.labelFont,
            text: options.labelText,
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            top: '6dp',
            left: '12dp',
            width: 'auto', height: '20dp',
            visible: false
        });
        
        activityView.add(statusLabel)
    
    // Widget Functions
    activityView._show = function(){
        activityView.setVisible(true);
    }
    
    activityView._hide = function(){
        activityView.setVisible(false);
    }
    
    activityView._showLabel = function(text){
        if (indicatorShowing){
            activityIndicator.hide();
            indicatorShowing = false;
        }
        if (text){
            statusLabel.setText(text); 
        }
        
        statusLabel.setVisible(true);
    };
    
    activityView._showActivityIndicator = function(text){
        if (!indicatorShowing){
            statusLabel.setVisible(false);
            indicatorShowing = true;
        }
        if (text){
            activityIndicator.setMessage(text); 
        }
        
        activityIndicator.show();
    }
    
    activityView._isActivityIndicatorShowing = function(){
        return indicatorShowing;
    }
	
    return activityView;
};

module.exports = ActivityView;
