var _       = require('lib/underscore');
var config  = require('lib/config');

var osname = config.getValue('osname');

/**
 * ButtonBarView is a small toolbar view with a button bar widget within
 * 
 * @param {Object} options
 */
var ButtonBarView = function(options){
    var defaults = {
        labels : [],
        index  : 0,
        width : '300dp',
        bottomBorder : false
    };
    options = _.extend({}, defaults, options);
    var selected = null;
    
    var buttonBarContainer = Ti.UI.createView({
        top: 0,
        height: '46dp',
        // backgroundGradient: {
            // type: 'linear',
            // colors: ['#dbe0e2','#a9adb9'],
            // startPoint: {x:0,y:0},
            // endPoint:{x:0,y:'46dp'},
            // backFillStart:false
        // }
    });
    
        // Bottom Border of the container
        if (options.bottomBorder) {
	        buttonBarContainer.add(Ti.UI.createView({
	            bottom: 0,
	            height: 1,
	            backgroundColor: '#82868d'
	        }));
    	}
        // Button Bar itself, use native on ipad and iphone, otherwise we have to create soemthign similar :(
        if (osname === 'iphone' || osname === 'ipad'){
            var buttonBar = Titanium.UI.iOS.createTabbedBar({
                top: '7dp',
                height: '32dp',
                backgroundColor: '#4f90d9',
                width: options.width,
                labels: options.labels,
                style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
                index: options.index
            });
            buttonBarContainer.add(buttonBar);
            buttonBar.addEventListener('click', function(evt){
                buttonBarContainer.fireEvent('bbvClick', evt);
            });
            
        // Button Bar (manually made) for android and the rest
        } else {
            var Button = require('ui/widgets/Button');
            var buttonView = Titanium.UI.createView({
                top: '7dp',
                height: '32dp',
                width: '300dp',
                layout: 'horizontal'
            });
            buttonBarContainer.add(buttonView);
            
            var buttonWidth = parseInt((300 - options.labels.length - 2) / options.labels.length);
            var firstButtonPassed = false
            
            var btns = [];
            for (var i = 0; i < options.labels.length; i++){
                var currentButton = Button(options.labels[i], {
                    width: buttonWidth+'dp',
                    height: '32dp',
                    left: firstButtonPassed ? '1dp' : '0dp',
                    top: 0,
                    buttonLabelTop: '3dp',
                    theme: 'blue',
                    index : i,
                    onclick : function(e){
                        var cBtn = btns[e.index];
                        buttonBarContainer.fireEvent('bbvClick', e);   
                        currentButton.setSelected(cBtn, true);    
                        if (selected) {
                        	currentButton.setSelected(selected, false);
                        } 
                        selected = cBtn;
                    }
                    
                });
                
                currentButton._index = i;
                var currentNum = i;
                
                buttonView.add(currentButton);

                firstButtonPassed = true;
                btns.push(currentButton);
            }
            
            
        }
    
    return buttonBarContainer;
}

module.exports = ButtonBarView;
