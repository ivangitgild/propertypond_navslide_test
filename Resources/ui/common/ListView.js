function ListView(){
	var listView = Ti.UI.createView();
	var mL = Ti.UI.createLabel({
		text : 'List View'
	});
	listView.add(mL);
	
	return listView;
}

module.exports = ListView;
