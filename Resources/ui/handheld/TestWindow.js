var _ = require('lib/underscore');
var ppmoreinfo = require('lib/ppmoreinfo')
function TestWindow(){
	var self = Ti.UI.createWindow({
		backgroundColor : 'white',
		navBarHidden : true,
		exitOnClose : true
	});
	
	var temp = 0;
	
	
	var slider = require('lib/slider').createSlider();
	
	var tableData = [];
	
	var logoView = Ti.UI.createView({
        top: '24dp',
        height: '70dp',
        width: '121dp',
        left : ((Ti.Platform.displayCaps.platformWidth * 0.84) / 2) - (121/2),
        backgroundImage: "/images/logo-lrg.png"
    });
   
	var homeRow = Ti.UI.createTableViewRow({
		title : 'Home',
	});
	tableData.push(homeRow);
	
	var ppSection = Ti.UI.createTableViewSection({
		headerTitle:'Your Propertypond'
	});
	ppSection.add(Ti.UI.createTableViewRow({
		title : 'Account',
		font : { fontSize : 13 }
	}));
	ppSection.add(Ti.UI.createTableViewRow({
		title : 'My Favorites',
		font : { fontSize : 13 }
	}));
	tableData.push(ppSection);
	
	var discoverSection = Ti.UI.createTableViewSection({
		headerTitle : 'Discover'
	});
	discoverSection.add(Ti.UI.createTableViewRow({
		title : 'Search Rentals',
		font : { fontSize : 13 }
	}));
	tableData.push(discoverSection);
	
	var informationSection = Ti.UI.createTableViewSection({
		headerTitle : 'Information'
	});
	var count = ppmoreinfo.length;
	for (var index = 0; index < count; index++) {
		
		informationSection.add(Ti.UI.createTableViewRow({
			title : ppmoreinfo[index].title,
			font : { fontSize : 13 }
		}));
        // tableData.push({
			// title : ppmoreinfo[index].title
		// });
   }
   	slider.addWindow({
		createFunction : function(){
			var mapWin = Ti.UI.createWindow({
				backgroundColor : 'black',
				title : 'Propertypond'
			});
			if (Ti.Platform.osname == 'android') {
				
			}else{
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
				
				var mapview = Titanium.Map.createView({
				    mapType: Titanium.Map.STANDARD_TYPE,
				    region: {latitude:33.74511, longitude:-84.38993, 
				            latitudeDelta:0.01, longitudeDelta:0.01},
				    animate:true,
				    regionFit:true,
				    userLocation:true,
				    annotations:[mountainView]
				});
				
				mapWin.add(mapview);
				// Handle click events on any annotations on this map.
				mapview.addEventListener('click', function(evt) {
				
				    Ti.API.info("Annotation " + evt.title + " clicked, id: " + evt.annotation.myid);
				
				    // Check for all of the possible names that clicksouce
				    // can report for the left button/view.
				    if (evt.clicksource == 'leftButton' || evt.clicksource == 'leftPane' ||
				        evt.clicksource == 'leftView') {
				        Ti.API.info("Annotation " + evt.title + ", left button clicked.");
				    }
				});
			}
			return mapWin;
		},
		rightNavButton : function(){
			var filterButton =  Titanium.UI.createButton({
		        title: 'Filter'
		    });
		    filterButton.addEventListener('click',function(){
		    	alert('For Filter');
		    });
			
			return filterButton;
		}
	});
   	tableData.push(informationSection);
	
	slider.preLoadWindow(0);
	
	var table = Ti.UI.createTableView({
		rowHeight : '44dp',
		top : 100
	});
	
	discoverSection.addEventListener('click', function(){
		slider.addWindow({
				createFunction : function(){
				var mWin = Ti.UI.createWindow({
					backgroundColor : 'white'
				
				});
				var mView = Ti.UI.createView();
				var mLabel = Ti.UI.createLabel({
					text : 'HEHEHEHE'
				});
				mView.add(mLabel);
				mWin.add(mView);
				
				return mWin;
			},
			rightNavButton : function(){
				var searchButton =  Titanium.UI.createButton({
			        title: 'View Results'
			    });
			    searchButton.addEventListener('click',function(){
			    	alert('THANK YOU');
			    });
				
				return searchButton;
			}
		});
		slider.selectAndClose(1);
	});
	
	informationSection.addEventListener('click', function(e) {
		Ti.API.debug('table heard click');
		//slider.selectAndClose(e.index);
		//slider.showNewWindow().open();
		console.log(e.index);
		var InformationDetailWindow = require('ui/handheld/InformationDetailWindow');
		var infoWindow = new InformationDetailWindow({
			title : ppmoreinfo[e.index - 4].title,
			content : ppmoreinfo[e.index - 4].content
		}).open();
	});
	
	table.setData(tableData);
	
	table.addEventListener('click', function(e){
		if (e.index == 0) {
			slider.selectAndClose(0);
		} else 
			return;
	});
	
	logoView.addEventListener('click',function(){
		slider.selectAndClose(0);
	});
	
	self.add(logoView);
	self.add(table);
	self.add(slider);
	
	var started = false;

	self.addEventListener('open', function() {
		/* Wierd - open event on baseWindow gets fired
		 every time slider fires event 'open'. Using
		 started variabled to make sure this only gets
		 run once */
		if (!started) {
			slider.showWindow(0);
			started = true;
		}
	
	});
	
	function listenForBackButton() {
		slider.back();
	}
	
	slider.addEventListener('open', function() {
		Ti.API.debug('baseWindow heard open');
		self.removeEventListener('android:back', listenForBackButton);
	});
	
	slider.addEventListener('close', function() {
		Ti.API.debug('baseWindow heard close');
		self.addEventListener('android:back', listenForBackButton);
	});
	return self;
}

module.exports = TestWindow;