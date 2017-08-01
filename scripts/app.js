// const utils = require('./utils');

$(window).on('load', function () {
    const json = JSON.stringify(graph.toJSON(), null, 4);
    const blob = new Blob([json], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    const i = document.createElement('i');

    a.download = 'data.json';
    a.href = jsonUrl;
    a.id = 'download-link';
    a.title = 'Download the JSON model';

    i.className = 'material-icons';
    i.textContent = 'file_download';

    document.getElementById('buttons').appendChild(a);
    document.getElementById('download-link').appendChild(i);
});

$('#holder').on('DOMSubtreeModified', function () {
    const json = JSON.stringify(graph.toJSON(), null, 4);
    const blob = new Blob([json], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(blob);

    $('#download-link').attr('href', jsonUrl);
});

const graph = new joint.dia.Graph();

const paper = new joint.dia.Paper({
    el:       $('#holder'),
    width:    1200,
    height:   500,
    model:    graph,
    gridSize: 1,
});

const rect = new joint.shapes.basic.Rect({
    position: { x: 100, y: 30 },
    size:     { width: 100, height: 30 },
    attrs:    {
        rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' },
    },
});

const rect2 = rect.clone();

const link = new joint.dia.Link({
    source: { id: rect.id },
    target: { id: rect2.id },
});

const paperSmall = new joint.dia.Paper({
    el:       $('#outline'),
    width:    400,
    height:   167,
    model:    graph,
    gridSize: 1,
});

rect.attr({
    rect: {
        fill:           '#2C3E50',
        rx:             5,
        ry:             5,
        'stroke-width': 2,
        stroke:         'black',
    },
    text: {
        text:             'my label',
        fill:             '#3498DB',
        'font-size':      18,
        'font-weight':    'bold',
        'font-variant':   'small-caps',
        'text-transform': 'capitalize',
    },
});

link.set('smooth', true);

rect2.translate(300);

graph.addCells([rect, rect2, link]);

paperSmall.scale(0.3);
paperSmall.$el.css('pointer-events', 'none');

rect.on('change:position', function (element) {
    console.log(element.id, ':', element.get('position'));
});

const addRect = function () {
    const newRect = rect.clone();
    newRect.translate(+60, +40);
    newRect.attr('text/text', 'MyRect');
    graph.addCells(newRect);
    console.log(graph.toJSON());
};

$('#add-rect').on('click', addRect);
