function MainWindow() {
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'white',
		title : 'Propertypond',
		left : 0,
		zIndex : 10
	});
	
	var menuBar = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth,
		height: 60,
		top: 0,
		backgroundColor : '#4bb5ea'
	});
	//Ti.UI.MobileWeb.createNavigationGroup;
	var nav = Ti.UI.MobileWeb.createNavigationGroup({
	   window: self,
	   left: 0,
	   width: Ti.Platform.displayCaps.platformWidth
	});
	
	var animateLeft	= Ti.UI.createAnimation({
		left: 150,
		//curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
		duration: 500,
		zIndex: 0
	});
	var animateLeft2	= Ti.UI.createAnimation({
		left: 0,
		//curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
		duration: 500
	});
	var animateRight	= Ti.UI.createAnimation({
		left: 0,
		//curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
		duration: 500
	});
	
	var NavWindow = require('ui/common/NavWindow');
	var navWin = new NavWindow();
	navWin.open();
		
	var slideButton = Ti.UI.createButton({
		title: 'Menu',
		left: 10,
		width: 60,
		height: 50
	});
	
	var isToggled = false;
	slideButton.addEventListener('click', function(e){
		if( !isToggled ){
			//self.animate(animateLeft);
			navWin.animate(animateLeft2);
			
			isToggled = true;
		} else {
			navWin.animate(animateRight);
			isToggled = false;
		}
	});
	
	//menuBar.add(slideButton);
	//self.add(menuBar);
	// var tabGroup = Ti.UI.createTabGroup();
// 	
	// var tab = Ti.UI.createTab({
		// window : self,
		// title : 'Propertypond'
	// });
// 	
	// tabGroup.add(tab);
	// var tab2 = Ti.UI.createTab({
		// window : navWin
	// });
	// tabGroup.add(tab);
	nav.add(slideButton);
	navWin.add(nav);
	navWin.open();
	
	//tabGroup.open();
	return self;
};

module.exports = MainWindow;