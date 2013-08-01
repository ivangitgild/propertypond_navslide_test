/* Used in the PropertySearch Object */
_ = require('lib/underscore');

/************
 * Criteria *
 ************/

/*
 * @method ~ setCriteria(criteria<CriteriaDef>);
 * @example : Criteria.setCriteria(criteria);
 * @return 	: void

 * @method ~ getCriteria();
 * @example : Criteria.getCriteria();
 * @return 	: CriteriaDef 	

 * @method ~ addField(fieldName<string>,operator<Criteria.OPERATOR>,value<int|string>); 
 * @example : Criteria.addCriteria("listno", Criteria.CRITERIA_OPERATOR.EQUALS, 792418);
 * @return 	: CriteriaDef

 * @method ~ removeAllField(fieldName<string>)
 * @example : Criteria.removeCriteria("tot_sqft");
 * @return 	: CriteriaDef

 * @method ~ removeField(fieldName<string>)
 * @example : Criteria.removeCriteria("tot_sqft");
 * @return 	: CriteriaDef

 * @method ~ removeFieldValue(fieldName<string>, value<int|string>)
 * @example : Criteria.removeCriteriaValue("listno", 792418);
 * @return 	: CriteriaDef
  
 * @method ~ convertToFilter()
 * @example : Criteria.convertToFilter();
 * @return 	: string	

*/

var Criteria = {
	// Criteria Definition
	__CriteriaDef : { }, /* Object that is set and exported */
	
	// Constants
	CRITERIA_OPERATOR : {
		EQUALS : 1,
		IN : 2,
		GREATER_THAN : 3,
		GREATER_THAN_EQUAL_TO : 4,
		LESS_THAN : 5,
		LESS_THAN_EQUAL_TO : 6,
		IGNORE: 7,
		NOTEQUALS : 8,
		NOTIN : 9
	},
	
	// Sets the criteria with a new definition
	setCriteria : function(criteria) {
		this.__CriteriaDef = criteria;
		return this.__CriteriaDef;
	},
	
	// Gets the current criteria's definition
	getCriteria : function() {
		return this.__CriteriaDef;
	},
	
	// Add field with value to the criteria definition
	addField : function(fieldName, operator, value, fieldValue,isString) {
		isString = isString ? isString : false;
		
		this.__isValidOperator(operator);
		var obj = this.__CriteriaDef[fieldName];
		fieldValue = fieldValue || value;
		obj = { operator : operator, value : value, fieldValue : fieldValue, isString : isString };
		this.__CriteriaDef[fieldName] = obj;
		return this.__CriteriaDef;
 	},
 	
 	/**
	 * Checks if a property field does exists
	 * @param {String} fieldName
	 * 
	 */
	hasField : function(fieldName) {
		if (this.__CriteriaDef[fieldName]) {
			return true;
		} return false;
	},
 	
 	// Add field with value to the criteria definition
    appendField : function(fieldName, operator, value, fieldValue) {
        this.__isValidOperator(operator);
        var obj = this.__CriteriaDef[fieldName];
        
        // check if exists
        if (obj == undefined || obj == null) {
            fieldValue = fieldValue || value;
            obj = { operator : operator, value : value, fieldValue : fieldValue };
            this.__CriteriaDef[fieldName] = obj;
        }
        else {
            if (_.isArray(obj)) {
                obj.push({operator : operator, value : value, fieldValue : fieldValue });
            } else {
                switch (obj.operator) {
                    
                    case Criteria.CRITERIA_OPERATOR.IN :
                    case Criteria.CRITERIA_OPERATOR.NOTIN : 
                        if (obj.value.length == 0) {
                            obj.value = value.toString();
                        } else {
                            obj.value += "," + value.toString();
                        }                       
                    break;
                        
                    default : 
                        this.__CriteriaDef[fieldName] = [this.__CriteriaDef[fieldName]];
                        this.__CriteriaDef[fieldName].push({operator : operator, value : value, fieldValue : fieldValue });
                    break;
                }
            }
        }
        return this.__CriteriaDef;
    },
 	
 	/**
 	 * 
 	 * @param : fn
 	 */
 	removeFunction : function(fn) {
 		var _functions = this.__CriteriaDef['function'];
 		if (!_functions) { return; }
 		for (var a = 0; a < _functions.length; a++) {
 			var _function = _functions[a];
 			if (_function === fn) {
 				_functions.splice(a, 1);
 			}
 		}
        if (!_functions.length){
            delete this.__CriteriaDef['function'];
        } else {
            this.__CriteriaDef['function'] = _functions;
        }
 	},
 	
    
    /**
     * 
     * @param : fn
     */
    removeFunctionByName : function(fn) {
        //console.log('criteria: ', JSON.stringify(this.__CriteriaDef));
        var _functions = this.__CriteriaDef['function'];
        if (!_functions) { return; }
        for (var a=0;a<_functions.length;a++) {
            var _function = _functions[a];
            if (_function.search(fn) !== -1) {
                _functions.splice(a, 1);
            }
        }
        if (!_functions.length){
            delete this.__CriteriaDef['function'];
        }else{
            this.__CriteriaDef['function'] = _functions;
        }
    },
 	
 	/**
 	 * adds a function to the criteria, returns the criteria def
 	 * @param {string} fn ~ function
 	 */
 	addFunction : function(fn) { 	   
 	    //console.log('criteria: ', JSON.stringify(this.__CriteriaDef));
 		var _functions = this.__CriteriaDef['function'];
 		if (!_functions) {
 			_functions = [];
 		} 

 		_functions.push(fn);
 		this.__CriteriaDef['function'] = _functions;
 		return this.__CriteriaDef;
 	},
 	
 	/**
 	 * Returns a function object by type (zip,city,geoclose,georect,county,etc)
 	 */
 	getFunctionByType : function(type) {
 		var fns = this.getAllFunctionNames();
 		
 		if (fns) {
 			for (var i=0;i<fns.length;i++) {
	 			var fn = fns[i];
	 			// split the function to parts
	 			var fnName = fn.substring(0, fn.indexOf('('));
	 			
	 			var fnString = fn.toString().substring(fn.indexOf('(')+1, fn.indexOf(')'));
		 		var fnSplit = fn.split(',');
		 		if (!fnSplit[0] || !fnSplit[1]) {
		 			this.removeFunctionByName(fnName);
		 			return null;
		 		}
		 		
		 		var fn1 = fnSplit[0].trim();
		 		var fn2 = fnSplit[1].trim();	
		 		var obj = {};
		 		if (type === 'geoclose' && fnName === 'geoclose') {
		 			return {	
		 				_function : fn,
		 				type : 'geoclose',
		 				latitude : fn1,
		 				longitude : fn2
		 			};
		 		}
		 		
		 		if (type === 'georect' && fnName === 'georect') {
			 		return {	
			 			_function : fn,
			 			type : 'georect',
			 			xmin : fn1,
			 			ymin : fn2,
			 			xmax : fnSplit[2].trim(),
			 			ymax : fnSplit[3].trim()
			 		};
		 		}
		 		
		 		if (type != 'georect' && type != 'geoclose') {
		 			if (type === fn2) {
		 				return {
		 					_function : fn,
		 					type : fn2,
		 					value : fn1
		 				};
		 			}		
		 		}
	 		} 
 		}
 		return null;
 	},
 	
 	getFunctionValue : function(fn) {
 		var fns = this.__CriteriaDef['function'];
 		for (var a=0;a<fns.length;a++) {
 			var _fn = fns[a];
 			var _fnName = this.getAllFunctionNames(_fn);
 			if (this.getAllFunctionNames(fn) == _fnName) {
 				var start = _fnName.indexOf("(");
 				var end = _fnName.indexOf(")");
 				return _fnName.substring(start, end-start);
 			} 
 		}
 	},
 	
 	/**
 	 * Returns a list of all function names found in the parameter
 	 */
 	getAllFunctionNames : function() {
 		var names = [];
 		var fns = this.__CriteriaDef['function'];
 		if (!fns) { return names; }
 		for (var a=0;a<fns.length;a++) {
 			var fn = fns[a];
 			names.push(this.getFunctionName(fn)); 
 		}
 		return names;
 	},
 	
 	/**
 	 * Returns the name of the function
 	 * @param {string|object} fn ~ function, if is object will convert to string 
 	 */
 	getFunctionName : function(fn) {
 		if (typeof(fn) != 'string') {
 			fn = JSON.stringify(fn);
 		}
 		return fn.substring(0,fn.indexOf("("));
 	},

	/**
	 * returns the uri used to query odata
 	* @param {string} queryString ~ Uri to append string to
	 */
 	toFilterString: function(queryString) {
 		queryString = queryString ? queryString : '';
 		var c = this.__CriteriaDef;
 		
 		var fieldCount = 0;
		for (var field in c) {
			// console.log("Field: " +field);
			var obj = c[field];
			if (obj.operator && obj.operator == this.CRITERIA_OPERATOR.IGNORE) { continue; }
			
			if (_.isArray(obj) && field != 'function') {
			    var innerArrayCount = 0;
			    var innerArrayQueryString = '';
				for (var a = 0; a < obj.length; a++) {
					var o = obj[a];
					if(o.operator == this.CRITERIA_OPERATOR.IGNORE) { continue; }
					innerArrayQueryString += (innerArrayCount > 0 ? " and " : " ") + this.__returnFilterValue(o, field);
					innerArrayCount++
				}
				
				if (innerArrayQueryString != ''){
				    queryString += fieldCount > 0 ? " and " : "";
				    queryString += innerArrayQueryString;
			    }
			} else {
			    queryString += fieldCount > 0 ? " and " : "";
			    // console.log(JSON.stringify(obj));
				queryString += this.__returnFilterValue(obj, field);
			}
			
			fieldCount++;
		}
 		console.info('queryString: ', queryString);
 		return queryString;
 	},
 	
 	reset : function(exceptionFields) {
 		this.__CriteriaDef = {};
 	},
 	
 	removeAll : function(exceptionFields) {
 		for (var field in this.__CriteriaDef) {
 			var canDelete = true;
 			for (var a = 0; a < exceptionFields.length; a++) {
 				var exceptionField = exceptionFields[a];
 				if (exceptionField == field) {
 					canDelete = false;
 				}
 			}
 			if (canDelete) {
 				delete this.__CriteriaDef[field];
 			}
 		}
 		return this.__CriteriaDef;
 	},
 	
 	// Removes the field and all values associated with that field from the definition
 	removeField : function (fieldName) {
 		delete this.__CriteriaDef[fieldName];
 		return this.__CriteriaDef; 
 	},
 	
 	// Removes a single value from the field, if non are left then it removes the field too
 	removeFieldValue : function(fieldName, value) {
 		var obj = this.__CriteriaDef[fieldName];
 		if (_.isArray(obj)) {
 			for (var a = 0; a < obj.length; a++) {
 				var o = obj[0];
 				if (o.value.toString() == value.toString()) {
 					obj.splice(a, 1);
 					break;
 				}
 			}
 			if (obj.length == 0) {
 				delete this.__CriteriaDef[fieldName];
 			} else {
 				this.__CriteriaDef[fieldName] = obj;
 			}
 		}
 		else {
 			
 			// Split the values
 			var values = obj.value.split(',');
 			for (var a = 0; a < values.length; a++) {
 				var val = values[a];
 				if (val.toString() == value.toString()) {
 					values.splice(a, 1);
 					break;
 				}
 			}
 			
 			// if values are empty remove the field from the definition
 			if (values.length == 0) {
 				delete this.__CriteriaDef[fieldName];
 			} else {
 				this.__CriteriaDef[fieldName] = values.join(',');
 			}
 		}
 		return this.__CriteriaDef;
 	},
 	
 	
 	/*
 	 * Removes a constraint from a field based on a given operator. This would 
 	 * be used for appended criteria. If no constraints remain the whole field
 	 * is removed.
 	 */
 	removeFieldOperator : function(fieldName, operator) {
 	    this.__isValidOperator(operator);
        var obj = this.__CriteriaDef[fieldName];

        if (obj != undefined && obj != null) {
            // If the field contains an array of criteria, check each one
            if (_.isArray(obj)) {
                obj = _.reject(obj, function(c){ return c.operator == operator; });
                
                // If the criteria is empty remove the field
                if (obj.length == 0) {
                    delete this.__CriteriaDef[fieldName];
                } else {
                    this.__CriteriaDef[fieldName] = obj;
                }
            }
            // If the field is a single criteria, just check the one operator
            else {
                if (obj.operator == operator) {
                    delete this.__CriteriaDef[fieldName];
                }
            }
        }

        return this.__CriteriaDef;
 	},
 	

 	
 	__operatorToString : function(operator) {
		this.__isValidOperator(operator);
		var _op = {
			1 : "eq",
			2 : "eq",
			3 : "gt",
			4 : "ge",
			5 : "lt",
			6 : "le",
			7 : null,
			8: "ne",
			9: "ne"
		};
		return _op[operator];
	},
	
	// Add field with value to the criteria definition
    // Checks if the operator is valid
	__isValidOperator : function(operator) {
		for (var oper in this.CRITERIA_OPERATOR) {
			if (this.CRITERIA_OPERATOR[oper] == operator) {
				return;
			}
		}
		throw "The operator "+JSON.stringify(operator)+" is not valid." ;
	},

	// 	
	__cleanValue : function(value, isString) {
		isString == (isString == undefined || isString == null ? false : isString);
		if (isString) {
			return "'" + escape(value) + "'";
		}
		// else
		return value;
	},
	
	// Converts a field to a filter value
	__returnFilterValue : function(obj, field) {
		if (field == "function") {
			var queryString = "";
			if (this.__CriteriaDef['function']) {
	 			for (var a = 0; a < this.__CriteriaDef['function'].length;a++) {
	 				var fn = this.__CriteriaDef['function'][a];
	 				queryString += (queryString.length > 0 ? " and " : "") + fn; 
	 			}
	 		}
 			return queryString;
		}
		
		if (obj.operator == this.CRITERIA_OPERATOR.IGNORE) {
			return '';
		}
		
		var filterValue = '';
		switch (obj.operator) {
			case this.CRITERIA_OPERATOR.IN : 
			case this.CRITERIA_OPERATOR.NOTIN : 
				filterValue += "(";
				var values = obj.value.split(",");
				for (var a = 0; a < values.length; a++) {
					var value = values[a];
					if (obj.operator == this.CRITERIA_OPERATOR.IN) {
					   filterValue += (a > 0 ? " or " : "") + field + " " + this.__operatorToString(obj.operator) + " " + this.__cleanValue(value, obj.isString);
					}
					else {
					   filterValue += (a > 0 ? " and " : "") + field + " " + this.__operatorToString(obj.operator) + " " + this.__cleanValue(value, obj.isString);
					}
				}
				filterValue += ")";
				
			break;
			default :
					if (_.isArray(obj.value)) {
						for (var a = 0; a < obj.value.length; a++) {
							filterValue += field + " " + this.__operatorToString(obj.operator) + " " + this.__cleanValue(obj.value[a], obj.isString);		
						}
					} else {
						filterValue += field + " " + this.__operatorToString(obj.operator) + " " + this.__cleanValue(obj.value, obj.isString);
					}
							
			break;
		}
		return filterValue;
	}	

}

module.exports = Criteria;

