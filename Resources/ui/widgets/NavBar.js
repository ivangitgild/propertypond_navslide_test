// import  
var util 			= require('lib/utilities');
var ToolbarButton = require('ui/widgets/ToolbarButton');
// construct
/***********************************************************************************
 ***********************************************************************************
 * @name {ClassName}								
 * @description {Description}						
 * @return {TiUIView}	
------------------------------------------------------------------------------------
 * @param {Object} options
    ↳ {Array<URE.ToolbarButton>} buttons 	
    ↳ {Integer} width, height								
------------------------------------------------------------------------------------
 * @event barButtonClick({Sender})									
------------------------------------------------------------------------------------
 * @method _addButton({Object})					
------------------------------------------------------------------------------------
 * @property _myProperty							
 ***********************************************************************************
 ***********************************************************************************/


function NavBar(options) {
	// default options
	var defaults = {
		buttons : [
			{ name : 'cancel', title : 'Cancel', left : '5dp' },
			{ name : 'type', title : 'Type', right  : '5dp' }
		],
		width : '100%',
		height : '50dp',
		theme: 'gray',
		top : 0,
		title : '',
		zIndex : 50,
		backgroundImage : '/images/body/toolbar/gray_nav-bar.png'
	};
	// set defaults
	options = util._.extend({}, defaults, options);
	// get custom properties
	var buttons = options.buttons;
	var title = options.title;
	var theme = options.theme;
	// delete custom properties
	util.deleteProperties(options, ['buttons','theme','title']);
	// update images by theme
	switch (theme) {
		case 'blue' : options.backgroundImage = '/images/navBar.png'; break; 
		default : break;
	} 
	// create self
	var self = Ti.UI.createView(options);
	// add buttons
	for (var i=0;i<buttons.length;i++) {
		var button = null;
		var buttonOption = buttons[i];
		if (buttonOption._type && buttonOption._type === 'ToolbarButton') {
			button = buttonOptions;
		} else {
			buttonOptions = util._.extend({},buttonOption,{theme : theme, top : '8dp' });
			button = new ToolbarButton(buttonOptions);	
		}
		button.addEventListener('buttonClick', function(e) {
			self.fireEvent('barButtonClick', e);
		});
		
		self.add(button);
	}
	// title label
	var titleLabel = Ti.UI.createLabel({
	    color: '505050',
	    font: { fontSize:'14dp', fontWeight:'Bold' },
	    text: title,
	    top : '13dp',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	    width: Ti.UI.SIZE, height: Ti.UI.SIZE,
	    shadowColor : '#d6d6d6',
	    shadowOffset : {x:-0.5,y:-0.5}
	}); 
	self.add(titleLabel);
	
	/**************
	 * PROPERTIES *
	 **************/
	self._type = 'NavBar';
	
	/***********
	 * METHODS *
	 ***********/	
	self._setTitle = function(title) {
		titleLabel.setText(title);
	};
	
	
	return self;
}

module.exports = NavBar;