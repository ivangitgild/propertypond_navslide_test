var _ = require('./underscore');

/**
 * Configuration helper object
 */



var Config = {
    config : {},
    
    /**
     * Init function takes care of consolidating config files
     */
    init : function(){
        var prodConfig = require('config/production');
        var devConfig  = {};
        
        if (Ti.App.Properties.getString('production') !== 'true'){
            var devConfig = require('config/development');     
        }   
        
        this.config = _.extend(prodConfig, devConfig);
    },
    
    /**
     * Gets the value for the provided key from cached config
     * 
     * @param {string} key
     */
    getValue : function(key){
        return this.config[key];
    },
    
    /**
     * Sets the value for the provided key with the value provided
     * 
     * @param {string} key
     * @param {Object} value
     */
    setValue : function(key, value){
        this.config[key] = value;
    }
}

module.exports = Config;