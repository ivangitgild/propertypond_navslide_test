// import  
var util 			= require('lib/utilities');
var _				= util._;
// construct
/***********************************************************************************
 ***********************************************************************************
 * @name {ClassName}								
 * @description {Description}						
 * @return {TiUIView}	
------------------------------------------------------------------------------------
 * @param {Object} options <TiUIView>
    ↳ {Color} textColor		
    ↳ {String} messageText	
------------------------------------------------------------------------------------
 * @event messageDisplayed({Sender});					
 * @event messageCleared({Sender});				
------------------------------------------------------------------------------------
 * @method _displayMessage();
 * @method _clearMessage();					
------------------------------------------------------------------------------------
 * @property {Boolean} _displaying 							
 ***********************************************************************************
 ***********************************************************************************/
function MessageView(options) {
	var defaults = { 
		messageText : 'You must pass messageText in the options param',
		backgroundColor : 'Black',
		textColor : 'White',
		width : '100%',
		height : '45dp',
		top : 0
	};
	
	// set defaults
	options = _.extend({}, defaults, options);
	var textColor = options.textColor;
	delete options.textColor;
	var messageText = options.messageText;
	delete options.messageText;
	
	/********
	 * INIT *
	 ********/	
	// create view
	var self = Ti.UI.createView(_.extend({},options,{backgroundColor:'transparent', opacity: 0.0}));
	var background = Ti.UI.createView(_.extend({},options,{top:0}));
	self.add(background);
	// create label
	var labelOptions = { 
		color : textColor, 
		font : {
			fontWeight : 'Bold', 
			fontSize : '14dp'
		}, 
		text : messageText, 
		textAlignment : Ti.UI.TEXT_ALIGNMENT_CENTER 
	};
	var label = Ti.UI.createLabel(labelOptions);
	self.add(label);
	
	/**************
	 * PROPERTIES *
	 **************/
	// set property defaults
	self._displaying = false;
	/***********
	 * METHODS *
	 ***********/
	/**
	 * clears the message
	 */
	var fadeTime = null;
	self._clearMessage = function() {
		self._showing = false;
		var fadeOut = Ti.UI.createAnimation({
			opacity : 0,
			duration : 500
		});
		fadeOut.addEventListener('complete', function(e) {
			self.fireEvent('messageCleared', { fadeTime : fadeTime });
			fadeTime = null;
			fadeOut = null;
		});
		self.animate(fadeOut);
	};
	/**
	 * displays the message
 	 * @param {Integer} fadeTimer
	 */
	self._displayMessage = function(view, fadeTimer) {
		fadeTime = fadeTimer === undefined ? 500 : fadeTimer;
		self._showing = true;
		view.add(self);
		
		var fadeIn = Ti.UI.createAnimation({
			opacity : 0.85,
			duration : 100
		});
		
		self.animate(fadeIn);
		
		fadeIn.addEventListener('complete', function() {
			self.fireEvent('messageDisplayed', { messageText : messageText, fadeTime : fadeTime });
			setTimeout(self._clearMessage, fadeTime);
			fadeIn = null;
		});
	};
	return self;
}

module.exports = MessageView;