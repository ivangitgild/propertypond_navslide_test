var _ 					= require('lib/underscore');
var LocalSearch 		= require('local_db/models/LocalSearch');
var utilities           = require('lib/utilities');
var _					= require('lib/underscore');
var ss_backgroundColor  = '#19263e';
var	ss_gradientColor    = '#4c5565';
/***********************************************************************************
 ***********************************************************************************
 * @name {ClassName}								
 * @description {Description}						
 * @return {TiUIView}								
------------------------------------------------------------------------------------
 * @event cancelButtonClicked({Sender})					
 * @event saveButtonClicked({Sender})												
 ***********************************************************************************
 ***********************************************************************************/
/***********
 * Example *
 ***********/
/*
var lbl= Ti.UI.createLabel({ backgroundColor : '#2c3648', text : 'open', textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER, color : 'white', borderRadius : '8dp', borderColor : 'white', height : '25dp', width : '75dp' });
view.add(lbl);
******** EXAMPLE 1 : Saves data Locally to SQLITE DB ******
lbl.addEventListener('click', function(){
    var ss = new SaveSearchAlertView(self);
    ss.show();
});
******** EXAMPLE 2 : Custom Callback returning name ******
lbl.addEventListener('click', function(){
    var ss = new SaveSearchAlertView(self, function(name) {
    	console.log(name);
    });
    ss.show();
});
*/

/**
 * Contructor
 */
SaveSearchAlertView = function(options) {
	var self = Ti.UI.createView({
		width : '100%',
		height : '100%',
		backgroundColor : 'transparent',
		zIndex : 5
	});
	
	var titleLabel = Ti.UI.createLabel({
		text : 'Save Search',
		color : 'White',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : { fontSize : 20, fontWeight:'bold' },
		top : '6dp'
	});
	
	var textArea = Ti.UI.createTextArea({
		value : 'Optional - change the default name to something unique like "Homes near work"',
		color :'white',
		editable : false,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : '275dp',
		height : '75dp',
		top : '25dp',
		backgroundColor : 'transparent',
		font : { fontSize : 18, fontWeight:'normal' }
	});
	
	// fade or background with opacity
	var fade = Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.5
	});
	
	
	
	var boxtop = (utilities.Android) ? '50dp' : '20dp'; 
	if (utilities.isTablet) {
		boxtop = '25%';
	}
	
	var defaults = {
		top : boxtop,
		width : '315dp',
		height : '215dp',
		backgroundColor : 'transparent'
	};
	var options = _.extend({},defaults,options);
	
	var shadowContainer = Ti.UI.createView(options);
	
	var box = Ti.UI.createView({
		width : '300dp',
		height : '200dp',
		top : 0,
		left : 0, 
		backgroundColor : ss_backgroundColor,
		backgroundGradient : {
    		type : "linear", // radial
    		startPoint : { x : 0, y : 0 },
    		endPoint : { x : 0, y : "25dp" },
    		colors : [ss_gradientColor, ss_backgroundColor]
    	},
    	borderColor : 'white',
    	borderWidth : '3dp',
    	borderRadius : '10dp'
	});
	
	shadowContainer.add(createShadow(5,0.05));
	shadowContainer.add(createShadow(4,0.10));
	shadowContainer.add(createShadow(3,0.15));
	shadowContainer.add(createShadow(2,0.20));
	shadowContainer.add(createShadow(1,0.25));
	
	var textFieldBG = Ti.UI.createView({
		backgroundColor : 'white',
		width : '285dp',
		height : '30dp',
		top : '105dp',
		borderRadius : '5dp',
		borderWidth :0,
		backgroundGradient : {
    		type : "linear", // radial
    		startPoint : { x : 0, y : 0 },
    		endPoint : { x : 0, y : '5%' },
    		colors : ['#999999', 'White']
    	},
	});
		
	var textField = Ti.UI.createTextField({
		top : '1dp',
		width : '275dp',
		height : '28dp',
		left : '10dp'
	});
	textFieldBG.add(textField);

	var saveBtn = ssBtn('Save', '151dp');
	var closeBtn = ssBtn('Cancel', '6dp');
	
	saveBtn.addEventListener('click', function(e) {
		Search = require('lib/PropertySearch');

		// Save locally
		LocalSearch.ss_id = null;
		LocalSearch.ss_name = escape(textField.value);
		LocalSearch.ss_desc = Search.toDescription();
		LocalSearch.ss_search = Search.getPropertySearch();
		LocalSearch.ss_listing_search = Search.getCurrentNamespace();
		LocalSearch.ss_is_recent = false;  
		LocalSearch.ss_username = Ti.App.Properties.getString('username');
		LocalSearch.ss_id = LocalSearch.insert();
		
		self.fireEvent('saveButtonClicked', { data : LocalSearch });
		var parent = self.getParent();
		parent.remove(self);
		self = null;
	});
	
	closeBtn.addEventListener('click', function(e) {
		self.fireEvent('cancelButtonClicked');
		var parent = self.getParent();
		parent.remove(self);
		self = null;
	});
	
	box.add(saveBtn);
	box.add(closeBtn);
	box.add(titleLabel);
	box.add(textArea);
	box.add(textFieldBG);
	shadowContainer.add(box);

	self.add(fade);
	self.add(shadowContainer);
	
	return self;
}

function createShadow(offset, opacity) {
	return Ti.UI.createView({
		width : '300dp',
		height : '200dp',
		left : offset,
		top : offset,
		opacity : opacity,
		backgroundColor : 'Black',
		borderColor : 'transparent',
    	borderWidth : '3dp',
    	borderRadius : '10dp',
	});
}

function ssBtn(text, left) {	
	var gradient = {
    		type : "linear", // radial
    		startPoint : { x : 0, y : 0 },
    		endPoint : { x : 0, y : "25dp" },
    		colors : [ss_gradientColor, ss_backgroundColor]
    };
    var selectedGradient = {
    		type : "linear", // radial
    		startPoint : { x : 0, y : 0 },
    		endPoint : { x : 0, y : "25dp" },
    		colors : [ss_backgroundColor, ss_gradientColor]
    };
	
	var btn = Ti.UI.createButton({
		title : text,
		color : 'white',
		font : { fontSize : 18, fontWeight:'bold' },
		top : '140dp',
		left : left,
		width : '140dp',
		height : '50dp',
        borderColor : '#4d5c78',
    	borderWidth : '2dp',
    	borderRadius : '10dp', 
    	backgroundGradient : gradient,
    	backgroundImage:'None'
	});

	return btn;
}

module.exports = SaveSearchAlertView;
