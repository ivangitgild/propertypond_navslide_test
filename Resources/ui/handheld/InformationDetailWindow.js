var InformationDetailContent = require('ui/common/InformationDetailContent');

function InformationDetailWindow(params) {
    var self = Ti.UI.createWindow({
        barImage: '/images/navBar.png',
        barColor: '#4f90d9',
        backgroundColor:'#e6e7e8',
        layout: 'vertical',
        title: params.title,
        navBarHidden: false,
        modal : true,
        orientationModes: [Ti.UI.PORTRAIT],
        backButtonTitle: 'Back'
    });
    
    // Add the information detail content.
    var informationDetailContent = InformationDetailContent(params);
    self.add(informationDetailContent);
    
    var back = Ti.UI.createButton({
	    title: "Back",
	    width:'50dp',
        height:'40dp'
	});
	back.addEventListener("click", function() {
	    self.close();
	});
	self.setLeftNavButton(back);
    
    return self;
}

module.exports = InformationDetailWindow;