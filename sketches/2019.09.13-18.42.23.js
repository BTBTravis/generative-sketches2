import * as utils from './artUtils';
const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 512, 512 ]
};

const sketch = () => {
    return ({ context, width, height }) => {
        utils.initPaperJs();

        // draw bg
        var from = new Point(20, 20);
        var to = new Point(80, 80);
        var bg = new Path.Rectangle(new Point(0,0), new Point(512, 512));
        bg.fillColor = '#1e2225';

        // draw guide circle
        const centerPt = new Point(512/2, 512/2);
        var prim = new Shape.Circle(centerPt, utils.r(150,250)).toPath();

        // draw bg lines
        const count = 2 * utils.r(6, 11);
        var offset = prim.length / count;
        let primPts = [];
        for (let i = 0; i < count; i++) {
            primPts.push(prim.getPointAt(offset * i));
        }

        // create bg lines
        const primLines = primPts.map(pt => {
            const path = new Path({
                strokeColor: 'white'
            });

            path.add(centerPt);
            path.add(pt);

            return path;
        });

        // create fg lines
        let primLinePairs = [];
        for (let i = 0; i < count / 2; i++) {
            primLinePairs.push(
                [primLines[i], primLines[i + count / 2]]
            );
        }

        //console.log({
            //primLinePairs
        //});
        //primLinePairs = primLinePairs.slice(0,2);

        const topLines = primLinePairs.map(([ln1, ln2]) => {
            const topLine = new Group(ln1.clone(), ln2.clone());
            //topLine.fullySelected = true;
            //const topLine = ln.clone();
            topLine.scale(10/utils.r(11,25), centerPt);
            topLine.strokeWidth = 6;
        });








        utils.paperJsDraw();
    };
};

canvasSketch(sketch, settings);
