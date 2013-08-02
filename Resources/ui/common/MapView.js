function MapView(){
	var mountainView = Titanium.Map.createAnnotation({
	    latitude:37.390749,
	    longitude:-122.081651,
	    title:"Appcelerator Headquarters",
	    subtitle:'Mountain View, CA',
	    pincolor:Titanium.Map.ANNOTATION_RED,
	    animate:true,
	    leftButton: '../images/appcelerator_small.png',
	    myid:1 // Custom property to uniquely identify this annotation.
	});
	
	var mapView = Titanium.Map.createView({
	    mapType: Titanium.Map.STANDARD_TYPE,
	    region: {latitude:33.74511, longitude:-84.38993, 
	            latitudeDelta:0.01, longitudeDelta:0.01},
	    animate:true,
	    regionFit:true,
	    userLocation:true,
	    annotations:[mountainView]
	});
	// Handle click events on any annotations on this map.
	mapView.addEventListener('click', function(evt) {
	
	    Ti.API.info("Annotation " + evt.title + " clicked, id: " + evt.annotation.myid);
	
	    // Check for all of the possible names that clicksouce
	    // can report for the left button/view.
	    if (evt.clicksource == 'leftButton' || evt.clicksource == 'leftPane' ||
	        evt.clicksource == 'leftView') {
	        Ti.API.info("Annotation " + evt.title + ", left button clicked.");
	    }
	});
	return mapView;
}

module.exports = MapView;
