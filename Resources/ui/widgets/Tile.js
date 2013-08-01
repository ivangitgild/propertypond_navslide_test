var _      = require('lib/underscore');
var config       = require('lib/config');

var Tile = function(text, tileImage, options){
    var defaults = {
        top: '10dp',
        width: '300dp',
        onclick : function(){}
    }
    options = _.extend({}, defaults, options);
    
    // Vars
    var osname = config.getValue('osname');
    var loadingShowing = false;
    
    // Main Container For Tile
    var tileContainer = Ti.UI.createView({
        top: options.top,
        width: options.width,
        height: '60dp',
    });
    tileContainer.addEventListener('touchend', function(){
        arrowContainer.remove(arrowLabel);
        arrowContainer.add(activityIndicator);
        activityIndicator.show();
        loadingShowing = true;
        
        options.onclick.call(tileContainer);
         
    });
    tileContainer.addEventListener('touchstart', function(){
        tileBgView.setBackgroundColor('#d9d9d9');  
    });
    var transitionDone = function(){
        if (loadingShowing){
            activityIndicator.hide();
            arrowContainer.remove(activityIndicator);
            arrowContainer.add(arrowLabel);
            
            tileBgView.setBackgroundColor('#FFFFFF'); 
            
            loadingShowing = false;
        }  
    };
    Ti.App.addEventListener('transitionWindowDone', transitionDone); // Phones, Ipad
    Ti.App.addEventListener('app:homeSlideInViewDone', transitionDone); // Ipad
    
        // Grey Background View
        var tileBgView = Ti.UI.createView({
            backgroundColor: '#FFFFFF',
            borderRadius: 5,
            opacity: .2
        });
        tileContainer.add(tileBgView);
        
        // The vertical layout display container
        var tileDisplayContainer = Ti.UI.createView({
            layout: 'horizontal'
        });
        tileContainer.add(tileDisplayContainer);
        
            // The Image
            tileDisplayContainer.add(Ti.UI.createView({
                height: '35dp',
                width: '35dp',
                top: '12dp',
                left: '12dp',
                backgroundImage: "/images/"+tileImage
            }));
            
            // The text label
            tileDisplayContainer.add(Ti.UI.createLabel({
                color: '#FFFFFF',
                text: text,
                top: '18dp',
                left: '12dp',
                width: (parseInt(options.width.replace("dp","")) - 105)+'dp',
                font: { fontSize: '18dp' }
            }));
            
            // Array and loader container
            var arrowContainer = Ti.UI.createView({
                height: '20dp',
                width: '20dp',
                top: '20dp',
                left: '12dp'
            });
            tileDisplayContainer.add(arrowContainer);
            
                // Loader ICON
                var activityIndicator = Ti.UI.createActivityIndicator({
                  height: '20dp',
                  width: '20dp',
                  indicatorColor: 'white' 
                });
                
                // The arrow
                var arrowLabel = Ti.UI.createLabel({
                    height: '20dp',
                    width: '13dp',
                    left: '6dp',
                    backgroundImage: "/images/arrow-white.png"
                });
                arrowContainer.add(arrowLabel);
    
    tileContainer._cancelLoading = function(){
        transitionDone();
    }
    
    return tileContainer;
};

module.exports = Tile;
