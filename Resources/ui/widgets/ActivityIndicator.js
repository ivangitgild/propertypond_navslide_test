var config = require('lib/config');

function ActivityIndicator(message) {
    // Build the containing view.
    this.view = Ti.UI.createView({
        backgroundColor:'black',
        opacity:.8,
        height: '60dp',
        width: '220dp',
        borderRadius:5,
        zIndex:3,
        visible:false
    });

    // Determine the indicator style (based on the OS).
    var style = null;
    if (config.getValue('osname') !== 'android') { // For iPhone/iPad
        style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
    } else { // For Android
        style = Ti.UI.ActivityIndicatorStyle.DARK;
        message = '  ' + message;
    }
        
    // Build the actual indicator.
    this.ai = Ti.UI.createActivityIndicator({
      color: 'white',
      font: {fontFamily:'Arial', fontSize:'16dp', fontWeight:'bold'},
      message: message,
      style : style,
      top:'10dp',
      left:'10dp',
      height:Ti.UI.SIZE,
      width:Ti.UI.SIZE
    });
    this.view.add(this.ai);
}

ActivityIndicator.prototype.show = function() {
    this.view.setVisible(true);
    this.ai.show();
}

ActivityIndicator.prototype.hide = function() {
    this.view.setVisible(false);
}

module.exports = ActivityIndicator;
