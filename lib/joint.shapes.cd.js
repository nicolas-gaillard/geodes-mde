joint.shapes.cd = {};

joint.shapes.cd.Class = joint.shapes.basic.Generic.extend({

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
            rect: { 'width': 200 },

            '.cd-class-name-rect': { 'stroke': 'black', 'stroke-width': 2, 'fill': '#3498db' },
            '.cd-class-attrs-rect': { 'stroke': 'black', 'stroke-width': 2, 'fill': '#2980b9' },

            '.cd-class-name-text': {
                'ref': '.cd-class-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Verdana'
            },
            '.cd-class-attrs-text': {
                'ref': '.cd-class-attrs-rect', 'ref-y': 5, 'ref-x': 5,
                'fill': 'black', 'font-size': 12, 'font-family': 'Verdana'
            },
        },

        name: [],
        attributes: [],

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:attributes', function() {
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

    updateRectangles: function() {

        var attrs = this.get('attrs');

        var rects = [
        { type: 'name', text: this.getClassName() },
        { type: 'attrs', text: this.get('attributes') },
        ];

        var offsetY = 0;

        _.each(rects, function(rect) {

            var lines = _.isArray(rect.text) ? rect.text : [rect.text];
            var rectHeight = lines.length * 20 + 20;

            attrs['.cd-class-' + rect.type + '-text'].text = lines.join('\n');
            attrs['.cd-class-' + rect.type + '-rect'].height = rectHeight;
            attrs['.cd-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

            offsetY += rectHeight;
        });
    }

});

joint.shapes.cd.ClassView = joint.dia.ElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.model, 'cd-update', function() {
            this.update();
            this.resize();
        });
    }
});

joint.shapes.cd.Abstract = joint.shapes.cd.Class.extend({

    defaults: _.defaultsDeep({
        type: 'cd.Abstract',
        attrs: {
            '.cd-class-name-rect': { fill : '#e74c3c' },
            '.cd-class-attrs-rect': { fill : '#c0392b' },
        }
    }, joint.shapes.cd.Class.prototype.defaults),

    getClassName: function() {
        return ['<<Abstract>>', this.get('name')];
    }

});
joint.shapes.cd.AbstractView = joint.shapes.cd.ClassView;

joint.shapes.cd.Reference = joint.dia.Link.extend({
    // The default markup for links.
    markup: [
    '<path class="connection" stroke="black" d="M 0 0 0 0"/>',
    '<path class="marker-source" fill="black" stroke="black" d="M 0 0 0 0"/>',
    '<path class="marker-target" fill="black" stroke="black" d="M 0 0 0 0"/>',
    '<path class="connection-wrap" d="M 0 0 0 0"/>',
    '<g class="rotatable">',
    '<text class="cd-reference-lowerBound-text"/><text class="cd-reference-upperBound-text"/>',
    '</g>',
    '<g class="labels"/>',
    '<g class="marker-vertices"/>',
    '<g class="marker-arrowheads"/>',
    '<g class="link-tools"/>'
    ].join(''),

    defaults:  _.defaultsDeep({ 
        type: 'cd.Reference',
        lowerBound: [],
        upperBound: [], 
    })
});

joint.shapes.cd.Composition = joint.shapes.cd.Reference.extend({
    defaults: {
        type: 'cd.Composition',
        attrs: { '.marker-target': { d: 'M 40 10 L 20 20 L 0 10 L 20 0 z', fill: 'black' }}
    }
});


