var TableView    = require('ui/widgets/TableView');
var TableRow     = require('ui/widgets/TableRow');
var GlobalButton = require('ui/widgets/Button');
var config       = require('lib/config');
var users   = require('models/Users');   
var _            = require('lib/underscore');
var Position     = require('lib/Position');

/**
 * Signup Window Constructor
 * 
 * The gives the window for signup
 * 
 */
function SignupContent(options) { 
    var defaults = {
        onSignupSuccess   : function(){},
        onSignupFailure   : function(){}
    }
    options = _.extend({}, defaults, options);         
       
    /**
     * Callback event for keypressed events on both password and username fields.
     * Checks to make sure that the fields have been populated and enabled the signup button if so.
     * 
     */
    var enableButton = function(){
        if (emailtf.getValue() != '' && passwordtf.getValue() !='' && cpasswordtf.getValue() != '' && (passwordtf.getValue() == cpasswordtf.getValue())) {
        	signupButton._setEnabled(true);
        } else {
        	signupButton._setEnabled(false);
        }
    }
    
    // Create component instance
    var osname = config.getValue('osname');

    var self = Ti.UI.createView({
        backgroundColor:'#f4f4f4',
        layout: "vertical"
    });
    

        // Row 1, Username label and TextField
        emailConfig = {
            right: '10dp',
            height:'45dp',
            width: '250dp',
            hintText: 'Email',
            textAlign: 'left',
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
            backgroundColor: 'transparent', 
            borderWidth: 0, 
            borderColor: 'transparent'
        };
        if (osname === 'iphone' || osname === 'ipad' || osname === 'mobileweb') {
            emailConfig.autocapitalization = false;
        }
        var emailtf = Ti.UI.createTextField(emailConfig);
        emailtf.addEventListener('change', enableButton);
        
        var row1 = TableRow(null, emailtf, {
            top: '10dp'
        });
        
        var passwordtf = Ti.UI.createTextField({
            right: '10dp',
            hintText: 'Password',
            height:'45dp',
            width: '250dp',
            textAlign: 'left',
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
            passwordMask:true,
            backgroundColor: 'transparent', 
            borderWidth: 0, 
            borderColor: 'transparent'
        });
        passwordtf.addEventListener('change', enableButton);
        
        var row2 = TableRow(null, passwordtf, {});
        
        var cpasswordtf = Ti.UI.createTextField({
            right: '10dp',
            hintText: 'Confirm Password',
            height:'45dp',
            width: '250dp',
            textAlign: 'left',
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
            passwordMask:true,
            backgroundColor: 'transparent', 
            borderWidth: 0, 
            borderColor: 'transparent'
        });
        cpasswordtf.addEventListener('change', enableButton);
        
        var row3 = TableRow(null, cpasswordtf, {});
    
    var data = [row1, row2, row3];
    var table = TableView(data, {
        width: '250dp', 
        height: '180dp',
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
    
    // SignUp Button
    var signupButton = GlobalButton('Create Account', {
        width: '200dp',
        theme: 'blue',
        enabled: false,
        centerView : true,
        onclick : function(){
            activityIndicator.show();
            users.register(emailtf.getValue(), passwordtf.getValue(), function(data){
            	activityIndicator.hide();
            	if (data.success) {
            		Ti.App.fireEvent('reloadHomeView'); 
            		options.onSignupSuccess();
            	} else {
            		alert('Error registering');
            	}
            });
            
        }
    });
    Position.centerViewHorizontal(signupButton);
    self.add(signupButton);
    
    self.add(Ti.UI.createView({
        height:'2dp',
        top: '28dp',
        backgroundColor: '#cfd1d2',
        width: '260dp'
    }))
    
    
    var haveAccountLabel = Ti.UI.createLabel({
        text: 'Already have an account?',
        top: '38dp',
        font: { fontSize: '14dp' }
    }); 
    // TODO : Add back when functionality exists 
    self.add(haveAccountLabel);
    
    var loginButton = GlobalButton('Login', {
    	width: '140dp',
    	left: null,
   		onclick : function(){ 
            var LoginWindow 	= require('ui/handheld/LoginWindow');
        	loginWindow = LoginWindow();
            loginWindow.open({modal : true});
        }
        
    }, function(){ SignupWindow.close(); });
    self.add(loginButton);
    
    // Return Window
    return self;
}

// Export the constructor LoginWindow
module.exports = SignupContent;
