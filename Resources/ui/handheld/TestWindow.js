var _ = require('lib/underscore');
var config = require('lib/config')
var ppmoreinfo = require('lib/ppmoreinfo')
var LoginWindow = require('ui/handheld/LoginWindow');
var SignupWindow = require('ui/handheld/SignupWindow');
function TestWindow(){
	
	var self = Ti.UI.createWindow({
		backgroundColor : 'white',
		navBarHidden : true,
		exitOnClose : true
	});
	
	var temp = 0;
	var slider = null;
	var table = null;
	var logoView = null;
	
	var isReloaded = false;
	
	var createTheSlider = function(){
		var role = Ti.App.Properties.getString('role');
	
		slider = require('lib/slider').createSlider();
		
		var tableData = [];
		
		logoView = Ti.UI.createView({
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
		if (role == 'member') {
			var account = Ti.UI.createTableViewRow({
				title : 'Account',
				font : { fontSize : 13 }
			});
			account.addEventListener('click',function(){
				var AccountWindow = require('ui/handheld/AccountWindow');
				new AccountWindow().open({ modal : true });
			});
			ppSection.add(account);
			ppSection.add(Ti.UI.createTableViewRow({
				title : 'My Favorites',
				font : { fontSize : 13 }
			}));
		} else {
			var loginWindow = LoginWindow();
	    	var signupWindow = SignupWindow();
	    	
			var login = Ti.UI.createTableViewRow({
				title : 'Login',
				font : { fontSize : 13 }
			});
			var signup = Ti.UI.createTableViewRow({
				title : 'Create Account',
				font : { fontSize : 13 }
			});
			
			ppSection.add(login);
			ppSection.add(signup);
			
			login.addEventListener('click', function(){
				loginWindow.open({ modal : true });
			});
			
			signup.addEventListener('click', function(){
				signupWindow.open({ modal : true });
			});
		}
		
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
	   	var MapView = require('ui/common/MapView');
		var ListView = require('ui/common/ListView');
		var mapView = MapView();
		var listView = ListView();
		var isListView = false;
		var mainWin = null;
		
	   	slider.addWindow({
			createFunction : function(){
				mainWin = Ti.UI.createWindow({
					backgroundColor : 'white',
				});
				
				if (Ti.Platform.osname == 'android') {
					var aL = Ti.UI.createLabel({
						text : 'Map View for Android Here'
					});
					mainWin.add(aL);
					var ButtonBarView = require('ui/widgets/ButtonBarView');
					var bbv = new ButtonBarView({
						labels : ['Map','List'],
						width : 100,
						top : 0
					});
					bbv.addEventListener('bbvClick', function(e){
						if (e.index == 1) {
							mainWin.remove(mapView);
							mainWin.add(listView);
						} else {
							mainWin.remove(listView);
							mainWin.add(mapView);
						}
					});
					mainWin.add(bbv);
				}else{

					if (isListView) {
						mainWin.add(listView);
					}else{
						mainWin.add(mapView);
					}

					var ButtonBarView = require('ui/widgets/ButtonBarView');
					var bbv = new ButtonBarView({
						labels : ['Map','List'],
						width : 100,
						top : 0
					});
					bbv.addEventListener('bbvClick', function(e){
						if (e.index == 1) {
							mainWin.remove(mapView);
							mainWin.add(listView);
						} else {
							mainWin.remove(listView);
							mainWin.add(mapView);
						}
					});
					mainWin.setTitleControl(bbv);
				}
				return mainWin;
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

		
		table = Ti.UI.createTableView({
			rowHeight : '44dp',
			top : 100
		});
		
		var SearchWindow = require('ui/handheld/SearchWindow');
		discoverSection.addEventListener('click', function(e){
			slider.addWindow({
					createFunction : function(){
						return SearchWindow()
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
			
			var InformationDetailWindow = require('ui/handheld/InformationDetailWindow');
			var infoWindow = new InformationDetailWindow({
				title : ppmoreinfo[e.index - table.data.length].title,
				content : ppmoreinfo[e.index - table.data.length].content
			}).open();
		});
		
		table.setData(tableData);
		
		table.addEventListener('click', function(e){
			if (e.index == 0) {
				slider.selectAndClose(0);
			} else 
				return;
		});
		
		
		homeRow.addEventListener('click',function(){
			console.log('test');
			slider.selectAndClose(0);
		});
		
		if (isReloaded) {
			setTimeout(function(){
				homeRow.fireEvent('click');
				isReloaded = false;
			}, 2000);
		}
		
		logoView.addEventListener('click',function(){
			slider.selectAndClose(0);
		});
		
		slider.preLoadWindow(0);
		
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
				//slider.showWindow(0);
				slider.selectAndClose(0);
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
	};
	
	var removeTheSlider = function(){
		//var r = require('lib/slider').removeSlider();
		self.remove(slider);
		self.remove(table);
		self.remove(logoView);
		//slider = null;
		//table = null;
		//logoView = null;
	};
	
	Ti.App.addEventListener('reloadHomeView', function(e) {
		isReloaded = true;
		removeTheSlider();
		createTheSlider();
		//slider.preLoadWindow(0);
		//slider.selectAndClose(0);
		return self.open();
    });
    
    createTheSlider();
    
	return self;
}

module.exports = TestWindow;