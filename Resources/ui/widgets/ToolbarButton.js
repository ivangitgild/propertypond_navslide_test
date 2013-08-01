// import  
var _				= require('lib/underscore');
var util 			= require('lib/utilities');

// construct
/***********************************************************************************
 ***********************************************************************************
 * @name {ToolbarButton}								
 * @description {Description}						
 * @return {TiUIView}								
------------------------------------------------------------------------------------
 * @event buttonClick({Sender})								
------------------------------------------------------------------------------------
 * @method _setSelected({Boolean})					
------------------------------------------------------------------------------------
 * @property {Boolean} _selected
 * @property {String}  _name	
 * @property {Integer} _buttonWidth 						
 ***********************************************************************************
 ***********************************************************************************/
var HEIGHT = '30dp';
function ToolbarButton(options) {
	var defaults = {
		width : '65dp',
		height : HEIGHT,
		font : { fontSize : '13dp', fontWeight : 'bold' },
		theme : 'blue'
	};
	
	// setup options
	options = _.extend({}, defaults, options);
	
	var title = options.title ? options.title : null;
	var name = options.name ? options.name : null;
	var icon = options.icon ? options.icon : null;
	var colorScheme = options.theme ? options.theme.toLowerCase() : 'blue';
	
	util.deleteProperties(options, ['title','name','icon','theme']);
	
	delete options.style;
	
	var centerWidth = parseInt(options.width) - 10;
	if (title && title.length > 8) {
		centerWidth += 45;
		if (title.length > 16) {
			centerWidth+= 30;
		}
	}
	
	var viewWidth = centerWidth + 10;
	options.width = viewWidth.toString()+'dp';
	
	
	// create view
	var self = Ti.UI.createView(options);
	self._buttonWidth = viewWidth;
	var titleLabel = false;
	
	// left side of the button
	var leftSide = Ti.UI.createImageView({
		width : '5dp',
		height : HEIGHT,
		left : 0,
		image : '/images/buttons/toolbar/'+colorScheme+'_left.png'
	});
	self.add(leftSide);
	
	// center of the button
	var center = Ti.UI.createImageView({
		backgroundImage : '/images/buttons/toolbar/'+colorScheme+'_center.png',
		left : '5dp',
		// width : centerWidth.toString()+'dp',
		right : '5dp',
		height : HEIGHT
	});
	if (title) {
		// drop shadow label
		var titleLabel = Ti.UI.createLabel({
		    color: 'White',
		    font: { fontSize:'15dp', fontWeight:'Bold' },
		    text: title,
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    width: Ti.UI.SIZE, height: Ti.UI.SIZE,
		    shadowColor : '#2a2a2a',
		    shadowOffset : {x:-0.5,y:-1 },
		    zIndex : 5
		}); 
		
		if  (!name) {
			name = title.toString().toLowerCase();
		}
	}
	
	if (icon) {
		var iconView = Ti.UI.createImageView({
			image : icon
		});
		center.add(iconView);
	}
	self.add(center);
	
	// right side of the button
	var rightSide = Ti.UI.createView({
		width : '5dp',
		height : HEIGHT,
		right : 0,
		backgroundImage : '/images/buttons/toolbar/'+colorScheme+'_right.png'
	});
	self.add(rightSide);
	
	var selection = Ti.UI.createView({
		height : HEIGHT,
		top : 0,
		left : 0,
		bottom : 0,
		right : 0,
		backgroundColor : 'Black',
		opacity : 0.0,
		borderRadius : '5dp'
	});
	self.add(selection);
	
	/**************
	 * PROPERTIES *
	 **************/
	self._selected = false;
	
	/**********
	 * EVENTS *
	 **********/
	var buttonClick= function(e) {
		self._setSelected(true);
		self.fireEvent('buttonClick', { name : name });
	};
	
	
	// Loads when the view opens or appears
	self.addEventListener('click', buttonClick);
	
	self.addEventListener('touchstart', function(e) {
		selection.setOpacity(0.5);
	});
	self.addEventListener('touchend', function(e) {
		selection.setOpacity(0.0);
	});
	
	
	
	/***********
	 * METHODS *
	 ***********/
	/**
	 * _setSelected
	 * @param {Boolean} selected 
	 */
	self._setSelected = function(selected) {
		self._selected = selected;
	}
	
	
	if (titleLabel) {
		self.add(titleLabel);
	}
	
	
	// declare type
	self._type = 'ToolbarButton';
	self._name = name;
	return self;
}

module.exports = ToolbarButton;