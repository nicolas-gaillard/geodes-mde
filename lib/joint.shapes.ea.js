joint.shapes.ea = {};

// Entity relationship
// -------------------

// Column
joint.shapes.ea.Column = joint.shapes.embed.Element.extend({
    defaults: _.defaultsDeep({

        type: 'ea.Column',

        attrs: {
            '.embed-element-rect': {
                fill: '#33C9BB',
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

        isPK: [],
        isFK: [],
    }, joint.shapes.basic.Generic.prototype.defaults),

    // Must overwrite this function because of new props
    initialize: function() {

        this.on('change:name change:elemType change:isPK change:isFK', function() {
            this.updateRectangle();
            this.trigger('embed-update');
        }, this);

        this.updateRectangle();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    setPK: function(bool) {
        this.prop('isPK', bool);
        this.trigger('embed-update');
    },

    setFK: function(bool) {
        this.prop('isFK', bool);
        this.trigger('embed-update');
    },

    // Must overwrite this function too
    updateRectangle: function() {
        var attrs = this.get('attrs');
        attrs['.embed-element-text'].text = this.getName() + ' : ' + this.getType();

        if (this.get('isPK')) {
            this.attr('.embed-element-text/text-decoration', 'underline');
        } else {
            this.attr('.embed-element-text/text-decoration', 'none');
        }        

        if (this.get('isFK')) {
            this.attr('.embed-element-text/font-style', 'italic');
        } else {
            this.attr('.embed-element-text/font-style', 'none');
        }
    },
});

joint.shapes.ea.ColumnView = joint.shapes.embed.ElementView;

// Table 
joint.shapes.ea.Table = joint.shapes.editor.Element.extend({
    defaults: _.defaultsDeep({

        type: 'ea.Table',

        attrs: {

            '.editor-element-name-rect': { 'width':ELEMENT_WIDTH, 'fill': '#1AB0A2' },
            '.editor-element-attrs-rect': { 'width':ELEMENT_WIDTH, 'fill': '#33C9BB' },

            '.editor-element-name-text': {
                'ref': '.editor-element-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },

            '.new-name-circle': {
                'fill': '#33C9BB',
            },

            '.new-attr-circle': {
                'fill': '#33C9BB',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),

    addColumn: function (aName = 'MyColumn', aType = 'MyType') { 
        var attr = new ea.Column({
            position: {
                x: 0, 
                y: 0,
            }, 
            size: { 
                width: ELEMENT_WIDTH, height: ELEMENT_HEIGHT
            },
            name: aName,
            elemType: aType,
            isPK: false,
            isFK: false,
        })

        this.embed(attr);               // Attach it to the class
        graph.addCell(attr);            // Add to the graph
        attr.position(0, 0);            // Set a random position (will be modified later)
        this.trigger('editor-update');
        this.trigger('embed-update');      
        this.updateRectangles();        // Refresh the view
        //console.log(attr.getAncestors()[0].getEmbeddedCells());
    },
});

joint.shapes.ea.TableView = joint.shapes.editor.ElementView;

joint.shapes.ea.Association = joint.dia.Link.extend({
    defaults:  _.defaultsDeep({ 
        type: 'ea.Association',
    }),

    initialize: function() {
        joint.dia.Link.prototype.initialize.apply(this, arguments);

        this.set('manhattan', true)
    },
});
