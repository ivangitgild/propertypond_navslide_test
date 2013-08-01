var moment      = require('lib/moment'); 
/**
 * EXAMPLE DATE (January, 1, 2013 14h:08m:06s PM)
 * @param {string} e = format
 * Month 	(MMMM,MMM,MM,M) = (January, Jan, 01, 1)
 * Meridian (tt,t) 			= (PM,P)
 * second	(ss,s)			= (06,6)
 * Minute	(mm,m)			= (08,8)
 * Hour		(hh,h)			= (02,14)
 * Year		(yyyy,yy)		= (2013,13)
 * Day 		(dd,d)			= (01,1)
 */
Date.prototype.format=function(e){var t=this;var n=e;if(n.indexOf("M")>-1){var r,i;if(n.indexOf("MMMM")!=-1){i="MMMM"}else if(n.indexOf("MMM")!=-1){i="MMM"}else if(n.indexOf("MM")!=-1){i="MM"}else{i="M"}r=t.getMonth();switch(t.getMonth()){case 0:if(i=="MMMM"||i==="MMM"){r="January"}break;case 1:if(i=="MMMM"||i==="MMM"){r="February"}break;case 2:if(i=="MMMM"||i==="MMM"){r="March"}break;case 3:if(i=="MMMM"||i==="MMM"){r="April"}break;case 4:if(i=="MMMM"||i==="MMM"){r="May"}break;case 5:if(i=="MMMM"||i==="MMM"){r="June"}break;case 6:if(i=="MMMM"||i==="MMM"){r="July"}break;case 7:if(i=="MMMM"||i==="MMM"){r="August"}break;case 8:if(i=="MMMM"||i==="MMM"){r="September"}break;case 9:if(i=="MMMM"||i==="MMM"){r="October"}break;case 10:if(i=="MMMM"||i==="MMM"){r="November"}break;case 11:if(i=="MMMM"||i==="MMM"){r="December"}break;default:break}if(i==="MMM"){r=r.substring(0,3)}else if(i==="MM"&&r<10){r+=1;r="0"+r.toString()}else{if(i!="MMMM"){r+=1}}n=n.replace(i,r.toString())}if(n.indexOf("d")!=-1){var s=t.getDate();var o=n.indexOf("dd")!=-1?o="dd":"d";if(s<10&&o=="dd"){s="0"+s.toString()}n=n.replace(o,s)}if(n.indexOf("y")!=-1){var u,a;u=t.getFullYear().toString();if(n.indexOf("yyyy")!=-1){a="yyyy"}else{u=u.substring(0,2);a="yy"}n=n.replace(a,u)}if(n.indexOf("h")!=-1){var f,l;f=t.getHours();if(n.indexOf("hh")!=-1){l="hh";if(f>12){f=f-12}}else{l="h"}n=n.replace(l,f.toString())}if(n.indexOf("m")!=-1){var c,h;c=t.getMinutes();if(n.indexOf("mm")!=-1){c=(c<10?"0":"")+c.toString();h="mm"}else{c=c.toString();h="m"}n=n.replace(h,c)}if(n.indexOf("s")!=-1){var p,d;p=t.getSeconds();if(n.indexOf("ss")!=-1){p=(p<10?"0":"")+p.toString();d="ss"}else{p=p.toString();d="s"}n=n.replace(d,p)}if(n.indexOf("tt")!=-1){var v,m;var g=t.getHours()>12?false:true;if(n.indexOf("tt")!=-1){v=g?"AM":"PM";m="tt"}else{v=g?"A":"P";m="t"}n=n.replace(m,v)}return n;}

/**
 * Replaces all occurences of string 
 * @param {string} a = string to find
 * @param {string} b = replace with
 */
String.prototype.replaceAll = function(a,b) {
	// set default of nothing
	b = b != undefined && b != null ? b : '';
	var s = this.toString();
	while(s.indexOf(a) != -1){
		s = s.replace(a,b); 
	}
	return s; 
}

/**
 * Parse a JSON Date field and return it as a Locale Date String.
 * @param {bool} fullYear = get full 4-digit year (otherwise get as 2-digit string)
 */
String.prototype.parseDt=function(fullYear) {
    var d=new Date(parseInt(this.replace(/(^.*\()|([+-].*$)/g, '')));
    var yearString = d.getFullYear();
    
    if (!fullYear) {
        // console.log('not full year');
        yearString = yearString.toString();
        yearString = yearString.substr(-2);
    }
    
    return (1 + d.getMonth()) + '/' + d.getDate() + '/' + yearString;
}

/**
 * converts a number into a string formatted like money
 */
Number.prototype.formatMoney = function(c, d, t) {
  	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
 
/**
 * Convert a number to Radians
 */
Number.prototype.toRadians = function() {
	return this * Math.PI / 180;
};

/**
 * Checks if the date is within the hour of now
 */
Date.prototype.dateIsWithinTheHour = function() {
	var now = new Date();
	var dateToCheck = new Date(now.getFullYear(),			// YYYY year 
							   now.getMonth(),				// 0-11 month
							   now.getDate(),				// 1-31 days
							   now.getHours() - 1, 			// 0-23 hours
							   now.getMinutes(),			// 0-59 minutes
							   now.getSeconds()				// 0-59 seconds
	);
	return this > dateToCheck ? true : false;	
};




// Remove 
Array.prototype.removeAtIndex = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
}

var OS_NAME = {
	iPhone 	: 'iphone',
	iPad   	: 'ipad',
	Android : 'android',
	Tizen	: 'tizen'
};

/****************************************
 * Main Utilities object				*
 ****************************************
 * @event locationUpdated({Location}) 	*
 ****************************************/
var utilities = {
	/**
	 * libraries
	 */
	_ : require('lib/underscore'),
	moment : require('lib/moment'),
	/**
	 * Delete attributes
	 * @param {Object} sender : object to delete from
	 * @param {Array<string>}
	 */

	deleteProperties : function(sender, properties) {
		properties = utilities._.isString(properties) ? [properties] : properties;
		for (var i=0;i<properties.length;i++) {
			delete sender[properties[i]];	
		}
	},
	/**
	 * returns the name of an Ti object, e.i. TiUILabel
	 * @param {object} obj
	 */
	getObjectTypeName : function(obj) {
		var string = obj.toString();
		return string.replace('[object ','').replace(']','');
	},
	
	
	
	
	/**
	 * Sets a default value if the value doesn't exist
	 * @param {Object} value
	 * @param {Object} defaultValue
	 */
	setDefaultValue : function(value,defaultValue) {
		return value === undefined || value === null ? defaultValue : value;
	},
	
	/**
	 * validates a phone number and converts it to utah default
 	 * @param {string} phone
	 */
	validateAndFormatPhoneNumber : function(phone) {
		phone = phone.replaceAll("-").replaceAll(".").replaceAll("+").replaceAll("(").replaceAll(")").replaceAll(" ");
		// Add US internation calling code
		if (phone.length == 10) { phone = "1"+phone; } 
		// Add tel prefix
		if (phone.indexOf('tel:') == -1) { phone = 'tel:'+phone; }
		// return false if number is formatted correctly
		return phone.length == 15 ? phone : false; 
	},
	
	/**
	 * Checks whether a property is historical or not
	 * 
	 * TODO - Consider moving this to something more listing specific
     * @param {Object} data
	 */
    isHistoricalListing : function(data){
        var isHistorical = null;
        var yearAgo      = moment().hour(0).minute(0).millisecond(0).subtract('year', 1);
		
        // Make sure we have the fields we need
        if (data.status == 1){
            return false;
        } else if (data && data.status && (data.dt_sold || data.dt_expire)){
            var compareDate = null;
            // If sold check dt_sold date
            if (parseInt(data.status) == 8){
                var compareDate = moment(data.dt_sold);
            // If expired check dt_expired date
            } else if (data.status == 6){
                var compareDate = moment(data.dt_expire);
            }
            
            if (compareDate != null && compareDate.isBefore(yearAgo)){
                // console.log('It is before!');
                return true;
            } else {
                return false;
            }
        } else {
            throw "isHistoricalListing method requires that the status, dt_sold, and dt_expire fields are set (thrown from utilities.js).";
        }
    },
    
    // Returns the formatted, relevant price for a listing. If sold, sold price. Otherwise list or lease price if available.
    getRelevantPrice: function(listing) {
        var role = Ti.App.Properties.getString('role');
        var price;
        if (listing.status == 8) {
            price = listing.sold_price ? parseFloat(listing.sold_price).formatMoney(0,'',',') : 'N/A';
        }
        else if (listing.listprice !== null) {
            price = listing.listprice.formatMoney(0,'',',');
        }
        else if (listing.leaseprice !== null) {
            price = parseFloat(listing.leaseprice).formatMoney(0,'',',');
        }
        else {
            price = 'N/A';
        }
        
        return price;
    },
    
    currentLocation : Ti.App.Properties.getObject('currentLocation'),
    
    
    
    
    // Defaults
    getRole : function() { return Ti.App.Properties.getString('role'); },
    getAgentId : function() { return Ti.App.Properties.getString('agent_id'); },
    IsLoggedIn :  Ti.App.Properties.getString('role') !== 'guest' ? true : false,
    IsGuest : Ti.App.Properties.getString('role') === 'guest' ? true : false,
    OS : null,
    isTablet : false,
    Android : false,
    iPad : false,
    iPhone  : false,
    iOS : false,
    Tizen : false,
    DeviceWidth : Ti.Platform.displayCaps.platformWidth,
    DeviceHeight : Ti.Platform.displayCaps.platformHeight,
    deviceCanMakeCalls : false,
    init : function() {
    	switch (Ti.Platform.osname) {
        	case 'ipad' 	: this.OS = OS_NAME.iPad; this.iPad = true; this.iOS = true; break;
        	case 'android' 	: this.OS = OS_NAME.Android; this.Android = true; break;
        	case 'tizen'		: this.OS = OS_NAME.Tizen; this.Tizen = true; break;
        	case 'iphone' 	: 
        	default : this.OS = OS_NAME.iPhone; this.iOS = true; this.iPhone = true; break;
        } 
        
        if (!this.Android) {
        	this.deviceCanMakeCalls = Ti.Platform.canOpenURL('tel:18016765400') ? true : false;
        } else {
        	this.deviceCanMakeCalls = true;
        }
        
        this.isTablet = this.OS === 'ipad';
       	
                
       /***************************
        * Establishing a location *
        ***************************/
       /*
        Ti.App.Properties.setObject('currentLocation', { success :false });
        Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS);
        Ti.Geolocation.purpose = "Get current location";
        Ti.Geolocation.addEventListener('location', function(e) {
        	delete e.source;
        	Ti.App.Properties.setObject('currentLocation', e);
        	this.fireEvent("locationUpdated", e);	
        	
        });
        Ti.Geolocation.getCurrentPosition(function(e) {
        	delete e.source;
        	Ti.App.Properties.setObject('currentLocation', e);
        });
        */
        
       /**********************
        * Check Connectivity *
        **********************/
		var online = Ti.Network.getOnline();
		if (online) {
			var netWorkType = Ti.Network.getNetworkType(); 
			var netWorkTypeName = Ti.Network.getNetworkTypeName();
			switch (netWorkType) {
				case Ti.Network.NETWORK_WIFI : 
		    			// full loads, no data restrictions
				break;
				case Ti.Network.NETWORK_LAN :
					//  no vpn needed if used
				break;
				case Ti.Network.NETWORK_MOBILE :
					//  limited data usage
				break;
				case Ti.Network.NETWORK_NONE : 
					//  Don't allow any http requests
					return;
				break;
				case Ti.Network.NETWORK_UNKNOWN : 
					//  Not sure
				default : 
				break;  
		    };
		    	
		} else {
			alert('This application requires an active internet connection. No connection was found!');
		}
	},
  	getViewsWindow : function(view) {
		while(utilities.getObjectTypeName(view) !== 'TiUIWindow') {
			view = view.getParent();
		}
		return view;
	}
}


module.exports = utilities;