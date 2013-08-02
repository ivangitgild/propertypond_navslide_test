var GlobalButton = require('ui/widgets/Button')
function AccountWindow(){
	var windowOptions = {
        barImage: '/images/navBar.png',
        barColor: '#4f90d9',
        backgroundColor:'#e6e7e8',
        layout: "vertical",
        title : 'My Account',
        navBarHidden: false
    };
    
    var self = Ti.UI.createWindow(windowOptions);
    
    var logout = GlobalButton('Logout', {
    	centerView : true,
    	onclick : function () {
		  	Ti.App.Properties.setString('role', 'guest');
	        Ti.App.Properties.setString('username', null);
	        Ti.App.Properties.setString('password', null);
	        
	        Ti.App.fireEvent('reloadHomeView');
	        self.close();
		}
    });
    
    var containerView = Ti.UI.createView();
    containerView.add(logout);
    
    self.add(containerView);
    
    return self;
}

module.exports = AccountWindow;
