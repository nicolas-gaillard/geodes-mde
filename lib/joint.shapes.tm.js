joint.shapes.tm = {};

// Custom element which brings tools
// (for example, it allows to delete elements easily)
joint.shapes.tm.toolElement = joint.shapes.basic.Generic.extend({

    toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',

        '<g class="element-tool-new-attr" transform="translate(25,0)"><circle fill="#FF7D4D" stroke="#fff" stroke-width="0.7" r="11"/>',
        '<rect height="3" width="13" x="-7" y="-1"></rect>',
        '<rect height="12" width="3" x="-2" y="-6"></rect>',
        '<title>Add an attribute to this class</title>',
        '</g>',

        '</g>'
    ].join(''),

    defaults: joint.util.deepSupplement({
        attrs: {
            text: { 'font-weight': 400, 'font-size': 'small', fill: 'black', 'text-anchor': 'middle', 'ref-x': .5, 'ref-y': .5, 'y-alignment': 'middle' },
        },
    }, joint.shapes.basic.Generic.prototype.defaults)

});

joint.shapes.tm.ToolElementView = joint.dia.ElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    },

    render: function () {

        joint.dia.ElementView.prototype.render.apply(this, arguments);

        this.renderTools();
        this.update();

        return this;
    },

    renderTools: function () {

        var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');

        if (toolMarkup) {

            var nodes = V(toolMarkup);
            V(this.el).append(nodes);

        }

        return this;
    },

    pointerclick: function (evt, x, y) {

        this._dx = x;
        this._dy = y;
        this._action = '';

        var className = evt.target.parentNode.getAttribute('class');

        switch (className) {

            case 'element-tool-remove':
                this.model.remove();
                return;
                break;

            case 'element-tool-new-attr':
                this.model.addAttribute();
                return;
                break;

            default:
        }

        joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
    }

});
