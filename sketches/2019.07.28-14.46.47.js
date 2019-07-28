const canvasSketch = require('canvas-sketch');
const paper = require('paper');

const settings = {
    dimensions: [ 512, 512 ]
};

let lastColor = '';
function getColor() {
    const colors = [ '#a5dff9', '#ef5285', '#60c5ba', '#feee7d'];
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];
    if (pickedColor === lastColor) return getColor();
    lastColor = pickedColor;
    return pickedColor;
}

function rn(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const sketch = () => {
    return ({ context, width, height }) => {
	context.fillStyle = 'white';
	context.fillRect(0, 0, width, height);
	paper.install(window);
	paper.setup(document.querySelector('canvas'));
        var bg = new Path.Rectangle(new Point(0,0), new Point(512, 512));
        bg.fillColor = getColor();

	var vector = new Point({
	    angle: 45,
            length: rn(-500, 500)
	});
	var guide1 = new Path();
	guide1.segments = [
	    [[256, -250], null, vector.rotate(0)],
	    [[256, 240], vector.rotate(180), null],
	];
	//guide1.strokeColor = 'black';

        const otherGuideAngles = [ 90, 180, 270 ];
        let guideLines = otherGuideAngles.map(d => {
            let g = guide1.clone();
            g.rotate(d, view.center);
            return g;
        });
        guideLines.push(guide1);
        const guidePoints = guideLines.map(l => {
            let pts = [];
            cuts = 8;
            var offset = l.length / cuts;
            let y = x => x / 2;
            //[1, .77
            for (let i = 0; i <= cuts; i++) {
                pts.push(l.getPointAt(l.length - (400 / i)));
            }
            //pts.forEach(pt => {
                //let circle = new Path.Circle({
                    //center: pt,
                    //radius: 3,
                    //fillColor: 'red'
                //});
            //});
            return pts;
        });

	for (let i = 0; i < guidePoints[0].length; i++) {
	    let cLine = new Path();
	    cLine.moveTo(guidePoints[0][i]);
	    cLine.lineTo(guidePoints[1][i]);
	    cLine.lineTo(guidePoints[2][i]);
	    cLine.lineTo(guidePoints[3][i]);
	    cLine.closePath();
            //cLine.fullySelected = true;
            cLine.fillColor = getColor();
	}


	// Create drawing
	view.draw();
    };
};

canvasSketch(sketch, settings);
