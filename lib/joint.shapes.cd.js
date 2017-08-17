joint.shapes.cd = {};

// Constants
const ATTR_HEIGHT = 20;
const ATTR_WIDTH  = 200;

// Class Diagram
// -------------

// Attribute
joint.shapes.cd.Attribute = joint.shapes.basic.Generic.extend({

    markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="cd-attribute-rect"/>',
    '</g>',
    '<text class="cd-attribute-text"/>',
    '</g>'
    ].join(''),

    defaults: _.defaultsDeep({

        type: 'cd.Attribute',

        attrs: {

            rect: {
                fill: '#FF7D4D',
                stroke: 'none',
                'width': ATTR_WIDTH,
                'height': ATTR_HEIGHT,
            },
            'text': {
                fill: '#000000',
                text: 'MyAttribute',
                'font-size': 12,
                'ref-x': 5,
                'ref-y': 5,
                'font-family': 'Helvetica, sans-serif'
            }
        },

        name: [],
        type: [],

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:type', function() {
            this.updateRectangle();
            this.trigger('cd-update');
        }, this);

        this.updateRectangle();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    getAttributeName: function() {
        return this.get('name');
    },

    getAttributeType: function() {
        return this.get('type');
    },

    updateRectangle: function() {
        var attrs = this.get('attrs');
        attrs['text'].text = this.getAttributeName() + ' : ' + this.getAttributeType();
    }
});

joint.shapes.cd.AttributeView = joint.dia.ElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.model, 'cd-update', function() {
            this.update();
            this.resize();
        });
    },
});

// Class
joint.shapes.cd.Class = joint.shapes.tm.toolElement.extend({

    markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="cd-class-name-rect"/><rect class="cd-class-attrs-rect"/>',
    '</g>',
    '<text class="cd-class-name-text"/><text class="cd-class-attrs-text"/>',
    '</g>'
    ].join(''),

    defaults: _.defaultsDeep({

        type: 'cd.Class',

        attrs: {
            //rect: { 'width': 200 },

            '.cd-class-name-rect': { 'width':200, 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#FF6434' },
            '.cd-class-attrs-rect': { 'width':200, 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#FF7D4D' },

            '.cd-class-name-text': {
                'ref': '.cd-class-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },
            '.cd-class-attrs-text': {
                'ref': '.cd-class-attrs-rect', 'ref-y': 0.5, 'ref-x': 5, 'y-alignment': 'middle',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },
        },

        name: [],
        // attributes: [], --> useless now
        references: [],

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:attributes change:references', function() {
            this.updateRectangles();
            this.trigger('cd-update');
        }, this);

        this.updateRectangles();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    getClassName: function() {
        return this.get('name');
    },

    getClassAttributes: function() {
        return this.get('attributes');
    },

    getClassReferences: function() {
        return this.get('references');
    },

    updateRectangles: function() {

        // --> Old func :

        // var rects = [
        // { type: 'name', text: this.getClassName() },
        // { type: 'attrs', text: this.get('attributes') },
        // //{ type: 'attrs', text: this.get('references') },
        // ];

        // var offsetY = 0;

        // _.each(rects, function(rect) {

        //     var lines = _.isArray(rect.text) ? rect.text : [rect.text];
        //     console.log('lines : ' + lines);
        //     var rectHeight = lines.length * 20 + 20;
        //     // console.log('lines length : ' + lines.length);

        //     attrs['.cd-class-' + rect.type + '-text'].text = lines.join('\n');
        //     attrs['.cd-class-' + rect.type + '-rect'].height = rectHeight;
        //     attrs['.cd-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

        //     offsetY += rectHeight;
        // });

        // ------------------------

        var attrs = this.get('attrs');

        // Class name rendering :
        var className = this.getClassName();
        var offsetY = 0;
        var lines = _.isArray(className) ? className : [className];
        var nameRectHeight = lines.length * 20 + 20;

        attrs['.cd-class-name-text'].text = lines.join('\n');
        attrs['.cd-class-name-rect'].height = nameRectHeight;
        attrs['.cd-class-name-rect'].transform = 'translate(0,' + offsetY + ')';
        
        offsetY += nameRectHeight;

        // Attributes rendering
        var classAttributes = this.getEmbeddedCells();
        var attrRectHeight = classAttributes.length * 20 + 20;   // New size of the class
        var model = this;

        if (!(!Array.isArray(classAttributes) || !classAttributes.length)) { // array does not exist, is not an array, or is empty
            
            console.log(classAttributes);
            _.each(classAttributes, function (attr, i) {
                var x = model.get('position').x;
                var y = (model.get('position').y + nameRectHeight + attrRectHeight - ATTR_HEIGHT * (i+1) + 10);
                attr.position(x, y);
            });
        }

        attrs['.cd-class-attrs-rect'].height = attrRectHeight;
        attrs['.cd-class-attrs-rect'].transform = 'translate(0,' + offsetY + ')';
    },

    addAttribute: function (aName = 'MyAttribute', aType = 'MyType') { 
        var attr = new cd.Attribute({
            position: {
                x: 0, 
                y: 0,
            }, 
            size: { 
                width: ATTR_WIDTH, height: ATTR_HEIGHT
            },
            name: aName,
            type: aType,
        })

        this.embed(attr);               // Attach it to the class
        graph.addCell(attr);            // Add to the graph
        attr.position(0, 0);            // Set a random position (will be modified later)
        this.trigger('cd-update');      
        this.updateRectangles();        // Refresh the view
    },
});

joint.shapes.cd.ClassView = joint.shapes.tm.ToolElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.model, 'cd-update', function() {
            this.update();
            this.resize();
        });
    },

    // Change name of the class
    // pointerclick: function (view, evt, x, y){
    //     // Because of scope :
    //     const myModel = this.model;

    //     // prompt for new label and change your label 
    //     $.confirm({
    //         title: 'Enter the new name of the class',
    //         useBootstrap: false,
    //         type: 'red',
    //         closeIcon: true,
    //         boxWidth: '25%',
    //         animation: 'top',
    //         content: '' +
    //         '<form action="" class="formName">' +
    //         '<div class="form-group">' +
    //         '<input type="text" placeholder="Class name" class="name form-control" required />' +
    //         '</div>' +
    //         '</form>',
    //         buttons: {
    //             formSubmit: {
    //                 text: 'Submit',
    //                 btnClass: 'btn-red',
    //                 action: function () {
    //                     var name = this.$content.find('.name').val();
    //                     if(!name){
    //                         $.alert('provide a valid name');
    //                         return false;
    //                     }
    //                     myModel.attributes.name = name;
    //                     myModel.updateRectangles();
    //                     myModel.trigger('cd-update');
    //                 }
    //             },
    //             cancel: function () {
    //                 //close
    //             },
    //         },
    //         onContentReady: function () {
    //             // bind to events
    //             var jc = this;
    //             this.$content.find('form').on('submit', function (e) {
    //                 // if the user submits the form by pressing enter in the field.
    //                 e.preventDefault();
    //                 jc.$$formSubmit.trigger('click'); // reference the button and click it
    //             });
    //         }
    //     });
    // },
});

joint.shapes.cd.Abstract = joint.shapes.cd.Class.extend({

    defaults: _.defaultsDeep({
        type: 'cd.Abstract',
        attrs: {
            '.cd-class-name-rect': { fill : '#FF6434' },
            '.cd-class-attrs-rect': { fill : '#FF7D4D' },
        }
    }, joint.shapes.cd.Class.prototype.defaults),

    getClassName: function() {
        return ['<<Abstract>>', this.get('name')];
    }

});
joint.shapes.cd.AbstractView = joint.shapes.cd.ClassView;

joint.shapes.cd.Reference = joint.dia.Link.extend({
    defaults:  _.defaultsDeep({ 
        type: 'cd.Reference',
        name : [],
        lowerBound: [],
        upperBound: [],
        refType: [],
    }),

    initialize: function() {
        joint.dia.Link.prototype.initialize.apply(this, arguments);

        // Must override this function to add the label after the initialization
        this.label(0, {
            position: -30,
            attrs: {
                text: { text: this.get('lowerBound') + '..' + this.get('upperBound') },
            }
        });

        this.set('manhattan', true)
    },

    cardinality: function() {
        this.set('labels', [{ 
            position: -20, 
            attrs: { text: { dy: -8, text: this.defaults.lowerBound + "..." + this.defaults.upperBound }}
        }]);
    },

    getClassName: function() {
        return this.get('name');
    },

    getClassLowerBound: function() {
        return this.get('lowerBound');
    },

    getClassUpperBound: function() {
        return this.get('upperBound');
    },
});

joint.shapes.cd.Composition = joint.shapes.cd.Reference.extend({
    defaults: {
        type: 'cd.Composition',
        attrs: { '.marker-source': { d: 'M 40 10 L 20 20 L 0 10 L 20 0 z', fill: 'black' }}
    }
});
