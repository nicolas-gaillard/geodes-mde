joint.shapes.fragment = {};

// Constants
const REF_HEIGHT = 20;
const REF_WIDTH  = 200;

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
        }

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
        }

    }, joint.shapes.basic.Generic.prototype.defaults),
});

joint.shapes.fragment.SourceReferenceView = joint.shapes.embed.ElementView;

// Fragment Target :
joint.shapes.fragment.Target = joint.shapes.tm.toolElement.extend({

    markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="fragment-target-name-rect"/><rect class="fragment-target-refs-rect"/>',
    '</g>',
    '<text class="fragment-target-name-text"/>',
    '</g>'
    ].join(''),

    defaults: _.defaultsDeep({

        type: 'fragment.Target',

        attrs: {
            '.fragment-target-name-rect': { 'width': 200, 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#F7B733' },
            '.fragment-target-refs-rect': { 'width': 200, 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#FFD14D' },

            '.fragment-target-name-text': {
                'ref': '.fragment-target-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },

            '.new-name-circle': {
                'fill': '#FFD14D',
            },
        },

        name: [],
        // targetReferences: [],

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name', function() {
            this.updateRectangles();
            this.trigger('fragment-update');
        }, this);

        this.updateRectangles();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    getTargetName: function() {
        return this.get('name');
    },

    getTargetReferences: function() {
        return this.get('targetReferences');
    },

    updateRectangles: function() {
        var attrs = this.get('attrs');

        // Fragment name rendering :
        var targetName = this.getTargetName();
        var offsetY = 0;
        var lines = _.isArray(targetName) ? targetName : [targetName];
        var nameRectHeight = lines.length * 20 + 20;

        attrs['.fragment-target-name-text'].text = lines.join('\n');
        attrs['.fragment-target-name-rect'].height = nameRectHeight;
        attrs['.fragment-target-name-rect'].transform = 'translate(0,' + offsetY + ')';
        
        offsetY += nameRectHeight;

        // References rendering
        var references = this.getEmbeddedCells();
        var refRectHeight = references.length * 20 + 20;   // New size of the class
        var model = this;

        if (!(!Array.isArray(references) || !references.length)) { // array does not exist, is not an array, or is empty
            
            // console.log(references);
            _.each(references, function (ref, i) {
                var x = model.get('position').x;
                var y = (model.get('position').y + nameRectHeight + refRectHeight - REF_HEIGHT * (i+1) + 10);
                ref.position(x, y);
            });
        }

        attrs['.fragment-target-refs-rect'].height = refRectHeight;
        attrs['.fragment-target-refs-rect'].transform = 'translate(0,' + offsetY + ')';
    },

    addReference: function (rName = 'MyReference', rType = 'MyType') { 
        var ref = new fragment.SourceReference({
            position: {
                x: 0, 
                y: 0,
            }, 
            size: { 
                width: REF_WIDTH, height: REF_HEIGHT
            },
            name: rName,
            type: rType,
        })

        this.embed(ref);                 // Attach it to the class
        graph.addCell(ref);              // Add to the graph
        ref.position(0, 0);              // Set a random position (will be modified later)
        this.trigger('fragment-update');
        this.trigger('embed-update');      
        this.updateRectangles();         // Refresh the view
    },

});

joint.shapes.fragment.TargetView = joint.shapes.tm.ToolElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.model, 'fragment-update', function() {
            this.update();
            this.resize();
        });
    },
});

// Fragment Source :
joint.shapes.fragment.Source = joint.shapes.tm.toolElement.extend({

    markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="fragment-source-name-rect"/><rect class="fragment-source-refs-rect"/>',
    '</g>',
    '<text class="fragment-source-name-text"/>',
    '</g>'
    ].join(''),

    defaults: _.defaultsDeep({

        type: 'fragment.Source',

        attrs: {
            rect: { 'width': 200 },

            '.fragment-source-name-rect': { 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#C6C3CA' },
            '.fragment-source-refs-rect': { 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#DFDCE3' },

            '.fragment-source-name-text': {
                'ref': '.fragment-source-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },

            '.new-name-circle': {
                'fill': '#DFDCE3',
            },
        },

        name: [],
        sourceReferences: [],

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:sourceReferences', function() {
            this.updateRectangles();
            this.trigger('fragment-update');
        }, this);

        this.updateRectangles();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    getSourceName: function() {
        return this.get('name');
    },

    getSourceReferences: function() {
        return this.get('sourceReferences');
    },

    updateRectangles: function() {

        var attrs = this.get('attrs');

        // Fragment name rendering :
        var SourceName = this.getSourceName();
        var offsetY = 0;
        var lines = _.isArray(SourceName) ? SourceName : [SourceName];
        var nameRectHeight = lines.length * 20 + 20;

        attrs['.fragment-source-name-text'].text = lines.join('\n');
        attrs['.fragment-source-name-rect'].height = nameRectHeight;
        attrs['.fragment-source-name-rect'].transform = 'translate(0,' + offsetY + ')';
        
        offsetY += nameRectHeight;

        // References rendering
        var references = this.getEmbeddedCells();
        var refRectHeight = references.length * 20 + 20;   // New size of the class
        var model = this;

        if (!(!Array.isArray(references) || !references.length)) { // array does not exist, is not an array, or is empty
            
            // console.log(references);
            _.each(references, function (ref, i) {
                var x = model.get('position').x;
                var y = (model.get('position').y + nameRectHeight + refRectHeight - REF_HEIGHT * (i+1) + 10);
                ref.position(x, y);
            });
        }

        attrs['.fragment-source-refs-rect'].height = refRectHeight;
        attrs['.fragment-source-refs-rect'].transform = 'translate(0,' + offsetY + ')';
    },

    addReference: function (rName = 'MyReference', rType = 'MyType') { 
        var ref = new fragment.SourceReference({
            position: {
                x: 0, 
                y: 0,
            }, 
            size: { 
                width: REF_WIDTH, height: REF_HEIGHT
            },
            name: rName,
            type: rType,
        })

        this.embed(ref);                 // Attach it to the class
        graph.addCell(ref);              // Add to the graph
        ref.position(0, 0);              // Set a random position (will be modified later)
        this.trigger('fragment-update');      
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

