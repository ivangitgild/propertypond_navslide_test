var TableView    = require('ui/widgets/TableView');
var TableRow     = require('ui/widgets/TableRow');
var GlobalButton = require('ui/widgets/Button');
var config       = require('lib/config');
var usersModel   = require('models/Users');   
var _            = require('lib/underscore');
var Position     = require('lib/Position');

/**
 * Login Window Constructor
 * 
 * The gives the window for logins
 * 
 */
function LoginContent(options) { 
    var defaults = {
        onLoginSuccess   : function(){},
        onLoginFailure   : function(){}
    }
    options = _.extend({}, defaults, options);         
    
    /**
     * Callback event for keypressed events on both password and username fields.
     * Checks to make sure that the fields have been populated and enabled the login button if so.
     * 
     */
    var enableButton = function(){
        if (usernametf.getValue() != '' && passwordtf.getValue() != ''){
            loginButton._setEnabled(true);
        } else {
            loginButton._setEnabled(false);
            
        }
    }
    
    // Create component instance
    var osname = config.getValue('osname');

    var self = Ti.UI.createView({
        backgroundColor:'#f4f4f4',
        layout: "vertical"
    });
    
        var usernameImage = Ti.UI.createView({
            height: '25dp',
            width: '25dp',
            top: '10dp',
            left: '12dp',
            backgroundImage: "/images/icon-username.png",
            orientationModes: [Ti.UI.PORTRAIT]
        });

        // Row 1, Username label and TextField
        usernameConfig = {
            right: '10dp',
            height:'45dp',
            width: '250dp',
            hintText: 'Username',
            textAlign: 'right',
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
            backgroundColor: 'transparent', 
            borderWidth: 0, 
            borderColor: 'transparent'
        };
        if (osname === 'iphone' || osname === 'ipad' || osname === 'mobileweb') {
            usernameConfig.autocapitalization = false;
        }
        var usernametf = Ti.UI.createTextField(usernameConfig);
        usernametf.addEventListener('change', enableButton);
        
        var row1 = TableRow(usernameImage, usernametf, {
            top: '10dp'
        });
    
        // Row 2, password label and textfield
        var passwordImage = Ti.UI.createView({
            height: '25dp',
            width: '25dp',
            top: '10dp',
            left: '12dp',
            backgroundImage: "/images/icon-password.png"
        });
        
        var passwordtf = Ti.UI.createTextField({
            right: '10dp',
            hintText: 'Password',
            height:'45dp',
            width: '250dp',
            textAlign: 'right',
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
            passwordMask:true,
            backgroundColor: 'transparent', 
            borderWidth: 0, 
            borderColor: 'transparent'
        });
        passwordtf.addEventListener('change', enableButton);
        
        var row2 = TableRow(passwordImage, passwordtf, {});
    
    var data = [row1, row2];
    var table = TableView(data, {
        width: '250dp', 
        height: '120dp',
        scrollable: false
    });
    self.add(table);
    
    // Loader ICON
    var style = null;
    if (osname === 'iphone' || osname === 'ipad'){
        style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
    } else {
        //style = Ti.UI.ActivityIndicatorStyle.DARK; 
    }
    var activityIndicator = Ti.UI.createActivityIndicator({
      indicatorColor: 'black',
      top: '10dp',
      //style: style      
    });
    self.add(activityIndicator);
    
    // Initiate our error dialog here
    var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        // buttonNames: ['Forgot Password', 'Ok'],
        buttonNames: ['Ok'],
        message: 'The username and password combination given does not match any of our users',
        title: 'Unable To Login'
    });
    dialog.addEventListener('click', function(e){
        if (e.index === e.source.cancel){
            Ti.API.info('The ok button was clicked');
        }
        Ti.API.info('e.cancel: ' + e.cancel);
        Ti.API.info('e.source.cancel: ' + e.source.cancel);
        Ti.API.info('e.index: ' + e.index);
    });
    
    // Login Button
    var loginButton = GlobalButton('Login', {
        width: '200dp',
        theme: 'blue',
        enabled: false,
        centerView : true,
        onclick : function(){
            activityIndicator.show();
            
            Ti.App.Properties.setString('role', 'member');
            Ti.App.Properties.setString('username', usernametf.getValue());
            Ti.App.Properties.setString('password', passwordtf.getValue());
            ///Ti.App.Properties.setString('user_id', data[0].userid);
           	//Ti.App.Properties.setObject('user', data[0]);
           	
            // Send event to reload the home view (will change after being logged in)
            Ti.App.fireEvent('reloadHomeView'); 
            
            // Close this login window
            options.onLoginSuccess();  
        }
    });
    Position.centerViewHorizontal(loginButton);
    self.add(loginButton);
    
    
    var forgotLabel = Ti.UI.createLabel({
        text: 'Forgot Password?',
        top: '10dp',
        font: { fontSize: '17dp' }
    });  
    forgotLabel.addEventListener('click', function(){
        alert('This feature is not yet implemented');
    });
    self.add(forgotLabel);
    
    
    self.add(Ti.UI.createView({
        height:'2dp',
        top: '28dp',
        backgroundColor: '#cfd1d2',
        width: '260dp'
    }))
    
   var signUpLabel = Ti.UI.createLabel({
        text: 'Visit http://www.propertypond.com to create a free account.',
        top: '10dp',
        color: '#929394',
        font: { fontSize: '17dp' }
    });
    //self.add(signUpLabel);
    
    var noAccountLabel = Ti.UI.createLabel({
        text: 'Don\'t have an account?',
        top: '38dp',
        font: { fontSize: '14dp' }
    }); 
    // TODO : Add back when functionality exists 
    self.add(noAccountLabel);
    
    // Create Account Button
    var registerButton = GlobalButton('Create Account', {
        top: '20dp',
        width: '200dp',
        left: null,
       
        onclick : function(){
        	var SignupWindow 	= require('ui/handheld/SignupWindow');
        	signupWindow = SignupWindow();
            signupWindow.open({modal : true});
        }
    });
    // TODO : Add back when functionality exists
    self.add(registerButton);    
    
    // Return Window
    return self;
}

// Export the constructor LoginWindow
module.exports = LoginContent;
