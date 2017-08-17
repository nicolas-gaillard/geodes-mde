joint.shapes.fragment = {};

// Constants
const REF_HEIGHT = 20;
const REF_WIDTH  = 200;

// Fragment
// --------

// Target reference
joint.shapes.fragment.TargetReference = joint.shapes.basic.Generic.extend({

    markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="fragment-reference-rect"/>',
    '</g>',
    '<text class="fragment-reference-text"/>',
    '</g>'
    ].join(''),

    defaults: _.defaultsDeep({

        type: 'fragment.Reference',

        attrs: {
            rect: {
                fill: '#FFD14D',
                stroke: 'none',
                'width': REF_WIDTH,
                'height': REF_HEIGHT,
            },
            'text': {
                fill: '#000000',
                text: 'MyReference',
                'font-size': 12,
                'ref-x': 5,
                'ref-y': 5,
                'font-family': 'Helvetica, sans-serif'
            }
        },

        name: [],
        type: [],

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:name change:type', function() {
            this.updateRectangle();
            this.trigger('fragment-update');
        }, this);

        this.updateRectangle();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    getReferenceName: function() {
        return this.get('name');
    },

    getReferenceType: function() {
        return this.get('type');
    },

    updateRectangle: function() {
        var attrs = this.get('attrs');
        attrs['text'].text = this.getReferenceName() + ' : ' + this.getReferenceType();
    },
});

joint.shapes.fragment.TargetReferenceView = joint.dia.ElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.model, 'fragment-update', function() {
            this.update();
            this.resize();
        });
    },
});

// Source reference : 
joint.shapes.fragment.SourceReference = joint.shapes.fragment.TargetReference.extend({

    defaults: _.defaultsDeep({

        type: 'fragment.Reference',

        attrs: {
            rect: {
                fill: '#DFDCE3',
                stroke: 'none',
                'width': REF_WIDTH,
                'height': REF_HEIGHT,
            },
            'text': {
                fill: '#000000',
                text: 'MyReference',
                'font-size': 12,
                'ref-x': 5,
                'ref-y': 5,
                'font-family': 'Helvetica, sans-serif'
            }
        },

        name: [],
        type: [],

    }, joint.shapes.basic.Generic.prototype.defaults),
});

joint.shapes.fragment.SourceReferenceView = joint.shapes.fragment.TargetReferenceView;

// Fragment Target :
joint.shapes.fragment.Target = joint.shapes.tm.toolElement.extend({

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
            // rect: { 'width': 200 },

            '.fragment-target-name-rect': { 'width': 200, 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#F7B733' },
            '.fragment-target-refs-rect': { 'width': 200, 'stroke': '#fff', 'stroke-width': 0.5, 'fill': '#FFD14D' },

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
        // targetReferences: [],

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

        // --> Old func : 
        // var attrs = this.get('attrs');

        // var rects = [
        // { type: 'name', text: this.getTargetName() },
        // { type: 'refs', text: this.get('targetReferences') },
        // ];

        // var offsetY = 0;

        // _.each(rects, function(rect) {

        //     var lines = _.isArray(rect.text) ? rect.text : [rect.text];
        //     var rectHeight = lines.length * 20 + 20;

        //     attrs['.fragment-target-' + rect.type + '-text'].text = lines.join('\n');
        //     attrs['.fragment-target-' + rect.type + '-rect'].height = rectHeight;
        //     attrs['.fragment-target-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

        //     offsetY += rectHeight;
        // });

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

    // pointerclick: function (view, evt, x, y){
    //     // Because of scope :
    //     const myModel = this.model;
    //     console.log(myModel)

    //     // prompt for new label and change your label 
    //     $.confirm({
    //         title: 'Enter the name of the fragment',
    //         useBootstrap: false,
    //         type: 'dark',
    //         closeIcon: true,
    //         boxWidth: '25%',
    //         animation: 'top',
    //         content: '' +
    //         '<form action="" class="formName">' +
    //         '<div class="form-group">' +
    //         '<input type="text" placeholder="Fragment name" class="name form-control" required />' +
    //         '</div>' +
    //         '</form>',
    //         buttons: {
    //             formSubmit: {
    //                 text: 'Submit',
    //                 btnClass: 'btn-dark',
    //                 action: function () {
    //                     var name = this.$content.find('.name').val();
    //                     if(!name){
    //                         $.alert('provide a valid name');
    //                         return false;
    //                     }
    //                     myModel.attributes.name = name;
    //                     myModel.updateRectangles();
    //                     myModel.trigger('fragment-update');
    //                 }
    //             },
    //             cancel: function () {
    //                 //close
    //             },
    //         },
    //         onContentReady: function () {
    //             // bind to events
    //             var jc = this;
    //             this.$content.find('form').on('submit', function (e) {
    //                 // if the user submits the form by pressing enter in the field.
    //                 e.preventDefault();
    //                 jc.$$formSubmit.trigger('click'); // reference the button and click it
    //             });
    //         }
    //     });
    // },
});

// Fragment Source :
joint.shapes.fragment.Source = joint.shapes.tm.toolElement.extend({

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
        type: 'cd.Trace',
        attrs: {
            '.connection': { stroke: '#31d0c6', 'stroke-width': 3, 'stroke-dasharray': '5 2' },
        }
    }
});

