var util 	= require('lib/utilities');
var _		= util._;

/*********************
 * Key Board Options *
 *********************/
// Add de
var NUMERICKEYPAD_BUTTON_OPTIONS = {
	NUMERIC_WITH_COMMA : { 
		MAX_COL : 3, 
		//	{text/img :<string>, value :<string>, reverse:<bool> - default false }
		buttons : [{text:'1',value:'1'},{text:'2',value:'2'},{text:'3',value:'3'},{text:'4',value:'4'},{text:'5',value:'5'},{text:'6',value:'6'},{text:'7',value:'7'},{text:'8',value:'8'},{text:'9',value:'9'},{text:',',value:',', reverse:true},{text:'0',value:'0'},{text:'DEL',value:null, reverse:true}]
	}
};
// export the numeric key pad options
module.exports = NUMERICKEYPAD_BUTTON_OPTIONS;

/*************
 * Key Board *
 *************/
var _textArea; var _btns = [];
NumericKeypad = function(textArea, buttonOptions) {
	buttonOptions = buttonOptions ? buttonOptions : NUMERICKEYPAD_BUTTON_OPTIONS.NUMERIC_WITH_COMMA;
 	return initKeypad(textArea, buttonOptions);
}


function initKeypad(textArea, buttonOptions) {
	_textArea = textArea;
   	_textArea.addEventListener('focus', function() {
        _textArea.blur();
    });
    // main view
	var _keypadView = Ti.UI.createView({
    	bottom : (util.iPad ? '15dp' : 0),
    	left : '0dp',
    	width : '100%',
    	height : '50%', 
    	backgroundColor:'black'
    });
	// 
	var curRow = 0;
	var curCol = 0;
	
	var buttonHeightPct, buttonWidthPct;
	
	buttonOptions.MAX_ROW = buttonOptions.buttons.length / buttonOptions.MAX_COL;	
	
	var btnHeight = buttonOptions.MAX_COL / buttonOptions.buttons.length;
	var btnWidth = buttonOptions.MAX_ROW / buttonOptions.buttons.length;
	
	for (var a = 0; a < buttonOptions.buttons.length; a++) {
		if (curCol == buttonOptions.MAX_COL) {
			curCol = 0; curRow++;
		}
		
		var rowPos = (btnHeight * curRow) * 100; 
		var colPos = (btnWidth * curCol) * 100;
		
		rowPos += 1.0;

		var newHeight = (btnHeight * 100) - 0.75;
		var newWidth = (btnWidth * 100) - .66;

		
		
		var options = {
			top : rowPos.toString() + "%",
			left : colPos.toString() + "%",
			height : newHeight.toString() + '%',
			width : newWidth.toString() + '%'
		};
		
		
		var buttonValue = buttonOptions.buttons[a];
		buttonValue.textArea = _textArea;
		var button = createButton(buttonValue,options);
		
		_keypadView.add(button);
		curCol++;
	}
	
	
    this.hide = function() {
    	alert('Hide functionality has not been set yet!');
    };
    
    this.show = function() {
    	alert('Show functionality has not been set yet!');
    }
    
    return _keypadView;
}


function createButton(buttonOption, options) {
	var _defaultColors = {gradientDark:'#6d7682',gradientLight:'#4c5462',border:'#9298a2'};
	var _defaultSelectColors = { gradientDark:'#dee0e2',gradientLight:'#b3b7be' };
	
	buttonOption.reverse = buttonOption.reverse ? buttonOption.reverse : false;
	
	var oldValue = '';
	var newValue = '';
	
	
	var gradient = {
		type 			: 'linear',
		startPoint 		: {x:'0%',y:'0%'},
		endPoint 		: {x:'100%',y:'100%'},
		colors 			: [_defaultColors.gradientDark,_defaultColors.gradientLight]
	};
	
	var gradientSelected = {
		type 			: 'linear',
		startPoint 		: {x:'0%',y:'0%'},
		endPoint 		: {x:'100%',y:'100%'},
		colors 			: [_defaultSelectColors.gradientDark,_defaultSelectColors.gradientLight]
	};
	
	// 
	var _buttonView = Ti.UI.createView(options);
	_buttonView.id = buttonOption.value;
	_buttonView.backgroundGradient = !buttonOption.reverse ? gradient : gradientSelected;

	// add onclick events
	_buttonView.addEventListener("touchstart", function(e) {
		var view = _buttonView;
		view.backgroundGradient = !buttonOption.reverse ? gradientSelected : gradient;
		oldValue = buttonOption.textArea.value;
		if (view.id == null) {
			if (buttonOption.textArea.value.length == 0) { return; }
			buttonOption.textArea.value = buttonOption.textArea.value.substring(0, buttonOption.textArea.value.length -1);
		}
		else {
			if (buttonOption.textArea.value.length == 0 && buttonOption.value == ",") { return; }
			buttonOption.textArea.value += buttonOption.value;
		}
	});
	
	_buttonView.addEventListener("touchend", function(e) {
		var view = e.source;
		_buttonView.backgroundGradient = !buttonOption.reverse ? gradient : gradientSelected;
		if (buttonOption.textArea.value != oldValue) {
			_buttonView.fireEvent('valueChanged', {oldValue : oldValue, newValue : buttonOption.textArea.value});
		}
	});
	
	if (buttonOption.text) {
		var _labelView = Ti.UI.createLabel({
			
			backgroundColor		: 'transparent',
			font 				: { fontSize:'25%',fontFamily:'Helvetica Neue' },
			text 				:  buttonOption.text,
			focusable			: false,
			width 				: '100%',
			highlightedColor 	: 'transparent',
			color 				: !buttonOption.reverse ? 'white' : '#6d7682',
			shadowColor 		: buttonOption.reverse ? 'white' : '#6d7682',
			shadowOffset		: {x:1,y:1}	,
			textAlign			: Ti.UI.TEXT_ALIGNMENT_CENTER	
		});
		
		
	
		_buttonView.add(_labelView);	
	}
	
	if (buttonOption.img) {
		var _imageView = Ti.UI.createImageView({
			image : buttonOption.img
		});
		_buttonView.add(_imageView);
	}
	
	return _buttonView;
	 
}



module.exports = NumericKeypad;