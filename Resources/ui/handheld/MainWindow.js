function MainWindow() {
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'white',
		title : 'Propertypond',
		left : 0,
		zIndex : 10
	});
	// var HomeView = require('ui/handheld/HomeView')
	// var hView = new HomeView();
	// var firstContainerWindow = Ti.UI.createWindow({
        // title:'Home',
        // navBarHidden: true,
        // orientationModes: [Ti.UI.PORTRAIT]
    // });
    // firstContainerWindow.add(hView);
    
	var nav = Titanium.UI.iPhone.createNavigationGroup({
	   window: self,
	   left: 0,
	   width: Ti.Platform.displayCaps.platformWidth
	});
	
	var animateLeft	= Ti.UI.createAnimation({
		left: 150,
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
		width: 50,
		height: 30,
		top: 10
	});
	
	var isToggled = false;
	slideButton.addEventListener('click', function(e){
		if( !isToggled ){
			navWin.animate(animateLeft);
			isToggled = true;
		} else {
			navWin.animate(animateRight);
			isToggled = false;
		}
	});
	
	
	nav.add(slideButton);
	//nav.add(firstContainerWindow);
	
	
	navWin.add(nav);
	navWin.open();
	
	
	
    
	return self;
};

module.exports = MainWindow;
