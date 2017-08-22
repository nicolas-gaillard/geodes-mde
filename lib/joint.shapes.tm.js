joint.shapes.tm = {};

const boxSetName = function (model) {
    $.confirm({
        title:`Enter the new name`,
        useBootstrap: false,
        type: 'dark',
        closeIcon: true,
        boxWidth: '25%',
        animation: 'top',
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        `<input type="text" placeholder="new name" class="name form-control" required />` +
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'Submit',
                btnClass: 'btn-dark',
                keys: ['enter', 'r'],
                action: function () {
                    var name = this.$content.find('.name').val();
                    if(!name){
                        $.alert('provide a valid name');
                        return false;
                    }
                    model.attributes.name = name;
                    model.updateRectangles();

                    model.trigger('editor-update');
                }
            },
            cancel: function () {
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });
};

// Custom element which brings tools
// (for example, it allows to delete elements easily)
joint.shapes.tm.toolElement = joint.shapes.basic.Generic.extend({

    toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',

        '<g class="element-tool-new-attr" transform="translate(50,0)"><circle class="new-attr-circle" stroke="#fff" stroke-width="0.7" r="11"/>',
        '<rect height="3" width="13" x="-7" y="-1"></rect>',
        '<rect height="12" width="3" x="-2" y="-6"></rect>',
        '<title>Add an attribute to this class</title>',
        '</g>',

        '<g class="element-tool-new-name" transform="translate(25,0)"><circle class="new-name-circle" stroke="#fff" stroke-width="0.7" r="11"/>',
        '<circle cx="-4" cy="2" r="1" fill="white" />',
        '<circle cx="0" cy="2" r="1" fill="white" />',
        '<circle cx="4" cy="2" r="1" fill="white" />',
        '<title>Edit the name</title>',
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
                if (this.model instanceof cd.Class) {
                    this.model.addAttribute();    
                } else {
                    this.model.addColumn();
                }
                return;
                break;

            case 'element-tool-new-name':
                boxSetName(this.model);
                return;
                break;

            default:
        }

        joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
    }

});
