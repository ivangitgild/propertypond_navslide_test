var _           = require('lib/underscore');

var c = {
    // The Default Font Size - based upon the platform
    defaultFontSize: (Ti.Platform.name === 'android') ? 16 : 14,
    privacyLookup: [
        'Clients & Connections',
        'Select Clients',
        'REALTOR® Branded Site'
    ],
    typeLookup: [
        '',
        'Residential',
        'Multi-Unit',
        'Land',
        '',
        'Commercial',
        'Farm'
    ],
}

/**
 * This produces all the common stuff between the different property types for the list
 * 
 * @param {Object} data
 * @param {Object} options
 */
var PlistSubrowContent = function(resultSet, PlistData, options){
    var defaults = {
        top: '60dp'
    };
 
    options = _.extend({}, defaults, options);

    var self = Ti.UI.createView(options);
    var data = resultSet.length > 0 ? resultSet[0] : {recipient: 'No one', viewed: -1};
    // First, the pretty shadow bar thing from Scott
    var coolBar = Ti.UI.createImageView({
        image: '/images/silver-shadow.png',
        top: 0,
        width: '320dp',
    });
    self.add(coolBar);

    // We'll do the BOLD label first, followed by the dynamic field
    
    // To
    var labelTo = Ti.UI.createLabel({
        color: '#000',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize, fontWeight:'bold'},
        text: 'To:',
        left: '10dp',
        top:'12dp',
        horizontalWrap: false
    });
    self.add(labelTo);

    var contentTo = Ti.UI.createLabel({
        color: '#000',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize},
        text: data.recipient,
        left: '70dp',
        top:'12dp',
        horizontalWrap: false
    });
    self.add(contentTo);

    // Type
    var labelType = Ti.UI.createLabel({
        color: '#000',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize, fontWeight:'bold'},
        text: 'Type:',
        left: '10dp',
        top:'30dp',
        horizontalWrap: false
    });
    self.add(labelType);

    var contentType = Ti.UI.createLabel({
        color: '#000',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize},
        text: c.typeLookup[PlistData.st_ptype],
        left: '70dp',
        top:'30dp',
        horizontalWrap: false
    });
    self.add(contentType);

    // Count
    var labelCount = Ti.UI.createLabel({
        color: '#000',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize, fontWeight:'bold'},
        text: 'Count:',
        left: '10dp',
        top:'48dp',
        horizontalWrap: false
    });
    self.add(labelCount);

    var contentCount = Ti.UI.createLabel({
        color: '#000',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize},
        text: PlistData.st_listnum.split(',').length,
        left: '70dp',
        top:'48dp',
        horizontalWrap: false
    });
    self.add(contentCount);

    // Privacy
    var labelPrivacy = Ti.UI.createLabel({
        color: '#000',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize, fontWeight:'bold'},
        text: 'Privacy:',
        left: '10dp',
        top:'66dp',
        horizontalWrap: false
    });
    self.add(labelPrivacy);

    var contentPrivacy = Ti.UI.createLabel({
        color: '#000',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize},
        text: c.privacyLookup[PlistData.visibility],
        left: '70dp',
        top:'66dp',
        horizontalWrap: false
    });
    self.add(contentPrivacy);

    // The arrow icon on the right side
    var icon = Ti.UI.createImageView({
        image: '/images/icons/grey-arrow.png',
        top: '36dp',
        right: '12dp',
        width: '15dp',
        height: '22dp',
    });
    self.add(icon);

    return self;
}

module.exports = PlistSubrowContent;
