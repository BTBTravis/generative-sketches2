import * as utils from './artUtils';
import { range, split, concat, map, filter, head, curry, reduce, min } from 'ramda/dist/ramda';
const canvasSketch = require('canvas-sketch');

//console.log('range', range()(utils.r(0,49))(utils.r(50,100)));

const instructions = ((txt) => {
    txt = map(concat('// '))(filter(x => x != '')(split(/\n/, txt)));
    return txt.reduce((carry, str) => {
        return carry + str + '\n';
    }, '');
})(`
Proposal for digital drawing, 014
--
find a off black screen then
mark four points reandomly distrbuted,
with at least 4 units between them and to edges;
draw construction lines connecting the four points;
grow thick circles from these points,
cutting out parts outside connecting lines
`);

const renderDrawing = () => {
    // 4 pts
    const randomPt = () => {
        const pt = () => utils.r(40, 482);
        return new Point(pt(), pt());
    }

    const drawPt = curry((color, pt) => {
        var c = new Shape.Circle(pt, 3);
        c.fillColor = color;
        c.opacity = 0.2;
    })

    const randomPts = map(randomPt)(range(0,100));
    map(drawPt('white'), randomPts);

    const quads = [
        (pt) => pt.x > 256 && pt.y > 256,
        (pt) => pt.x < 256 && pt.y > 256,
        (pt) => pt.x > 256 && pt.y < 256,
        (pt) => pt.x < 256 && pt.y < 256,
    ];

    let quadPts = map((fn) => head(filter(fn, randomPts)), quads);
    map(drawPt('red'), quadPts);

    const cLines = [
        new Path.Line(quadPts[0], quadPts[2]),
        new Path.Line(quadPts[2], quadPts[3]),
        new Path.Line(quadPts[3], quadPts[1]),
        new Path.Line(quadPts[1], quadPts[0]),
    ];

    const edgeLines = [
        new Path.Line(quadPts[3], new Point(0,0)),
        new Path.Line(quadPts[0], new Point(512,512)),
        new Path.Line(quadPts[1], new Point(0,512)),
        new Path.Line(quadPts[2], new Point(512, 0)),
    ];


    // nest pts
    quadPts = map(ogPt => {
        ogPt.otherPts = filter(pt => pt.x + pt.y !== ogPt.x + ogPt.y, quadPts);
        return ogPt;
    }, quadPts);
    console.log('quadPts', quadPts);

    const centerBox = new Path({
        segments: [
            quadPts[0],
            quadPts[2],
            quadPts[3],
            quadPts[1],
        ],
        //[
            //quadPts[
            //[20, 20], [80, 80], [140, 20]
        //],
        //fillColor: 'black',
        closed: true
    });

    const centerBoxMinus = new CompoundPath({
        children: [
            centerBox,
            new Path.Rectangle(view.bounds),
        ],
        //fillColor: 'white',
        fillRule: 'evenodd',
        //selected: true
    });

    const initCirc = map((pt) => {
        // min distance
        const distances = map(nearPt => nearPt.getDistance(pt), pt.otherPts);
        distances.sort();
        console.log('distances', distances);
        //cOuter.strokeColor = 'white';
        //cInner.strokeColor = 'white';
        const r = head(distances) / 2;
        const c = new CompoundPath({
            children: [
		new Path.Circle({
		    center: pt,
		    radius: r
		}),
		new Path.Circle({
		    center: pt,
		    radius: r - utils.r(10,30)
		})
            ],
            //fillColor: 'white',
            fillRule: 'evenodd',
            //selected: true
        });

        const part = c.subtract(centerBoxMinus);
        //const part = centerBox.subtract(c);
        //part.selected = true;
        part.fillColor = 'white';
        //part.fillRule = 'evenodd';
    }, quadPts);
        //c.fillColor = color;

    //}

    map(l => {
        l.strokeColor = 'white';
        l.opacity = 0.3;
    } , concat(cLines, edgeLines));

};

const settings = {
  dimensions: [ 512, 512 ]
};

const renderTxt = () => {
    var text = new PointText(new Point(30, 400));
    text.justification = 'left';
    text.fillColor = 'white';
    text.content = instructions;
    text.fontSize = 10;
    text.fontFamily = 'monospace';
}

const sketch = () => {
    return ({ context, width, height }) => {
	context.fillStyle = 'white';
	context.fillRect(0, 0, width, height);
	utils.initPaperJs();
        const bg = new Path.Rectangle(view.bounds);
        bg.fillColor = '#313639';
	renderTxt();
        renderDrawing();

        utils.paperJsDraw();
    };
};

canvasSketch(sketch, settings);
