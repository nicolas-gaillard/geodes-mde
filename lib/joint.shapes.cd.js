joint.shapes.cd = {};

// Class Diagram
// -------------

// Attribute
joint.shapes.cd.Attribute = joint.shapes.embed.Element.extend({
    defaults: _.defaultsDeep({

        type: 'cd.Attribute',

        attrs: {
            '.embed-element-rect': {
                fill: '#FF9767',
                stroke: 'none',
                'width': ELEMENT_WIDTH,
                'height': ELEMENT_HEIGHT,
            },

            '.embed-element-text': {
                'ref': '.embed-element-rect', 
                'ref-y': 5, 
                'ref-x': 5, 
                'fill': 'black', 
                'font-size': 12, 
                'font-family': 'Helvetica', 
            },
        },
    }, joint.shapes.basic.Generic.prototype.defaults),
});

joint.shapes.cd.AttributeView = joint.shapes.embed.ElementView;

// Class
joint.shapes.cd.Class = joint.shapes.editor.Element.extend({

    defaults: _.defaultsDeep({

        type: 'cd.Class',

        attrs: {

            // old : 'stroke': '#fff', 'stroke-width': 0.5,FF9767 FF7D4D

            '.editor-element-name-rect': { 'width':ELEMENT_WIDTH, 'fill': '#FF6434' },
            '.editor-element-attrs-rect': { 'width':ELEMENT_WIDTH, 'fill': '#FF9767' },

            '.editor-element-name-text': {
                'ref': '.editor-element-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },

            '.new-name-circle': {
                'fill': '#FF7D4D',
            },

            '.new-attr-circle': {
                'fill': '#FF7D4D',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),

    addAttribute: function (aName = 'MyAttribute', aType = 'MyType') { 
        var attr = new cd.Attribute({
            position: {
                x: 0, 
                y: 0,
            }, 
            size: { 
                width: ELEMENT_WIDTH, height: ELEMENT_HEIGHT
            },
            name: aName,
            elemType: aType,
        })

        this.embed(attr);               // Attach it to the class
        graph.addCell(attr);            // Add to the graph
        attr.position(0, 0);            // Set a random position (will be modified later)
        this.trigger('editor-update');
        this.trigger('embed-update');      
        this.updateRectangles();        // Refresh the view
    },
});

joint.shapes.cd.ClassView = joint.shapes.editor.ElementView;

joint.shapes.cd.Abstract = joint.shapes.cd.Class.extend({

    defaults: _.defaultsDeep({
        type: 'cd.Abstract',

    }, joint.shapes.cd.Class.prototype.defaults),

    getName: function() {
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

    getName: function() {
        return this.get('name');
    },

    getLowerBound: function() {
        return this.get('lowerBound');
    },

    getUpperBound: function() {
        return this.get('upperBound');
    },
});

joint.shapes.cd.Composition = joint.shapes.cd.Reference.extend({
    defaults: {
        type: 'cd.Composition',
        attrs: { '.marker-source': { d: 'M 40 10 L 20 20 L 0 10 L 20 0 z', fill: 'black' }}
    }
});
