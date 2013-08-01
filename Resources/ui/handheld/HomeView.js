function HomeView(){
	
	var self = Ti.UI.createView({
		backgroundColor : 'blue'
	});
	var content = Ti.UI.createLabel({
		text : 'Test'
	});
	
	self.add(content);
	return self;
}

module.exports = HomeView;
