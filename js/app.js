const SHAPE_NB = 6;

// Canvas where sape are dropped
const graph = new joint.dia.Graph();

const paper = new joint.dia.Paper({
    el:         $('#holder'),
    width:      $('#holder').width(),
    height:     600,
    model:      graph,
    gridSize:   5,
    drawGrid:   false,
    background: {
        color: '#F6F6F6',
    },
});

// Canvas from which you take shapes
const stencilGraph = new joint.dia.Graph();

const stencilPaper = new joint.dia.Paper({
    el:          $('#stencil'),
    height:      150,
    width:       $('#stencil').width(),
    model:       stencilGraph,
    interactive: { labelMove: true }, // was false
    background:  {
        color: '#A9A9A9',
    },
});

// Outline
// const paperSmall = new joint.dia.Paper({
//     el:       $('#outline'),
//     width:    400,
//     height:   167,
//     model:    graph,
//     gridSize: 1,
// });

// Zoom
const svgZoom = svgPanZoom('#holder svg', {
    center:               false,
    zoomEnabled:          true,
    panEnabled:           false, // was true
    controlIconsEnabled:  true,
    fit:                  false,
    minZoom:              0.5,
    maxZoom:              2,
    zoomScaleSensitivity: 0.5,
});

const cd       = joint.shapes.cd;
const fragment = joint.shapes.fragment;

// Stencil shapes :
const classShape = new cd.Class({
    position: {
        x: ($('#holder').width() / SHAPE_NB),
        y: 20,
    },
    size: {
        width:  200,
        height: 100,
    },
    name: 'Class',
});

const absClassShape = new cd.Abstract({
    position: {
        x: ($('#holder').width() / SHAPE_NB) * 2,
        y: 20,
    },
    size: {
        width:  200,
        height: 100,
    },
    name: 'Class',
});

const srcFragShape = new fragment.Source({
    position: {
        x: ($('#holder').width() / SHAPE_NB) * 3,
        y: 20,
    },
    size: {
        width:  200,
        height: 100,
    },
    name: 'Source Fragment',
});

const trFragShape = new fragment.Target({
    position: {
        x: ($('#holder').width() / SHAPE_NB) * 4,
        y: 20,
    },
    size: {
        width:  200,
        height: 100,
    },
    name: 'Target Fragment',
});

stencilGraph.addCells([classShape, absClassShape, srcFragShape, trFragShape]);

// Define the outline
// paperSmall.scale(0.2);
// paperSmall.$el.css('pointer-events', 'none');

// --------
// jQuery :
// --------

// Buttons :
$(window).on('load', function () {
    // Link to download the model in JSON
    const json = JSON.stringify(graph.toJSON(), null, 4);
    const blob = new Blob([json], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    const i = document.createElement('i');

    a.download = 'data.json';
    a.href = jsonUrl;
    a.id = 'download-link';
    a.title = 'Download the JSON model';
    a.className = 'buttons';

    i.className = 'material-icons medium';
    i.textContent = 'save'; // file_download

    // Button to clear the graph
    document.getElementById('buttons-container').appendChild(a);
    document.getElementById('download-link').appendChild(i);

    const divClear = document.createElement('div');
    const iClear = document.createElement('i');
    divClear.id = 'clear-div';
    divClear.className = 'buttons';
    iClear.className = 'material-icons medium';
    iClear.textContent = 'clear';

    document.getElementById('buttons-container').appendChild(divClear);
    document.getElementById('clear-div').appendChild(iClear);

    document.getElementById('clear-div').onclick = function () {
        graph.clear();
    };
});

// Update the JSON file when the DOM is modified
$('#holder').on('DOMSubtreeModified', function () {
    const json = JSON.stringify(graph.toJSON(), null, 4);
    const blob = new Blob([json], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(blob);

    $('#download-link').attr('href', jsonUrl);
});

// Responsive 
// $(window).on('resize', function () {
//     paper.setDimensions($('#holder').width());
//     paper.scaleContentToFit({
//         minScaleX: 0.3,
//         minScaleY: 0.3,
//         maxScaleX: 1,
//         maxScaleY: 1,
//     });
// });

// $(window).resize(function () {
//     const canvas = $('#holder');
//     paper.setDimensions(canvas.width());
// });

// --------
// Events :
// --------

stencilPaper.on('cell:pointerdown', function (cellView, e, x, y) {
    $('body').append(
        `<div id="flyPaper"
        style="position:fixed;z-index:100;opacity:.7;
        pointer-event:none;background-color:transparent;">
        </div>`
    );
    const flyGraph = new joint.dia.Graph();

    const flyPaper = new joint.dia.Paper({
        el:          $('#flyPaper'),
        model:       flyGraph,
        interactive: false,
    });

    const flyShape = cellView.model.clone();
    const pos = cellView.model.position();
    const offset = {
        x: x - pos.x,
        y: y - pos.y,
    };

    flyShape.position(0, 0);
    flyGraph.addCell(flyShape);
    $('#flyPaper').offset({
        left: e.pageX - offset.x,
        top:  e.pageY - offset.y,
    });
    $('body').on('mousemove.fly', function (event) {
        $('#flyPaper').offset({
            left: event.pageX - offset.x,
            top:  event.pageY - offset.y,
        });
    });
    $('body').on('mouseup.fly', function (event) {
        const x = event.pageX,
            y = event.pageY,
            target = paper.$el.offset();

        // Dropped over paper ?
        if (x > target.left && x < target.left + paper.$el.width() &&
            y > target.top && y < target.top + paper.$el.height()
        ) {
            const s = flyShape.clone();
            s.position(x - target.left - offset.x, y - target.top - offset.y);
            graph.addCell(s);
        }

        $('body').off('mousemove.fly').off('mouseup.fly');
        flyShape.remove();
        $('#flyPaper').remove();
    });
});

paper.on('cell:pointerup', function (cellView, evt, x, y) {
    // Find the first element below that is not a link nor the dragged element 
    // itself.
    const elementBelow = graph.get('cells').find(function (cell) {
        // Not interested in links.
        if (cell instanceof joint.dia.Link) return false;
        // The same element as the dropped one. 
        if (cell.id === cellView.model.id) return false;
        if (cell.getBBox().containsPoint(g.point(x, y))) {
            return true;
        }
        return false;
    });

    // If the two elements are connected already, don't
    // connect them again (this is application specific though).
    if (elementBelow && !_.contains(graph.getNeighbors(elementBelow),
        cellView.model)) {
        // Source fragment --- Target fragment
        if (elementBelow instanceof fragment.Target &&
            cellView.model instanceof fragment.Source) {
            graph.addCell(new fragment.Trace({
                source: { id: cellView.model.id },
                target: { id: elementBelow.id },
            }));
            // Move the element a bit to the side.
            cellView.model.translate(-200, 0);
        }

        // Class -- Source Fragment
        if (elementBelow instanceof fragment.Source &&
            cellView.model instanceof cd.Class) {
            console.log(elementBelow.attributes);
            elementBelow.attributes.sourceReferences.push(
                `Class : ${cellView.model.attributes.name}`
            );
            // Loop on class attributes
            elementBelow.updateRectangles();
            elementBelow.trigger('fragment-update');
            cellView.model.translate(-200, 0);
            // à tester : cell.set('position', cell.previous('position'));
        }

        // Class --- Class
        if (elementBelow instanceof cd.Class &&
            cellView.model instanceof cd.Class) {
            $.confirm({
                title:             'Confirm',
                content:           'Which link do you want to draw?',
                useBootstrap:      false,
                type:              'dark',
                closeIcon:         true,
                boxWidth:          '20%',
                animation:         'top',
                backgroundDismiss: true,
                buttons:           {
                    reference: {
                        text:     'Reference',
                        btnClass: 'btn-dark',
                        keys:     ['enter', 'r'],
                        action() {
                            graph.addCell(new cd.Reference({
                                source: {
                                    id: cellView.model.id,
                                },
                                target: {
                                    id: elementBelow.id,
                                },
                                lowerBound: '0',
                                upperBound: '*',
                            }));
                            cellView.model.translate(-200, 0);
                        },
                    },
                    composition: {
                        text:     'Composition',
                        btnClass: 'btn-dark',
                        keys:     ['shift', 'c'],
                        action() {
                            graph.addCell(new cd.Composition({
                                source: {
                                    id: cellView.model.id,
                                },
                                target: {
                                    id: elementBelow.id,
                                },
                                lowerBound: '0',
                                upperBound: '*',
                            }));
                            cellView.model.translate(-200, 0);
                        },
                    },
                },
            });
        }
    }
});
