var _ = require('lib/underscore');

var IconButton = function(options, imageoptions) {

    var defaultoptions = {
        width : '55dp',
        height : '30dp',
        backgroundImage : '/images/body/fade_white.png',
        backgroundColor : '#377cc9',
        borderColor : '#000000',
        borderWidth : 1.5,
        borderRadius : 10,
        layout: 'vertical'
    };
    
    options = _.extend({}, defaultoptions, options);
    
    var defaultimageoptions = {
        image : '',
        left: '5dp',
        top: '7dp',
        width: '43dp',
        height: '16dp'
    };
    
    imageoptions = _.extend({}, defaultimageoptions, imageoptions);
    
    var buttonview = Ti.UI.createView(options);
    var imageview;
    
    if (imageoptions.image != '') {
        imageview = Ti.UI.createImageView(imageoptions);
        buttonview.add(imageview);
    }
    
    buttonview._setImage = function(image) {
        buttonview.remove(imageview);
        imageview.image = image;
        buttonview.add(imageview);
    };

    return buttonview;
}

module.exports = IconButton