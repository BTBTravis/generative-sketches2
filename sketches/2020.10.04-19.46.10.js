import * as utils from './artUtils';
import { range, split, concat, map, filter, head, curry, reduce, min } from 'ramda/dist/ramda';
const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 512, 512 ]
};

//function renderTextGrid() {
    //const rows = settings.dimensions[0] / 15;
    //const columns = settings.dimensions[0] / 10;
    //for (let y = 0; y < rows; y++) {
        //for (let x = 0; x < columns - 1; x++) {
            //renderLetter(x * 10, y * 15, 'X');
        //}
    //}
//}

//function renderLetter(x, y, letter) {
    //const text = new PointText(new Point(x, y));
    //text.justification = 'left';
    //text.fillColor = 'white';
    //text.content = letter;
    //text.fontSize = 15;
    //text.fontFamily = 'monospace';
    //return text;
//}

function drawDiagonalLine(x, y, height, width) {
    const leftToRight = Math.random() >= 0.5;
    const path = new Path();
    path.strokeColor = 'black';
    path.strokeWidth = '4';
    path.strokeCap = 'round';
    if (leftToRight) {
        path.add(new Point(x, y), new Point(x + width, y + height));
    } else {
        path.add(new Point(x + width, y), new Point(x, y + height));
    }
}



const sketch = () => {
  return ({ context, width, height }) => {
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
      utils.initPaperJs();
      const bg = new Path.Rectangle(view.bounds);
      bg.fillColor = '#FFF';
      //bg.fillColor = '#313639';
      const step = 20;
      for(let x = 0; x < 512; x += step) {
          for(let y = 0; y < 512; y+= step) {
              //draw(x, y, step, step);
              drawDiagonalLine(x, y, step, step);
          }
      }


      utils.paperJsDraw();
  };
};

canvasSketch(sketch, settings);
