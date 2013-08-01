function InformationWindow(winInfo) {
	
	var self = Ti.UI.createWindow({
		backgroundColor : '#ffffff',
		title : winInfo.title
	});
	
	var scrollView = Ti.UI.createScrollView({
	  contentWidth: 'auto',
	  contentHeight: 'auto',
	  showVerticalScrollIndicator: true,
	  showHorizontalScrollIndicator: true,
	  height: '80%',
	  width: '80%'
	});
	
	var InformationContent = require('ui/common/InformationContent');
	var infoContent = new InformationContent(winInfo);
	
	scrollView.add(infoContent);
	self.add(scrollView);
	
	return self;
}


module.exports = InformationWindow;