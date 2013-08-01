var Rating = require('models/Rating');
var _ 		= require('lib/underscore');

var defaultRating;
var _rating;



var IMAGES = {
	SELECTED : '/images/graphics/rating/star_selected',
	UNSELECTED : '/images/graphics/rating/star_unselected',
	SUFFIX : '_50.png'
};

var DEFAULTS = {
	IMG_WIDTH : 45,
	IMG_HEIGHT : 45,
	MARGIN : 15
};

/**
 * 
 * @param {Object} ratingOptions
 * 	var ratingOptions = {
		rating : null,
		readonly : false,
		size : 1.0
	};
 */
function RatingView(ratingOptions) {
	if (_.isUndefined(ratingOptions.rating)) {
		alert('RatingOptions must have Rating : {rating.js}, readonly : {boolean}, size : {float} 1.0 == 100% ');
	}
	var rating = ratingOptions.rating;

	ratingOptions.readonly = ratingOptions.readonly === undefined ? false : ratingOptions.readonly;
	ratingOptions.size = ratingOptions.size === undefined ? 1.0 : ratingOptions.size;
	
	
	
	_rating = rating;
	defaultRating = rating.rating;

	this.IMG_WIDTH = DEFAULTS.IMG_WIDTH * ratingOptions.size;
	this.IMG_MARGIN = DEFAULTS.MARGIN * ratingOptions.size;
	this.readonly = ratingOptions.readonly;
	this.size = ratingOptions.size;
	this.viewWidth = (this.IMG_WIDTH + this.IMG_MARGIN) * 5;
	this.viewHeight = this.IMG_WIDTH + this.IMG_MARGIN +  (this.readonly === false ? 60 : 0);
	this.rating = rating;

	if (this.readonly === false && this.viewWidth < 200) {
		this.viewWidth = '80%';
	} else {
		this.viewWidth = this.viewWidth.toString()+'dp';
	}
	
	this.view = Ti.UI.createView({
      	width : this.viewWidth.toString(),
//      height :this.viewHeight.toString()+'dp',
        height: Ti.UI.SIZE,
		backgroundColor : 'transparent'
	});

	if (this.IMG_WIDTH > 50) {
		IMAGES.SUFFIX = '_100.png';
	}
	__loadRatingView(this);
	
}

function removeChildren(view) {
	var children = view.children.slice(0);
	var numChildren = children.length;
	for (i = 0; i < numChildren; i++) {
		view.remove(children[i]);
	}
}

function __loadRatingView(ratingView) {
    
	removeChildren(ratingView.view);
	if (ratingView.rating.rating != undefined) {
		if (ratingView.rating.rating === -1 && ratingView.readonly === false) {
			// 
			var addToFavoritesBtn = Ti.UI.createImageView({
					left : '38dp',
					width : '150dp',
					height : '38dp',
					image : '/images/buttons/btn_AddToFavorites.png',
					top : '10dp'
			});
			addToFavoritesBtn.addEventListener("click", function(e) {
				Rating.createFavorite(ratingView.rating.listno, function(data) {
				    ratingView.view.fireEvent('ratingChanged', {});
					ratingView.rating.rating_id = data.id;
					ratingView.rating.rating = 0;
					__loadRatingView(ratingView);
				});
			});

			ratingView.view.add(addToFavoritesBtn);
			return;
		}	
	} else {
		var rating = ratingView.rating;
		ratingView.rating = {
			rating_id : -1,
			
			rating : rating
		};
	}
	
	
	var x = ratingView.viewWidth === '80%' ? 40 : 5;
	for (var a = 0; a < 5; a++) {
			var starObj = {
				index : a
			};
			
			var imageName = (a + 1 <= ratingView.rating.rating ? 
				IMAGES.SELECTED :  IMAGES.UNSELECTED) + IMAGES.SUFFIX; 
			starObj.imageName = imageName;
			
			// create image view
			var starImage = Ti.UI.createImageView({
				left : x.toString()+'dp',
				width : ratingView.IMG_WIDTH.toString()+'dp',
				height : ratingView.IMG_WIDTH.toString()+'dp',
				image : imageName,
				top : 0
			});
			
            if (ratingView.readonly == false) {
                // add onclick
                setImageClick(starImage,ratingView,a);
            }
			
			// add image to view
			ratingView.view.add(starImage);
			x += ratingView.IMG_WIDTH + ratingView.IMG_MARGIN;
    }
    
	if (ratingView.readonly == false) {
		var removeBtn = Ti.UI.createImageView({
				left : '38dp',
				width : '150dp',
				height : '38dp',
				image : '/images/buttons/btn_RemoveFromFavorites.png',
				top : '45dp'
		});
		
		removeBtn.addEventListener("click", function(e) {
			var alert = Ti.UI.createAlertDialog({
				cancel : 1, // Index of cancel button
				buttonNames : ['Yes', 'No'], // Button names
				message : 'Are you sure you want to remove this from your favorites? ',
				title : 'Favorites'
			});
			
			// Add delegate for Click Event
			alert.addEventListener('click', function(e){
				// Get Index of Alert Button
				var index = e.index;
				if (index == 1) {
					return;	
				}
				
				var cb = function(data) {
					if (data.success) {
					    ratingView.view.fireEvent('ratingChanged', {});
						ratingView.rating.rating_id 	= -1;
						ratingView.rating.rating 		= -1;
					}
					__loadRatingView(ratingView);
				};
				
				var client_id =  Ti.App.Properties.getString('agent_id');
				
				Rating.remove({
					listno : ratingView.rating.listno,
					client_id :client_id
				}, cb);	
				
			});
			
			// Show the alert
			alert.show();
		});
		ratingView.view.add(removeBtn);
	}
}

function setImageClick(starImage, ratingView, index) {
	starImage.addEventListener("click", function(e) {
		if (ratingView.rating.rating != index + 1) {
			ratingView.rating.rating = index+1;
			__loadRatingView(ratingView);
			
			var alertDial = Ti.UI.createAlertDialog({
				cancel : 1, // Index of cancel button
				buttonNames : ['Yes', 'No'], // Button names
				message : 'Do you want to update the rating for this listing? ',
				title : 'Favorites'
			});
			
			// Add delegate for Click Event
			alertDial.addEventListener('click', function(e){
				// Get Index of Alert Button
				var index = e.index;
				if (index == 1) {
					ratingView.rating.rating = defaultRating;
					__loadRatingView(ratingView);
					return;	
				}
				
				Rating.update(ratingView.rating, function(data) {
					if (data.success) {
					    defaultRating = ratingView.rating.rating;
					    ratingView.view.fireEvent('ratingChanged', {});
						return;
					} else {
						Ti.API.error(data.message);
					}
					
				});
				
			});
			
			// Show the alert
			alertDial.show();
		}
	});		
}

module.exports = RatingView;
