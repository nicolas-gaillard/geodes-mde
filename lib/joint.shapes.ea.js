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
    }, joint.shapes.basic.Generic.prototype.defaults),
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
        })

        this.embed(attr);               // Attach it to the class
        graph.addCell(attr);            // Add to the graph
        attr.position(0, 0);            // Set a random position (will be modified later)
        this.trigger('editor-update');
        this.trigger('embed-update');      
        this.updateRectangles();        // Refresh the view
    },
});

joint.shapes.ea.TableView = joint.shapes.editor.ElementView;
