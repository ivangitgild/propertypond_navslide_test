/*
 * This row layout widget is used for lists of results, such as in the Information window.
 * 
 * @param string text The text to be shown in the row.
 * @param string image The optional image to be shown left of the text.
 */

function ResultsRow(params) {
    var self = Ti.UI.createTableViewRow({
        className:'results-row', // used to improve table performance
        selectedBackgroundColor: 'white',
        hasChild: true,
        height: '50dp'
    });

    // Optional image
    if (params.image) {
        var rowImage = Ti.UI.createImageView({
            image: params.image,
            preventDefaultImage: true,
            left: '10dp',
            width: '35dp',
            height: '35dp',
            borderColor: 'Gray',
            borderWidth: '1dp'
        });
        self.add(rowImage);
    }

    // Label
    var rowLabel = Ti.UI.createLabel({
        color: '#000',
        font: {
            fontFamily: 'Arial', 
            fontSize: (Ti.Platform.name === 'android') ? 20 : 18, 
            fontWeight: 'bold'
        },
        text: params.text,
        left: params.image ? '50dp' : '10dp'
    });
    self.add(rowLabel);

    return self;
}

module.exports = ResultsRow;
