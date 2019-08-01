import * as utils from './artUtils';
const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: utils.defaultSize
};

const black = '#252120';


function drawStripe(gap, size, z, vertical = false) {
    const bg = vertical ?
        new Path([z - size, 0], [z - size, 512], [z + size, 512], [z + size, 0])
        :
        new Path([0, z - size], [512, z - size], [512, z + size], [0, z + size]);
    //bg.fullySelected = true;
    bg.fillColor = black;

    let i = z;
    while(i < z + size) {
        const l = vertical ?
            new Path([i, 0], [i, 512])
        :
            new Path([0, i], [512, i])
        l.strokeColor = 'white';
        if (size > 30) l.strokeWidth = 2;
        i += gap;
    }

    //return bg;
}



const sketch = () => {
    return ({ context, width, height }) => {
        utils.initPaperJs();
        const backgroundPath = new Path.Rectangle(view.bounds);
        backgroundPath.fillColor = black;

        let lines = [];
        for (let i = 0; i < utils.r(10, 15); i++) {
        //for (let i = 0; i < 4; i++) {
            //drawStripe(5, 25, utils.r(0,500), utils.r(0, 2 === 0));
            const scale = utils.r(25, 40)
            drawStripe(scale / 5, scale, utils.r(0,500), utils.r(0, 2) === 0);
        }

        utils.paperJsDraw();
    };
};

canvasSketch(sketch, settings);
