function SearchWindow(){
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
}

module.exports = SearchWindow;
