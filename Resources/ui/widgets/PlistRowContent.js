var _            = require('lib/underscore');
var plistdetails = require('models/PlistDetails');
var SubContent   = require('ui/widgets/PlistSubrowContent');
var Criteria     = require('lib/Criteria');
var Search       = require('lib/PropertySearch');

var c = {
    // The Default Font Size - based upon the platform
    defaultFontSize: (Ti.Platform.name === 'android') ? 16 : 14,

    // Some gradients to use for the backgrounds
    BG_GRADIENT: {
        type:'linear',
        startPoint:{x:'0%',y:'0%'},
        endPoint:{x:'0%',y:'100%'},
        colors:[{color:'#ffffff',offset:0},{color:'#eeeeee',offset:.97 },{color:'#ffffff',offset: 1}]
    },

    BG_GRADIENT_SELECTED: {
        type: 'linear',
        startPoint: { x: '0%', y: '0%' },
        endPoint: { x: '0%', y: '100%' },
        colors:[{color:'#ffffcc',offset:0},{color:'#fdd40d',offset:.97 },{color:'#ffffcc',offset: 1}]
    },

    typeLookup: [
        '',
        'Residential',
        'MultiUnit',
        'Land',
        '',
        'Commercial',
        'Farm'
    ],

    DEFAULT_ROW_HEIGHT: '60dp',
    EXPANDED_ROW_HEIGHT: '150dp',
    PLUS: '/images/icons/plus.png',
    MINUS: '/images/icons/minus.png',
}

Number.prototype.fromTS = function() {

    function zeropad(str) {
        str = str.toString();
        while (str.length < 2) {
            str = '0' + str;
        }
        return str;
    }

    var a = new Date(this * 1000),
        month = zeropad(a.getMonth() + 1),
        day = zeropad(a.getDate()),
        year = a.getFullYear(),
        hour = a.getHours(),
        min = zeropad(a.getMinutes()),
        ap = 'am',
        longago = '',
        timediff = 0,
        now = 0,
        hr = 60*60,
        dy = hr*24,
        wk = dy*7,
        mt = dy*30,
        yr = dy*365;

    if (hour >= 12) {
        ap = 'pm';
        hour -= 12;
    }
    if (hour == 0) {
        hour = 12;
    }
    hour = zeropad(hour);
    
    now = Math.floor(new Date().getTime() / 1000);
    timediff = now - this;
    if (timediff > dy) {
        longago = Math.floor(timediff / dy);
        longago = (longago == 1) ? 'yesterday' : longago.toString() + ' days ago';
    }
    if (timediff > wk) {
        longago = Math.floor(timediff / wk);
        longago = (longago == 1) ? 'last week' : longago.toString() + ' weeks ago';
    }
    if (timediff > mt) {
        longago = Math.floor(timediff / mt);
        longago = (longago == 1) ? 'last month' : longago.toString() + ' months ago';
    }
    if (timediff > yr) {
        longago = Math.floor(timediff / yr);
        longago = (longago == 1) ? 'last year' : longago.toString() + ' years ago';
    }
    if (longago !== '') {
        longago = '  (' + longago + ')';
    }
    return month+'/'+day+'/'+year+'  '+hour+':'+min+ap+longago;
}

/**
 * This produces all the common stuff between the different property types for the list
 * 
 * @param {Object} data
 * @param {Object} options
 */
var PlistRowContent = function(data, options){
    var defaults = {
        height: c.DEFAULT_ROW_HEIGHT,
    };
 
    options = _.extend({}, defaults, options);

    var row = Ti.UI.createTableViewRow(options);
	row._data = data;
	row._open = false;
	row._extended = false;     // whether or not we've received extended data for this or not yet
	row.setBackgroundGradient(c.BG_GRADIENT);

    // The Property List NAME
    var labelName = Ti.UI.createLabel({
        color: '#000',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize+2, fontWeight:'bold'},
        text: data.name,
        left: '10dp',
        top:'12dp',
        horizontalWrap: false
    });
    row.add(labelName);

    var labelSent = Ti.UI.createLabel({
        color: '#999999',
        font: {fontFamily:'Arial', fontSize:c.defaultFontSize},
        text: (Search.hasField('actor') ? 'Sent: ' : 'Received: ') + data.st_lastrun.fromTS(),
        left: '10dp',
        top:'32dp',
        horizontalWrap: false
    });
    row.add(labelSent);

    var icon = Ti.UI.createImageView({
        image: c.PLUS,
        top: '22dp',
        right: '12dp',
        width: '18dp',
        height: '18dp',
    });
    row.add(icon);

	row.addEventListener('touchend', function(e){
	    this._open = !this._open;
	    var i, h;
	    if (this._open) {
            i = c.MINUS;
            h = c.EXPANDED_ROW_HEIGHT;
	    } else {
            i = c.PLUS;
            h = c.DEFAULT_ROW_HEIGHT;
	    }
        icon.setImage(i);
        var animation = Ti.UI.createAnimation({
            height: h,
            duration: 500,
        });
        this.animate(animation);
        this.setHeight(h);

        if (this._extended == false) {
            // Get our data and trigger the callback
            Criteria.reset();
            Criteria.addField('st_id', Criteria.CRITERIA_OPERATOR.EQUALS, data.st_id);

            plistdetails.getMany(Criteria, 0, function(d){
                var subSection = new SubContent(d, data);
                subSection.addEventListener('touchend', function(e){
                    e.cancelBubble = true;
                    Search.setPropertyListNamespace();
                    Search.reset();
                    Search.setPropertySearchType(c.typeLookup[data.st_ptype]);
                    Search.appendPropertyField('listno', Search.CRITERIA_OPERATOR.IN, data.st_listnum);
                    
                    Ti.App.fireEvent('transitionWindow', {
                        window : 'ResultsWindow'
                    });
                });
                row.add(subSection);
            });
            this._extended = true;
        }
	});

    return row;
}

module.exports = PlistRowContent;
