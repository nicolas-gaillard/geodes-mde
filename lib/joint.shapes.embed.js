joint.shapes.embed = {};

// Constants
const ELEMENT_HEIGHT = 20;
const ELEMENT_WIDTH  = 200;

joint.shapes.embed.Element = joint.shapes.basic.Generic.extend({
	markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="embed-element-rect"/>',
    '</g>',
    '<text class="embed-element-text"/>',
    '</g>'
    ].join(''),

    defaults: _.defaultsDeep({
        name: [],
        elemType: [],

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:elemType', function() {
            this.updateRectangle();
            this.trigger('embed-update');
        }, this);

        this.updateRectangle();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    getName: function() {
        return this.get('name');
    },

    getType: function() {
        return this.get('elemType');
    },

    setName: function(newName) {
        this.prop('name', newName);
        this.trigger('embed-update');
        // this.findView(paper).update();
    },

    setType: function(newType) {
        this.prop('elemType', newType);
        this.trigger('embed-update');
        // this.findView(paper).update();
    },

    updateRectangle: function() {
        var attrs = this.get('attrs');
        attrs['.embed-element-text'].text = this.getName() + ' : ' + this.getType();
    },
});

joint.shapes.embed.ElementView = joint.dia.ElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.model, 'embed-update', function() {
            this.update();
            this.resize();
        });
    },
});