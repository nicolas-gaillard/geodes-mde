joint.shapes.fragment = {};

// Fragment
// --------

// Target reference
joint.shapes.fragment.TargetReference = joint.shapes.embed.Element.extend({

    defaults: _.defaultsDeep({

        type: 'fragment.TargetReference',

        attrs: {
            '.embed-element-rect': {
                fill: '#FFD14D',
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

        elemRef: [],

    }, joint.shapes.basic.Generic.prototype.defaults),
});

joint.shapes.fragment.TargetReferenceView = joint.shapes.embed.ElementView;

// Source reference : 
joint.shapes.fragment.SourceReference = joint.shapes.embed.Element.extend({

    defaults: _.defaultsDeep({

        type: 'fragment.SourceReference',

        attrs: {
            '.embed-element-rect': {
                fill: '#DFDCE3',
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

        elemRef: [],

    }, joint.shapes.basic.Generic.prototype.defaults),
});

joint.shapes.fragment.SourceReferenceView = joint.shapes.embed.ElementView;

// Fragment Target :
joint.shapes.fragment.Target = joint.shapes.editor.Element.extend({

    defaults: _.defaultsDeep({

        type: 'fragment.Target',

        attrs: {
            '.editor-element-name-rect': { 'width': ELEMENT_WIDTH, 'fill': '#F7B733' },
            '.editor-element-attrs-rect': { 'width': ELEMENT_WIDTH, 'fill': '#FFD14D' },

            '.editor-element-name-text': {
                'ref': '.editor-element-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },

            '.new-name-circle': {
                'fill': '#FFD14D',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),

    addReference: function (rName = 'MyReference', rType = 'MyType', elemRef) { 
        var ref = new fragment.TargetReference({
            position: {
                x: 0, 
                y: 0,
            }, 
            size: { 
                width: ELEMENT_WIDTH, height: ELEMENT_HEIGHT
            },
            name: rName,
            elemType: rType,
            elemRef: elemRef,
        })

        this.embed(ref);                 // Attach it to the class
        graph.addCell(ref);              // Add to the graph
        ref.position(0, 0);              // Set a random position (will be modified later)
        this.trigger('editor-update');
        this.trigger('embed-update');      
        this.updateRectangles();         // Refresh the view
    },

});

joint.shapes.fragment.TargetView = joint.shapes.editor.ElementView;

// Fragment Source :
joint.shapes.fragment.Source = joint.shapes.editor.Element.extend({

    defaults: _.defaultsDeep({

        type: 'fragment.Source',

        attrs: {
            '.editor-element-name-rect': { 'width': ELEMENT_WIDTH, 'fill': '#C6C3CA' },
            '.editor-element-attrs-rect': { 'width': ELEMENT_WIDTH, 'fill': '#DFDCE3' },

            '.editor-element-name-text': {
                'ref': '.editor-element-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },

            '.new-name-circle': {
                'fill': '#DFDCE3',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),


    addReference: function (rName = 'MyReference', rType = 'MyType', elemRef) { 
        var ref = new fragment.SourceReference({
            position: {
                x: 0, 
                y: 0,
            }, 
            size: { 
                width: ELEMENT_WIDTH, height: ELEMENT_HEIGHT
            },
            name: rName,
            elemType: rType,
            elemRef: elemRef,
        })

        this.embed(ref);                 // Attach it to the class
        graph.addCell(ref);              // Add to the graph
        ref.position(0, 0);              // Set a random position (will be modified later)
        this.trigger('editor-update');
        this.trigger('embed-update');      
        this.updateRectangles();         // Refresh the view
    },

});

joint.shapes.fragment.SourceView = joint.shapes.fragment.TargetView;

// Trace :
joint.shapes.fragment.Trace = joint.dia.Link.extend({
    defaults: {
        type: 'fragment.Trace',
        attrs: {
            '.connection': { stroke: '#31d0c6', 'stroke-width': 3, 'stroke-dasharray': '5 2' },
        }
    },

    initialize: function() {
        joint.dia.Link.prototype.initialize.apply(this, arguments);

        this.set('manhattan', true)
    },
});

