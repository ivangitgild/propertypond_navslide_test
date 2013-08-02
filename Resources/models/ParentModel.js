var config 		= require('lib/config');
var _      		= require('lib/underscore');
var Criteria	= require('lib/Criteria');
var util		= require('lib/utilities');
var timeout     = 10000;

/**
 * Parent Model to be used to inherit from for all models on this project
 */
var ParentModel = {
    /**
     * Represents the resource that we'll query. Should be overwritten by inheriting object.
     */
    resource : false,
    
    resourceUrl : '',
    
    /**
     * Represents the Primary Key field this is used for the PUT request and local db
     */
    keyField : null,
    /**
     * Represents the name of the table to be stored in the local db
     */
    tableName : null,
    /**
     * Represents local db helper
     */
   
    // Holds the orderBy criteria
    __orderBy : null,
    
    /**
     * Holds the last HTTPClient object
     */
    lastHTTPClient : null,
    
    setOrderBy : function(orderBy) {
        var changed = (orderBy !== this.__orderBy);
        this.__orderBy = orderBy;
        return changed;
    },

    getOrderBy : function() {
        return this.__orderBy;
    },
    
    // Hold the limit
    __limit : null,
    
    /**
     * Sets the limit to use in our query, this is $skip in odata
     * 
     * @param {int} limit
     */
    setLimit : function(limit) {
        var changed = (limit !== this.__limit);
        this.__limit = limit;
        return changed;
    },

    /**
     * Returns the current limit
     * 
     * @return {int}
     */
    getLimit : function() {
        return this.__limit;
    },    
    
    /**
     * Holds whether we want to return the full count or not.
     * 
     * @var {bool}
     */
    __fullCount : false,
    
    /**
     * Sets whether a query should return the full count in addition to the single page
     * 
     * @param {bool} fullCount 
     */
    setReturnFullCount : function(fullCount){
        this.__fullCount = fullCount;    
    },
    
    /**
     * Gets whether a query should return the full count in addition to the single page
     * 
     * @return {bool}
     */    
    getReturnFullCount : function(){
        return this.__fullCount;    
    },
	
	
	
	
    /**
     * Get function performs a restful 'GET' request
     *
     * @param {string}  urlAppend
      
     * @param {function} callback
     */
    get : function(resourceUrl, urlAppend, callback){
        // Perform the HTTP request
        //this.getAuthorizationCode();
        console.log(callback);
        var client_id = config.getValue('client_id');
        var client_secret = config.getValue('client_secret');
       	ParentModel._httpRequest('GET', urlAppend, null, resourceUrl, callback);
    },
    
    /**
     * Returns the number of rows of a query
     * @param {string},
     * @param {function}
     * @return { count :{int},filter:{string} }
     */
    getCountWithFilter : function(filter, callback) {
        var query = (filter ? "?$filter=" + escape(filter) : '') + '&$inlinecount=allpages';
        var callbackWrapper = function(data) {
            // console.log(JSON.stringify(data));
            var countData = {
                count : parseInt(data.d.__count),
                filter : filter
            };
            callback(countData);
        }
        this.get(query, callbackWrapper);   
    },
    
    /**
     * Returns a list of rows with basic information (defined by select array)
     * @param {array} select - an array of fields we want to select
     * @param {int} offset - how many rows to skip in the data we want to display
     * @param {function} callback function
     * @param {lib/Criteria.js} the object that is passed that is converted to the uri
     */
     getRowsWithOffset : function(select, criteria, offset, callback) {
        
        if (criteria && criteria.criteria) {
            Criteria.setCriteria(criteria.criteria);        
            criteria = Criteria;
        } 
        
        // Ensure we have the base requirements to run this criteria
        if (criteria == null || !_.isObject(criteria) || typeof(criteria.toFilterString) != 'function') {
            Ti.API.error("@criteria object must be of type lib/Criteria.js");
            return;
        }
        
        var query = '', filter = criteria.toFilterString();;
        
        // Filter
        if (filter && _.isString(filter)) {
            query += '$filter=' + escape(filter);
        }
        // Select Fields
        if (select && _.isArray(select)) {
            query += '&$select=' + escape(select.join(','));
        }
        // Limit
        if (this.__limit && this.__limit > 0 && _.isNumber(this.__limit)) {
            query += '&$top=' + this.__limit;
        }        
        // Offset
        if (offset && offset > 0 && _.isNumber(offset)) {
            query += '&$skip=' + offset;
        }
        // Full Count
        if (this.__fullCount) {
            query += '&$inlinecount=allpages';
        }        
        // Yes, this is an optimization, but there can be no orderBy clause w/o a filter !
        if (filter && _.isString(filter) && _.isString(this.__orderBy) && this.__orderBy.length > 3) {
            query += '&$orderby=' + escape(this.__orderBy);
        }
        // Query It!
        this.getWithQueryOptions(query, callback);
    },

    /**
     * Performs a restful 'GET' request appending odata query options (e.g., '$filter=field eq 'value')
     *
     * @param {string} queryOptions
     * @param {function} callback
     */
    getWithQueryOptions : function(resourceUrl, queryOptions, callback) {
    	console.log(callback);
        this.get(resourceUrl,'?'+queryOptions, function(data) {
        	if (data) {
        		if (data.error) {
	                Ti.API.error(data.error);
	            }
	            if (data.d && data.d.results){
	            	
	                var totalCount = null;
	                if (data.d && data.d.__count){
	                    totalCount = data.d.__count;    
	                } else {
	                    totalCount = data.d.results.length; 
	                }
	                console.log(totalCount);
	                console.log(data.d);
	                callback(data.d.results, data.d.__next, parseInt(totalCount));
	            } else {
	                callback(data.d, null, data.d.length);
	            }	
        	}
            
        });
    },

    /**
     * Performs a restful 'GET' using intended to query the primary key passing id
     *
     * @param {string} fieldName
     * @param {int} id
     * @param {function} callback
     */
    getWithId : function(fieldName, id, callback){
        this.get('('+fieldName+'='+id+')', function(data){
            // TODO Make all the callback signatures uniform and then use a shared method to handle version-checking OData results.
            if (data.d.results) {
                callback(data.d.results);
            }
            else {
                callback(data.d);
            }
        });
    },

    /**
     * function performs a restful 'POST' request
     *
     * @param {object}  	postData	Data that is posted to the body
     * @param {function} 	callback	Function called when POST is complete
     * @returns { success:<bool>, id:<int|null>, message:<null|string> } // id is primary key
     */
    post : function(postData, resourceUrl, callback) {
    	if (postData == null) {
    		Ti.API.error("No data has been set for post");
    		return;
    	}
    	
    	var client_id = config.getValue('client_id');
        var client_secret = config.getValue('client_secret');
        this.getAccessToken(function(data){
        	if(_.size(data) > 0) {
        		var postData2 = {
        			client_id : client_id,
        			client_secret : client_secret,
        			grant_type : 'client_credentials',
        			access_token : data.access_token
        		};
        		postData = postData + postData2;
        		// Perform the HTTP request
		    	this._httpRequest('POST', null, postData, resourceUrl, function(data){
		    	    data = data.d.results[0];
		            if (data.success && this.keyField != null) {
		                this[this.keyField] = data.id;
		            }
		            callback(data);
		    	});
        	}
        });
    	
    },

    /**
     * function performs a restful 'POST' request
     *
     * @param {object}  	putData		Data that is appended to the body
     * @param {function} 	callback	Function called when PUT is complete
     * @returns { success:<bool>, message:<string> }
     */
    put : function(putData, callback){
        if (putData == null) {
    		Ti.API.error("No data has been set for put");
    		return;
    	}
    	
    	if (this.keyField == null) {
    		Ti.API.error("You must specify a keyField before using the 'PUT' request. The keyField is the primary key field for an object.");
    		return;
    	}
    	
    	var querystring = '?' + this.keyField + '=' + putData[this.keyField];
    	
    	// Perform the HTTP request
    	this._httpRequest('PUT', querystring, putData, function(data){ callback(data.d.results[0]); });
    },

    /**
     * Will perform a restful 'DELETE', delete is a reserved keyword
     */
    remove : function(deleteData, callback){
        if (deleteData == null) {
    		Ti.API.error("No data has been set for put");
    		return;
    	}

    	var queryString = '';
    	var index = 0;
		for (var _data in deleteData) {
			queryString += (index === 0 ? '?' : '&') + 
						_data + '=' + deleteData[_data];
			index++;
		}
		
		this._httpRequest('DELETE', queryString, {}, function(data){ 
			callback(data.d.results[0]);
		});
    },

    /**
     * Will perform a restful 'OPTIONS'
     */
    options : function(){
        throw "Not Implemented Yet";
    },
    
    
    authorize : function(){
    	
   	},
    
    getAccessToken : function(callback){
    	var postData = {
    		'client_id' : config.getValue('client_id'),
    		'client_secret' : config.getValue('client_secret'),
    		'grant_type' : 'client_credentials'
    	};
    	//this.setResourceUrl('/');
    	this._httpRequest('POST', 'access-token', postData, '/', function(data){
    	   	//console.log(data);
            callback(data);
    	});
    },
    /*
     * Creates and sends an HTTP request.
     * 
     * @param string method HTTP method such as 'GET', 'POST', etc.
     * @param string urlAppend String to append to the URL, if relevant
     * @param object|string sendData Data to send in the request body
     * @param function Callback function (for when request is successful)
     */
    _httpRequest : function(method, urlAppend, sendData, resourceUrl, callback){
    	resourceUrl = resourceUrl || '';
    	console.log(resourceUrl);
    	console.log(urlAppend);
    	var online = Ti.Network.getOnline();
		if (!online) {
			alert('This feature requires an internet connection and no active internet connection was found. Please check your settings to make sure your wifi or cellular data is turned on.');
			return false;
		}
    	
        // A callback function must be provided
        if (!_.isFunction(callback) ) {
            throw "Callback provided to HTTP request is not a function";
        }
        
        // this.resource is the name of the OData service i.e. 'Agent'. It should be
        // defined in the individual models.
        if (this.resource === false) {
            //throw "Query resource is not defined";
        }
        
        var url = config.getValue('ppapi_url') + resourceUrl;
        
        if (urlAppend) {
            url += urlAppend;
        }
        
        // if (url.indexOf("$format") == -1) {
        	// url += (url.indexOf("?") == -1 ? "?" : "&") + "$format=json";
        // }
        
        // Here are some test URLs with which to try out various service errors...
        // url = 'http://asldjfasldkgjaldsgasdga.com'                   // connection failure
        // url = 'http://www.google.com:81';                            // connection timeout
        // url = 'http://xmtp.net/~jcharrey/ure/timeout-test.php';      // response timeout
        // url+= '&$foo=bar';                                           // bad request

        // Initialize the HTTP client that will perform the request
        var client = Ti.Network.createHTTPClient({
            // function called when the response data is available
            onload : function(e) {
                // If we've already handled the response, don't do it a second time
                if (this.handled) {
                    Ti.API.debug('Service response already handled, abandoning onload callback.');
                    return;
                }
                this.handled = true; // flag used for timeout trap
                // console.log('onload: '+JSON.stringify(e));
                // console.log('status: '+this.status);
                // console.log('status text: '+this.statusText);
                
                // console.log(this.responseText);
                var response = null;
                if (this.responseText) {
                	response = JSON.parse(this.responseText);
                }
                console.log(response);
                callback(response);
            },
            // function called when an error occurs, including a timeout
            onerror : function(e) {
                // If we've already handled the response, don't do it a second time
                if (this.handled) {
                    Ti.API.debug('Service response already handled, abandoning onerror callback.');
                    return;
                }
                this.handled = true; // flag used for timeout trap
                
                Ti.API.debug('error obj: '+JSON.stringify(e));
                Ti.API.debug('raw error: '+e.error);

                // If we got an HTTP status code, show status text
                if (this.status) {
                    alert(this.statusText);
                }
                // If status code doesn't exist, we'll have to figure out what happened from the error text
                else {
                    // Clean up the error string (platform-dependent)
                    var error = '';
                    switch(util.OS) {
                        case 'iphone':
                            var re = /ASIHTTPRequestErrorDomain Code=\d+ "(.+?)"/;
                            var matches = e.error.match(re);
                            if (matches){
                                if (matches.length > 0) {
                                	error = matches[1];	
                                } else {
                                	error = matches[0];
                                }
                            }
                            else {
                                error = e.error;
                            }
                            break;
                        case 'android':
                            if (e.error.match(/timeout|timed out/i)) {
                                error = 'The request timed out';
                            }
                            else {
                                error = e.error;
                            }
                            break;
                        default:
                            error = e.error;
                    }
                    
                    Ti.API.debug('clean error: '+error);
                    
                    // If the error was cause by a timeout, give them an option to retry
                    if (error == 'The request timed out') {
                        var dialog = Ti.UI.createAlertDialog({
                            title: 'Request timeout',
                            message: 'Would you like to retry?',
                            buttonNames: ['Retry', 'Cancel'],
                            cancel: 1
                        });
                        dialog.addEventListener('click', function(e){
                            switch(e.index) {
                                case 0:
                                    Ti.API.debug('The retry button was clicked');
                                    ParentModel._httpAttempt(client, method, url, sendData);
                                    break;
                                case e.source.cancel:
                                    Ti.API.debug('The cancel button was clicked');
                            }
                        });
                        dialog.show();
                    }
                    else {
                        if (error) {
                            alert(error);
                        }
                    }
                }
            },
            handled : false     // whether a callback has executed
        });
        // Separate call due to Android bug: http://bit.ly/12puDCO
        client.setTimeout(timeout); // in milliseconds
        
        this.lastHTTPClient = client;
        
        this._httpAttempt(client, method, url, sendData);
    },
    
    /*
     * This function separates out the actual connection attempt code so that it can
     * be retried. Theoretically you're not supposed to reuse HTTPClient objects. But
     * everybody's doing it... it's no big deal.
     * 
     * @param object HTTPClient
     * @param string method HTTP method such as 'GET', 'POST', etc.
     * @param string url Final request URL
     * @param object|string sendData Data to send in the request body
     */
    _httpAttempt : function(client, method, url, sendData) {
        // Prepare the connection.
        client.open(method, url);
        
        // Add authentication headers
        this._addAppAuthHeaders(client);
        this._addUserAuthHeaders(client);
        
        // Set a trap for uncatchable native exceptions and connection timeouts on Android.
        setTimeout(function(){
            // HTTPClient readyState constants not working, resorting to magic numbers
            if ((client.readyState !== 4) && !client.handled) { 
                Ti.API.error('HTTPClient trap triggered! This might be caused by an uncatchable native exception or a connection error.');
                client.onerror({'error':'An unknown error occurred'});
            }
        }, timeout + 1000);
        
        console.log('Calling PPAPI with the following URL:');
        console.log(url);

        // Specify JSON output and send the request
        client.setRequestHeader('accept', 'application/json');
        console.log(client);
        client.send(sendData);
    },
    
    /*
     * Add the headers for our application-level security scheme
     */
    _addAppAuthHeaders : function(client){
    	// Add the app-level auth headers to the request.
        var now = new Date();
        var hash_time = Math.floor(now.getTime() / 1000);
        var hash_str = config.getValue('sha256_secret_key') + '___' + hash_time + '___' + client.getLocation();
        var hash_val = Ti.Utils.sha256(hash_str);
        var header_time = now.toUTCString();
        
        client.setRequestHeader('Date', header_time);
        client.setRequestHeader('PP-Security', hash_val);
    },
    
    /*
     * Add the header for user-level security using basic auth
     */
    _addUserAuthHeaders : function(client){
    	 // Verify that we have valid credentials before request
        var username = Ti.App.Properties.getString('username');
        var password = Ti.App.Properties.getString('password');
        
        if (username && password) {
            // Prepare authentication string
            authstr = 'Basic ' + Titanium.Utils.base64encode(username + ':' + password);

            // Send credentials header
            client.setRequestHeader('Authorization', authstr);
        }
    },
    
    /**
     * Grabs the last HTTPClient request object
     */
    getLastHttpClient : function(){
        return this.lastHTTPClient;
    },
    
    /**
     * Set Resorce
     */
    setResourceURL : function(controller){
    	this.resourceUrl = controller;
    }
}

// Return Parent Model
module.exports = ParentModel;
