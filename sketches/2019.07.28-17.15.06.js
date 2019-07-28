const canvasSketch = require('canvas-sketch');
const paper = require('paper');

const settings = {
    dimensions: [ 512, 512 ]
};

let lastColor = '';
function getColor() {
    const colors = [ '#393D3F', '#99B2DD', '#B9CFD4'];
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];
    if (pickedColor === lastColor) return getColor();
    lastColor = pickedColor;
    return pickedColor;
}

function rn(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function makeArch(x, y, size) {
    const pts = [
        new Point(x - (size / 2), y),
        new Point(x - (size / 2), y - (size * 1.5)),
        new Point(x + (size / 2), y - (size * 1.5)),
        new Point(x + (size / 2), y)
    ];
    let arch = new Path();
    arch.moveTo(pts[0]);
    arch.lineTo(pts[1]);
    arch.lineTo(pts[2]);
    arch.lineTo(pts[3]);
    arch.strokeColor = 'black';
    //arch.strokeColor = 'white';
    arch.strokeWidth = 2;
}

const sketch = () => {
    return ({ context, width, height }) => {
	context.fillStyle = 'white';
	context.fillRect(0, 0, width, height);
	paper.install(window);
	paper.setup(document.querySelector('canvas'));
        var bg = new Path.Rectangle(new Point(0,0), new Point(512, 512));
        bg.fillColor = getColor();

        //makeArch(256, 256, 5);

        let guideLn = new Path();
        guideLn.segments = [
            [[rn(50, 150), 712], null, null],
            [[rn(50, 150), 512], null, new Point({angle: -90, length: rn(150, 250)})],
            [[rn(400, 500), 256], new Point({angle: 90, length: rn(50,150)}), new Point({angle: -90, length: rn(50, 150)})],
            [[rn(246, 266), 50], new Point({angle: 180, length: 150}), new Point({angle: 0, length: 50})],
            [[rn(286, 326), -10], null, null]
        ];
        //guideLn.fullySelected = true;
        console.log('length', guideLn.length);

        let pts = [];
        const totalPts = 25;
        let offset = guideLn.length / totalPts;
        //let f = x => Math.pow(x, 1) + 1;
        let f = x => (60 / x) * offset;
        for (let i = 1; i <= totalPts; i++) {
            console.log({x:i, y:f(i)});
        }

        const totalLength = guideLn.length;
        for (let i = 1; i <= totalPts; i++) {
            const factor = f(i);
            //offset / factor
            //const offset = totalLength / totalPts;
            pts.push({factor, pt: guideLn.getPointAt(totalLength - factor)});
        }

        pts.forEach(({factor, pt}) => {
            if (pt == null) return;
            console.log({factor, x: pt.x, y: pt.y});
            //makeArch(pt.x, pt.y, factor * 1.5);
            makeArch(pt.x, pt.y, factor / 50);

            //let circle = new Path.Circle({
                //center: pt,
                //radius: 3,
                //fillColor: 'red'
            //});
        });


	// Create drawing
	view.draw();
    };
};

canvasSketch(sketch, settings);
