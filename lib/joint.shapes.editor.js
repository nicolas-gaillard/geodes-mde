joint.shapes.editor = {};

joint.shapes.editor.Element = joint.shapes.tm.toolElement.extend({

	markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="editor-element-name-rect"/><rect class="editor-element-attrs-rect"/>',
    '</g>',
    '<text class="editor-element-name-text"/>',
    '</g>'
    ].join(''),

    defaults: _.defaultsDeep({
        attrs: {

            '.editor-element-name-rect': { 'width':ELEMENT_WIDTH, 'stroke': '#fff', 'stroke-width': 0.5, 'fill': 'black' },
            '.editor-element-attrs-rect': { 'width':ELEMENT_WIDTH, 'stroke': '#fff', 'stroke-width': 0.5, 'fill': 'black' },

            '.editor-element-name-text': {
                'ref': '.cd-class-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },

            '.new-name-circle': {
                'fill': 'red',
            },
        },

        name: [],
        // attributes: [], --> useless now
        // references: [], --> useless too

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:references', function() {
            this.updateRectangles();
            this.trigger('editor-update');
        }, this);

        this.updateRectangles();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    getName: function() {
        return this.get('name');
    },

    updateRectangles: function() {
        var attrs = this.get('attrs');

        // Class name rendering :
        var className = this.getName();
        var offsetY = 0;
        var lines = _.isArray(className) ? className : [className];
        var nameRectHeight = lines.length * 20 + 20;

        attrs['.editor-element-name-text'].text = lines.join('\n');
        attrs['.editor-element-name-rect'].height = nameRectHeight;
        attrs['.editor-element-name-rect'].transform = 'translate(0,' + offsetY + ')';
        
        offsetY += nameRectHeight;

        // Attributes rendering
        var classEmbeds = this.getEmbeddedCells();
        var attrRectHeight = classEmbeds.length * 20 + 20;   // New size of the class
        var model = this;

        if (!(!Array.isArray(classEmbeds) || !classEmbeds.length)) { // array does not exist, is not an array, or is empty
            
            //console.log(classAttributes);
            _.each(classEmbeds, function (emb, i) {
                var x = model.get('position').x;
                var y = (model.get('position').y + nameRectHeight + attrRectHeight - ELEMENT_HEIGHT * (i+1) + 10);
                emb.position(x, y);
            });
        }

        attrs['.editor-element-attrs-rect'].height = attrRectHeight;
        attrs['.editor-element-attrs-rect'].transform = 'translate(0,' + offsetY + ')';
    },
});

joint.shapes.editor.ElementView = joint.shapes.tm.ToolElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.model, 'editor-update', function() {
            this.update();
            this.resize();
        });
    },
});