var _ = require('lib/underscore');

function Accordion(options, data) {

    var defaultoptions = {
        top: 10,
        left: 0,
        right: 0,
        bottom: 10,
        sectionBackgroundColor: '#FFFFFF',
        sectionBorderColor: '#CCCCCC',
        titleHeight: (Ti.Platform.name === 'android') ? 60 : 40,
        titleColor: '#3388FF',
        titleFontSize: (Ti.Platform.name === 'android') ? '16dp' : '14dp',
        titleFontWeight: 'bold',
        contentColor: '#222222',
        contentFontSize: (Ti.Platform.name === 'android') ? '15dp' : '13dp',
        contentFontWeight: 'normal'
    };
    options = _.extend({}, defaultoptions, options);
    
    var self = Ti.UI.createView({
        top: options.top,
        left: options.left,
        right: options.right,
        bottom: options.right,
        height: Ti.UI.SIZE,
        layout: 'vertical'
    });
    
    console.log("########### 1");
    console.log(JSON.stringify(data));
    
    var contentContainers = new Array();
    var sectionsCount = data.length;
    for (var index1 = 0; index1 < sectionsCount; index1++) {
        
        var sectionContainer = Ti.UI.createView({
            width: '100%',
            height: options.titleHeight,
            backgroundColor: options.sectionBackgroundColor,
            borderColor: options.sectionBorderColor,
            borderWidth: 1,
            borderRadius: 5,
            layout: 'vertical',
            bottom: 10
        });
               
        var titleContainer = Ti.UI.createView({
            width: '100%',
            height: options.titleHeight,
            _id: index1 // custom property
        });
        
        var title = Ti.UI.createLabel({
            left: 10,
            width: Ti.UI.SIZE,
            font: {fontSize: options.titleFontSize, fontWeight: options.titleFontWeight},
            color: options.titleColor,
            text: data[index1].title,
            _type: 'label' // custom property
        })
        
        var image = Ti.UI.createImageView({
            top: parseInt((options.titleHeight - 16) / 2), // 16 = image's height
            width: 'auto',
            right: 3,
            image: '/images/accordion_closed.png',
            _type: 'image' // custom property
        })
         
        titleContainer.add(title);
        titleContainer.add(image);
        titleContainer.image = image;
        
        titleContainer.addEventListener('touchstart', function(e) {
            var object = e.source;
            if (e.source._type === 'label' || e.source._type === 'image') {
                object = e.source.parent;
            }
            var id = parseInt(object._id);
            if (contentContainers[id].visible) {
                contentContainers[parseInt(object._id)].visible = false;
                object.parent.height = options.titleHeight;
                object.image.image = '/images/accordion_closed.png';
            } else {
                contentContainers[parseInt(object._id)].visible = true;
                object.parent.height = Ti.UI.SIZE;
                object.image.image = '/images/accordion_opened.png';
            }
        });
        
        contentContainers[index1] = Ti.UI.createView({
            bottom: 8,
            width: '100%',
            height: Ti.UI.SIZE,
            layout: 'vertical',
            visible: false
        });
       
        var itemsCount = data[index1].items.length;
        for (var index2 = 0; index2 < itemsCount; index2++) {
            
            contentContainers[index1].add(
                Ti.UI.createLabel({
                    left: 10,
                    font: {fontSize: options.contentFontSize, fontWeight: options.contentFontWeight},
                    color: options.contentColor,
                    text: data[index1].items[index2]
                })
            );
            
        }
       
        sectionContainer.add(titleContainer);
        sectionContainer.add(contentContainers[index1]);
        self.add(sectionContainer);
        
    }
    
    return self;
}

module.exports = Accordion;