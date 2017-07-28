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
