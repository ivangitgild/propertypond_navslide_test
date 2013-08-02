/**
 * @Name : SavedSearches
 * @database : r3d0
 * @table : saved_searches
 */

/**
 * Require/Imported Classes
 */
var _			= require('lib/underscore');
var ParentModel = require('./ParentModel');

/**
 * Create a new object that inherits from the parent
 */
SavedSearches = Object.create(ParentModel);
SavedSearches.resource = 'SavedSearches';
SavedSearches.allFields = new Array( 'agentid', 'ahs_suspend','branded_url_id', 'clientrun','cma_data','count','createdt','criteria','default_report','email','email_body','email_rcpt','email_subject','email_what','expire','flg','lastahs','lastrun','notes','pclass_id','query','run_dom','run_dow','run_time','save_type','sf_id','ss_id','ss_name','timeflg','visibility');
SavedSearches.limitedField = null;
SavedSearches.keyField = "ss_id";
SavedSearches.tableName = "saved_searches";

/**
 * @param 	{int} 		savedSearchId	required	ss_id
 * @param 	{function} 	callback 		required	function called when data is returned
 */
SavedSearches.getSavedSearchById = function(savedSearchId, callback) {
	if (!_.isFunction(callback)) {
		throw "The callback parameter provided was not a function";
	}
	this.getWithId("ss_id", savedSearchId, callback);
}

/**
 * @param 	{int} 		agentId		required	agentid
 * @param 	{function} 	callback 	required	function called when data is returned
 */
SavedSearches.getAllSavedSearchesByAgentId = function(agentId, callback) {
	if (!_.isFunction(callback)) {
		throw "The callback parameter provided was not a function";
	}
	var queryOptions = "$filter=(agentid eq " + agentId.toString() + ")";
	this.getWithQueryOptions(queryOptions, callback);
}

/**
 * @param 	{SearchCriteria}	savedSearch 	required	new SavedSearch();
 * @param	{function}			callback		required	function called when PUT request is complete 	 
 */
SavedSearches.saveSearch = function(searchCriteria, callback) {
	json = {};
	// removed unused fields
	for (var field in searchCriteria) {
		if (searchCriteria[field] != null) {
			json[field] = searchCriteria[field];
		}
	}
	
	if (this.ss_id == null) {
		this.post(json, callback);	
	} else {
		this.put(json, callback);
	}
}

SavedSearches.getListingStates = function() {
	return __getListingObjectAsArray(LISTING_STATE);
}

SavedSearches.getListingTypes = function() {
	return __getListingObjectAsArray(LISTING_TYPE);
}

SavedSearches.getListingStatuses = function() {
	return __getListingObjectAsArray(LISTING_STATUS);
}

function SearchCriteria() {
	this.city = null;	// array if ids
	this.dim_acres1 = null; // float
	this.dim_acres2 = null; // float
	this.listprice1 = null; // integer
	this.listprice2 = null; // integer
	this.listtype = [LISTING_TYPE.RESIDENTIAL]; // DEFAULT
	this.proptype = null; // array of ids
	this.shortsale = null; // bool
	this.state = [LISTING_STATE.UT]; // char(2)
	this.status = [LISTING_STATUS.ACTIVE];	
	this.style = null; // array of ids
	this.street = null; // string
	this.tot_bath1 = null; // integer
	this.tot_bath2 = null; // <integer>
	this.tot_bed1 = null; // integer
	this.tot_bed2 = null; // integer
	this.tot_sqf1 = null; // integer
	this.tot_sqf2 = null; // integer
	this.yearblt1 = null; // integer
	this.yearblt2 = null; // integer
	this.housenum = null; // integer
	this.zip = null; // integer
	
	this.addListingStatus = function(listingStatus) { this.status.push(listingStatus); };
	this.removeListingStatus = function(listingStatus) {
		if (typeof listingStatus == "number") { // index
			this.status.splice(listingStatus, 1);
			return;
		} else { // object
			for (var a = 0; a < this.status.length; a++) {
				var status = this.status[a];
				if (status === listingStatus) {
					this.status.splice(a, 1);
					return;	
				}
			}
		}
	};
}

var LISTING_TYPE =  {
	COMMERCIAL : { text : "Commercial", value : 5, display: true },
	FARM : { text : "Farm", value : 6, display: true },
	LAND : { text : "Land", value : 3, display: true },
	MULTI_UNIT : { text : "Multi-Unit", value : 2, display: true },
	RESIDENTIAL : { text : "Residential", value : 1, display: true }
};

var LISTING_STATUS = {
	ACTIVE : { text : "Active", value : 1, display: true },
	ACTIVE_SS : { text : "Active/Short-Sale", value : 9, display: true },
	ACTIVE_TC : { text : "Active/Time Clause", value : 2, display: true },
	CERT_OCC : { text : "Certificate of Occupance", value : 11, display: true }, // Near completion of a construction
	EXPIRED : { text : "Expired", value : 6, display: true },
	OFFMARKET : { text : "Off the Market", value : 5, display: true },
	SOLD : { text : "Sold", value : 8, display: true },
	TITLE : { text : "Title", value : 10, display: true },
	UNDER_CONTRACT : { text : "Under Contract", value : 3, display: true },
	WITHDRAWN : { text : "Withdrawn", value : 4, display: true }
};

var LISTING_STATE = {
	AZ : { text : "Arizona", value : "az", display: true },
	CO : { text : "Colorado", value : "co", display: true },			
	ID : { text : "Idaho", value : "id", display: true },	
	NV : { text : "Nevada", value : "nv", display: true },
	UT : { text : "Utah", value : "ut", display: true },
	WY :{ text : "Wyoming", value : "wy", display: true }
};

/**
 * @description : Used to convert the LISTING_* objects into an array for lists
 * @param 	{SavedSearch}   savedSearch 	required	new SavedSearch();
 * @param	{function}		callback		required	function called when PUT request is complete 	 
 */
function __getListingObjectAsArray(listingObject) {
	var array = [];
	for (var p in listingObject) {
		var lo = listingObject[p];
		if (lo.display) {
			array.push(lo.text);
		}
	}
	return array;
}

module.exports = SavedSearches;


/*******************************************************************
 * This is a collection of all of the fields we use on the website *
 *******************************************************************
	this.sold_price1 = null;
	this.sold_price2 = null;
	this.shortsale_review = null;
	this.area = null;
	this.quadrant = null;
	this.zoning = null;
	this.taxes1 = null;
	this.taxes2 = null;
	this.hoa_fee1 = null;
	this.hoa_fee2 = null;
	this.schoolelem = null;
	this.schoolother = null;
	this.schooldistrict = null;
	this.schooljunior = null;
	this.schoolprivate = null;
	this.deck1 = null;
	this.deck2 = null;
	this.patio1 = null;
	this.patio2 = null;
	this.dim_frontage1 = null;
	this.dim_frontage2 = null;
	this.dim_side1 = null;
	this.dim_side2 = null;
	this.dim_back1 = null;
	this.dim_back2 = null;
	this.dim_irregular = null;
	this.heating = null;
	this.aircon = null;
	this.basmnt_fin1 = null;
	this.basmnt_fin2 = null;
	this.basement = null;
	this.cap_parking1 = null;
	this.cap_parking2 = null;
	this.cap_carport1 = null;
	this.cap_carport2 = null;
	this.cap_garage1 = null;
	this.cap_garage2 = null;
	this.unitnbr1 = null;
	this.unitnbr2 = null;
	this.dir_post = null;
	this.coord_ew1 = null;
	this.coord_ew2 = null;
	this.coord_ns1 = null;
	this.coord_ns2 = null;
	this.subdivision = null;
	this.county_code = null;
	this.streettype = null;
	this.projectrestrict = null;
	this.tot_famroom1 = null;
	this.tot_famroom2 = null;
	this.tot_kitchen_k1 = null;
	this.tot_kitchen_k2 = null;
	this.tot_kitchen_b1 = null;
	this.tot_kitchen_b2 = null;
	this.tot_dining_f1 = null;
	this.tot_dining_f2 = null;
	this.tot_dining_s1 = null;
	this.tot_dining_s2 = null;
	this.tot_laundry1 = null;
	this.tot_laundry2 = null;
	this.tot_bathfull1 = null;
	this.tot_bathfull2 = null;
	this.tot_bathtq1 = null;
	this.tot_bathtq2 = null;
	this.tot_bathhalf1 = null;
	this.tot_bathhalf2 = null;
	this.tot_fireplace1 = null;
	this.tot_fireplace2 = null;
	this.lev1_sqf1 = null;
	this.lev1_sqf2 = null;
	this.lev1_bed1 = null;
	this.lev1_bed2 = null;
	this.lev1_bathfull1 = null;
	this.lev1_bathfull2 = null;
	this.lev1_bathtq1 = null;
	this.lev1_bathtq2 = null;
	this.lev1_bathhalf1 = null;
	this.lev1_bathhalf2 = null;
	this.lev1_fireplace1 = null;
	this.lev1_fireplace2 = null;
	this.lev1_famroom2 = null;
	this.lev1_famroom1 = null;
	this.lev1_kitchen_k1 = null;
	this.lev1_kitchen_k2 = null;
	this.lev1_kitchen_b1 = null;
	this.lev1_kitchen_b2 = null;
	this.lev1_dining_f1 = null;
	this.lev1_dining_f2 = null;
	this.lev1_dining_s1 = null;
	this.lev1_dining_s2 = null;
	this.lev1_laundry1 = null;
	this.lev1_laundry2 = null;
	this.tot_sqf_gla1 = null;
	this.tot_sqf_gla2 = null;
	this.master_bedroom = null;
	this.window = null;
	this.floor = null;
	this.driveway = null;
	this.water = null;
	this.utilities = null;
	this.lotfacts = null;
	this.amenities = null;
	this.garage = null;
	this.pool = null;
	this.features_int = null;
	this.inclusions = null;
	this.exclusions = null;
	this.features_ext = null;
	this.accessibility = null;
	this.publicremarks = null;
	this.agent = null;
	this.coagent = null;
	this.dvr = null;
	this.show = null;
	this.terms = null;
	this.sold_terms = null;
	this.sold_concessions1 = null;
	this.sold_concessions2 = null;
	this.sold_agent = null;
	this.sold_office = null;
	this.dt_offmarket1 = null;
	this.dt_offmarket2 = null;
	this.dt_withdraw1 = null;
	this.dt_withdraw2 = null;
	this.dt_sold1 = null;
	this.dt_sold2 = null;
	this.dt_expire1 = null;
	this.dt_expire2 = null;
	this.dt_reinstated1 = null;
	this.dt_reinstated2 = null;
	this.dt_list1 = null;
	this.dt_list2 = null;
	this.dt_contract1 = null;
	this.dt_contract2 = null;
	this.pud = null;
	this.days_back_status = null;
	this.taxid_clean = null;


// fills the object

  
 */