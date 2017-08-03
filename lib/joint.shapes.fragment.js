joint.shapes.fragment = {};

// Fragment
// --------

// Fragment Target :
joint.shapes.fragment.Target = joint.shapes.basic.Generic.extend({

    markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="fragment-target-name-rect"/><rect class="fragment-target-refs-rect"/>',
    '</g>',
    '<text class="fragment-target-name-text"/><text class="fragment-target-refs-text"/>',
    '</g>'
    ].join(''),

    defaults: _.defaultsDeep({

        type: 'fragment.Target',

        attrs: {
            rect: { 'width': 200 },

            '.fragment-target-name-rect': { 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#F7B733' },
            '.fragment-target-refs-rect': { 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#FFD14D' },

            '.fragment-target-name-text': {
                'ref': '.fragment-target-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },
            '.fragment-target-refs-text': {
                'ref': '.fragment-target-refs-rect', 'ref-y': 0.5, 'ref-x': 5, 'y-alignment': 'middle',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
            },
        },

        name: [],
        targetReferences: [],

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:targetReferences', function() {
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

        var rects = [
        { type: 'name', text: this.getTargetName() },
        { type: 'refs', text: this.get('targetReferences') },
        ];

        var offsetY = 0;

        _.each(rects, function(rect) {

            var lines = _.isArray(rect.text) ? rect.text : [rect.text];
            var rectHeight = lines.length * 20 + 20;

            attrs['.fragment-target-' + rect.type + '-text'].text = lines.join('\n');
            attrs['.fragment-target-' + rect.type + '-rect'].height = rectHeight;
            attrs['.fragment-target-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

            offsetY += rectHeight;
        });
    }
});

joint.shapes.fragment.TargetView = joint.dia.ElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.model, 'fragment-update', function() {
            this.update();
            this.resize();
        });
    }
});

// Fragment Source :
joint.shapes.fragment.Source = joint.shapes.basic.Generic.extend({

    markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="fragment-source-name-rect"/><rect class="fragment-source-refs-rect"/>',
    '</g>',
    '<text class="fragment-source-name-text"/><text class="fragment-source-refs-text"/>',
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
            '.fragment-source-refs-text': {
                'ref': '.fragment-source-refs-rect', 'ref-y': 0.5, 'ref-x': 5, 'y-alignment': 'middle',
                'fill': 'black', 'font-size': 12, 'font-family': 'Helvetica'
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

        var rects = [
        { type: 'name', text: this.getSourceName() },
        { type: 'refs', text: this.get('sourceReferences') },
        ];

        var offsetY = 0;

        _.each(rects, function(rect) {

            var lines = _.isArray(rect.text) ? rect.text : [rect.text];
            var rectHeight = lines.length * 20 + 20;

            attrs['.fragment-source-' + rect.type + '-text'].text = lines.join('\n');
            attrs['.fragment-source-' + rect.type + '-rect'].height = rectHeight;
            attrs['.fragment-source-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

            offsetY += rectHeight;
        });
    }
});

joint.shapes.fragment.SourceView = joint.shapes.fragment.TargetView;

// Trace :
joint.shapes.fragment.Trace = joint.dia.Link.extend({
    defaults: {
        type: 'cd.Trace',
        attrs: {
            '.connection': { stroke: '#31d0c6', 'stroke-width': 3, 'stroke-dasharray': '5 2' },
        }
    }
});

