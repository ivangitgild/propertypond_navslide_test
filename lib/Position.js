
function Position() {
	var _PPI, _SCALE;
	// Constants
	this.DENSITY 			= Ti.Platform.displayCaps.density;
	this.DPI 				= Ti.Platform.displayCaps.dpi;
	this.XDPI 				= Ti.Platform.displayCaps.xdpi;
	this.YDPI 				= Ti.Platform.displayCaps.ydpi;
	this.DENSITY_FACTOR 	= Ti.Platform.displayCaps.logicalDensityFactor;
	this.SCREEN_WIDTH_PX	= Ti.Platform.displayCaps.platformWidth;
	this.SCREEN_HEIGHT_PX 	= Ti.Platform.displayCaps.platformHeight;
	this.SCREEN_WIDTH_DP 	= null; // calculated below
	this.SCREEN_HEIGHT_DP	= null;	// calculated below
	
	/************
	 * PRIVATES *
	 ************/
	var self; // private
	switch (this.DENSITY) {
		case "extra high" : 
			this.SCALE 	= 2.0;
			this.PPI 	= 320; 
		break;
		case "high" : 
			this.SCALE 	= 1.5; 
			this.PPI 	= 240;
		break;
		case "low" : 
			this.SCALE 	= 0.75; 
			this.PPI	= 120;
		break;
		case "medium" : 
		default : 		
			this.SCALE 	= 1.0; 
			this.PPI	= 160;
		break;
	}

	/**
	 * Private method which performs the action
	 */
	this.__centerView = function(view, parentViewWidth) {
		var viewWidth = view.toImage().width;		
		var x = (parentViewWidth / 2) - (viewWidth / 2);
		view.__centerloaded = true;	
		view.setLeft(x);
	}
	
	/**
	 * centers a view
	 * @param {TiUIView} view
	 */
	this.centerViewHorizontal = function(view) {
		view.__centerloaded = false;
		view.addEventListener('postlayout', function(e) {
			var v = e.source;
			if (v.__centerloaded === false) {
				var parent = view.getParent();
				var parentWidth = self.SCREEN_WIDTH_DP;
				if (parent) {
					if (parent.width) {
						parentWidth = parent.width;
					}  
					if (parent.rect) {
						parentWidth = parent.rect.width;
					} 
				}
				v.__centerloaded = true;
				self.__centerView(v, parentWidth);	
			}
			
		});
	};

	/**************
	 * CONVERSION *
	 **************/
	
	/**
	 * Converts Pixel to Density-Pixel
	 * @param {integer} px
	 */
	this.convertPxToDp = function(px) {
		return (px / (this.DPI / this.PPI));
	};
	
	/**
	 * Converts Density-Pixel to Pixel
	 * @param {integer} dp
	 */
	this.convertDpToPx = function(dp) {
		return (dp * (this.DPI / this.PPI));
	};
	
	/************************
	 * CALCULATED VARIABLES *
	 ************************/
	this.SCREEN_WIDTH_DP 	= this.convertPxToDp(this.SCREEN_WIDTH_PX);
	this.SCREEN_HEIGHT_DP 	= this.convertPxToDp(this.SCREEN_HEIGHT_PX);

	self = this;	
};

var position = new Position();
module.exports = position;
