// import  
var util 			= require('lib/utilities');
var _				= util._;
var ToolbarButton 	= require('ui/widgets/ToolbarButton');
var IconButton = require('ui/widgets/IconButton');

// construct
/***********************************************************************************
 ***********************************************************************************
 * @name {ClassName}								
 * @description {Description}						
 * @return {TiUIView}	
------------------------------------------------------------------------------------
 * @param {Object} options
    ↳ {String} value, color, top, value		
    ↳ {Integer} width, height								
------------------------------------------------------------------------------------
 * @event barButtonClick({Sender})									
------------------------------------------------------------------------------------
 * @method _addButton({Object})					
------------------------------------------------------------------------------------
 * @property _myProperty							
 ***********************************************************************************
 ***********************************************************************************/



function BottomBar(options) {
	// default options
	var isAndroid = util.Android;
	var role = Ti.App.Properties.getString('role');
	var defaults = {
		width : '100%',
		height : '100%',
		layout : 'horizontal',
		currentResultsView : 'list',
		hideSaveButton : false,
		buttons : [
			{ 
				icon : '/images/icons/icon-map.png', 
				visible : true, 
				width : '67dp', 
				left : '5dp',
				right: undefined,
				name : 'map',
			},
			{ 
				icon : '/images/icons/icon-list-view.png', 
				visible : true, 
				width : '67dp', 
				left : '5dp',
				right: undefined,
				name : 'list', 
				zIndex : 5,
			},
			{ 
				icon : '/images/icons/icon-sort.png', 
				visible : true, 
				width : '67dp', 
				left: undefined,
				right : '5dp', 
				name : 'sort', 
				zIndex : 6,
			},
			{ 
				icon : '/images/icons/icon-save.png', 
				visible : role == 'member' ? true : false, 
				width : '67dp', 
				left : '75dp', 
				right: undefined,
				name : 'save',
			}
			]
	};
	
	
	// set defaults
	options = _.extend({}, defaults, options);
	var currentResultsView = options.currentResultsView;
	var buttons = options.buttons;
	util.deleteProperties(options,['currentResultsView','buttons']); 
	
	// create self
	var self = Titanium.UI.createView({
                bottom:0,
                height:'40dp',
                backgroundColor:'#599EEB', // #777
                backgroundImage: '/images/navBar@2x.png',
                zIndex: 999
    });
	// load self
	/*
	if (util.iOS) {
		self = Ti.UI.iOS.createToolbar({
			bottom : 0,
			borderTop : true,
			borderBottom : false,
			zIndex : 3
		});
	} else { // android
		self = Titanium.UI.createView({
                bottom:0,
                height:'40dp',
                backgroundColor:'#599EEB', // #777
                backgroundImage: '/images/navBar@2x.png',
                zIndex: 999
        });
	}
	*/
	var _buttons = [];
	for (var i=0;i<buttons.length;i++) {
		var buttonOption = buttons[i];
		
		if (util.iOS) {
		    var button = new ToolbarButton(buttonOption);
		} else {
		    var button = new IconButton({name: buttonOption.name, left: buttonOption.left, right: buttonOption.right}, {image: buttonOption.icon});
		}
		
		button.addEventListener('buttonClick', function(e) {
			if (e.name === 'map') {
				self._setCurrentResultsView('map');	
			} else if (e.name === 'list') {
				self._setCurrentResultsView('list');	
			} self.fireEvent('barButtonClick', { name : e.name });
		});
		_buttons.push(button);
	}
	self._buttons = _buttons;
	
	
	/**************
	 * PROPERTIES *
	 **************/
	for (var i=0;i<self._buttons.length;i++) {
		self.add(self._buttons[i]);
	}
	
	/***********
	 * METHODS *
	 ***********/
	var findButton = function(buttonName) {
		for (var i=0;i<self._buttons.length;i++) {
			if (self._buttons[i]._name.toLowerCase() === buttonName.toLowerCase()) {
				return self._buttons[i];
			}	
		} return null;
	}
		
	self._setCurrentResultsView = function(resultsView) {
		var showMap = resultsView === 'list' ? true : false;
		if (findButton('map')) { findButton('map').setVisible(showMap); }
		if (findButton('list')) { findButton('list').setVisible(showMap === true ? false : true); } 
	};
	
	self._setCurrentResultsView(currentResultsView);
	return self;
}

module.exports = BottomBar;