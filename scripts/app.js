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

rect2.translate(300);

graph.addCells([rect, rect2, link]);
