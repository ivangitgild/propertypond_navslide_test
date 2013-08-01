// var utilities 	 = require('lib/utilities');
// 
// var DialPhone = function(number) {
    // var callCheck = Ti.UI.createAlertDialog({
        // title: 'Dial Phone',
        // message: 'Call ' + number +' ?',
        // buttonNames: ['Yes', 'No'],
        // cancel: 1
    // });
    // callCheck.addEventListener('click', function(e) {
        // //Clicked cancel, first check is for iphone, second for android
        // if (e.cancel === e.index || e.cancel === true) {
            // return;
        // }
        // var phoneNumber = utilities.validateAndFormatPhoneNumber(number);
        // if (phoneNumber != false) {
        	// Ti.Platform.openURL(phoneNumber);	
        // } 
//         
    // });
    // callCheck.show();
// };
// 
// module.exports = DialPhone;


var PhoneModal = function(number, type) {
    if (type == 'mobile') {
        var opts = {
            options: ['Call', 'Text Message', 'Cancel'],
            cancel: 2,
            selectedIndex: 2
        };
    }
    else {
        var opts = {
            options: ['Call', 'Cancel'],
            cancel: 1,
            selectedIndex: 1
        };
    }
    opts.title = 'Contact agent at '+number+'?';
    
    var dialog = Ti.UI.createOptionDialog(opts);
    
    dialog.addEventListener('click', function(e) {
        var clean_number = '1'+number.replace(/\D/g, '');
        switch (e.index) {
            case 0:
                console.log('tel:'+clean_number);
                Ti.Platform.openURL('tel:'+clean_number);
                break;
            case 1:
                if (e.index !== e.cancel) {
                    console.log('sms:'+clean_number);
                    Ti.Platform.openURL('sms:'+clean_number);
                }
                break;
        }
    });
    dialog.show();
}

module.exports = PhoneModal;
