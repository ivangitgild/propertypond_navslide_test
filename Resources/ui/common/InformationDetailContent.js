var config       = require('lib/config');
// var uremoreinfo  = require('lib/uremoreinfo');

/**
 * InformationDetailContent Constructor
 * 
 * This generates the window to display specific information content
 * 
 */
function InformationDetailContent(params) {
    var self = Ti.UI.createView({layout: 'vertical'});

    var subtitle = Ti.UI.createLabel({
        color: '#000000',
        font: {fontSize: '17dp', fontWeight: 'bold'},
        text: params.title,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        top: 20,
        left: 20,
        width: '100%',
        height: 'auto',
        orientationModes: [Ti.UI.PORTRAIT]
    });
    
    var contentView = Ti.UI.createView({
        backgroundColor:'#FFFFFF',
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
        height: 'auto',
        width: 'auto',
        layout: 'vertical'
    });
    
    var contentparts = params.content;
    var count = contentparts.length;
    
    var charCount = 0;
    for (var index = 0; index < count; index++) {
    	var content = contentparts[index].content
        var label = Ti.UI.createLabel({
            text: content,
            font: {fontSize: '16dp', fontWeight: 'normal'},
            color: '#000000',
            width: '100%',
            height: 'auto',
            touchEnabled: true
        });
        charCount += content.length;
        switch (contentparts[index].type) {
            case "title":
                label.font = {fontSize: '16dp', fontWeight: 'bold'}
                break;
            case "phonenumber":
                if (config.getValue('osname') === 'android') {
                    label.autoLink = Ti.UI.AUTOLINK_PHONE_NUMBERS;
                } else {
                    label.color = '#4466FF';
                    label.addEventListener('touchend', function(e) {
                        var dial = require('ui/widgets/Dial');
                        dial(e.source.text);
                    });
                }
                break;
            case "email":
                if (config.getValue('osname') === 'android') {
                    label.autoLink = Ti.UI.AUTOLINK_EMAIL_ADDRESSES;
                } else {
                    label.color = '#4466FF';
                    label.addEventListener('touchend', function(e) {
//                        console.info(e.source.text);
                        var emailDialog = Ti.UI.createEmailDialog();
						emailDialog.subject = 'Utah Realestate Contracts';
						emailDialog.toRecipients = [e.source.text];
						emailDialog.messageBody = '';
						emailDialog.open();
                    });
                }
                break;
            case "url":
                if (config.getValue('osname') === 'android') {
                    label.autoLink = Ti.UI.AUTOLINK_URLS;
                } else {
                    label.color = '#4466FF';
                    label.addEventListener('touchend', function(e) {
//                        console.info(e.source.text);
                        Ti.Platform.openURL(e.source.text);
                    });
                }
                break;
        }
        contentView.add(label);
    }
    
    var scrollView = Ti.UI.createScrollView({
        contentWidth: 'auto',
        contentHeight: 'auto',
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: true,
        height: '95%',
        width: '100%'
    });
    scrollView.add(contentView);
    
    var containerView = Ti.UI.createView({
        backgroundColor:'#FFFFFF',
        borderRadius: 10,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        top: 10,
        height: charCount > 200 ? '85%' : '50%',
        width: '95%'
    });   
    containerView.add(scrollView);

    self.add(subtitle);
    self.add(containerView);
    
    return self;
}

module.exports = InformationDetailContent;