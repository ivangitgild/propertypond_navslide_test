

function Toolbar(options) {
	// check and load defaults
	var _backgroundGradient = options.backgroundGradient ? options.backgroundGradient : 
	{
		type : 'linear',
		startPoint : {x:'0%',y:'0%'},
		endPoint : {x:'0%',y:'100%'},
		colors : ['a5dcf7','#1d6ba3']
	};
	
	var self = Ti.UI.createView({
		width : '100%',
		height : '40px',
		backgroundGradient : _backgroundGradient,
	});
	
	return self;
}
