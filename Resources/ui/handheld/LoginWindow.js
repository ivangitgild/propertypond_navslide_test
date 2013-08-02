var config       = require('lib/config');
var LoginContent = require('ui/common/LoginContent');

/**
 * Login Window Constructor
 * 
 * The gives the window for logins
 * 
 */
function LoginWindow() {    
    /**
     * Callback event for keypressed events on both password and username fields.
     * Checks to make sure that the fields have been populated and enabled the login button if so.
     * 
     */
    var enableButton = function(){
        if (usernametf.getValue() != '' && passwordtf.getValue() != ''){
            // console.log('setEnabled TRUE');
            loginButton._setEnabled(true);
        } else {
            loginButton._setEnabled(false);
            
        }
    }
    
    // Create component instance
    var windowOptions = {
        barImage: '/images/navBar.png',
        barColor: '#4f90d9',
        backgroundColor:'#e6e7e8',
        layout: "vertical",
        title : 'Login',
        navBarHidden: false
    };
    
    var osname = config.getValue('osname');
    if (osname === 'iphone' || osname === 'mobileweb') {
        // Cancel button (top left IOS )
        var cancelButton = Titanium.UI.createButton({
            title:'Cancel',
            width:'50dp',
            height:'40dp'    
        });
        cancelButton.addEventListener('click', function(){
            self.close();
        });
        windowOptions.leftNavButton = cancelButton;
    }
    var self = Ti.UI.createWindow(windowOptions);
    
        var loginContent = LoginContent({
            onLoginSuccess : function(){
                self.close();
            }
        });
        self.add(loginContent);
    

    // Return Window
    return self;
}

// Export the constructor LoginWindow
module.exports = LoginWindow;
