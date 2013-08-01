function NavSlide() {
	var self = Ti.UI.createView({
		backgroundColor : '#4fa7ea'
	});
	
	var slideButton = Ti.UI.createButton({
		width: '50px',
		height: '50px',
		backgroundColor : '#000000',
		left : null
	});
	
	slideButton.addEventListener('click', function(){
		
	});
	
	self.add(slideButton);
	
};

module.exports = NavSlide;
