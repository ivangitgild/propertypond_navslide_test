var _ = require('lib/underscore');
var slider = require('lib/slider');

function MasterWindow(){
	
	var self = Ti.UI.createWindow({
		backgroundColor : '#ffffff',
		title : 'Propertypond'
	});
	
	self.add(slider.createSlider());
	
	return self;
}

module.exports = MasterWindow;
