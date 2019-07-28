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

const sketch = () => {
    return ({ context, width, height }) => {
	context.fillStyle = 'white';
	context.fillRect(0, 0, width, height);
	paper.install(window);
	// Setup directly from canvas id:
	paper.setup(document.querySelector('canvas'));
	//var path = new Path();
	//path.strokeColor = 'black';

	var vector = new Point({
	    angle: 45,
	    length: 512 / 6
	});
	var guide1 = new Path();
	guide1.segments = [
	    [[256, -250], null, vector.rotate(0)],
	    [[256, 200], vector.rotate(180), null],
	];
	guide1.strokeColor = 'black';

        const otherGuideAngles = [ 90, 180, 270 ];
        let guideLines = otherGuideAngles.map(d => {
            let g = guide1.clone();
            g.rotate(d, view.center);
            return g;
        });
        guideLines.push(guide1);
        const guidePoints = guideLines.map(l => {
            let pts = [];
            var offset = l.length / 6;
            for (let i = 0; i <= 6; i++) {
                // Find the point on the path:
                pts.push(l.getPointAt(offset * i));
            }
            pts.forEach(pt => {
                let circle = new Path.Circle({
                    center: pt,
                    radius: 3,
                    fillColor: 'red'
                });
            });
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
            //cLine.fillColor = getColor();
	}




	//path.fullySelected = true;


//project.currentStyle.fillColor = 'black';
//for (var i = 0; i < 3; i++) {
	//var segment = path.segments[i];
	//var text = new PointText({
		//point: segment.point - [0, 10],
		//content: i,
		//justification: 'center'
	//});
//}


// Call onMouseMove once to correctly position the text items:
onMouseMove({ point: view.center - vector.rotate(-90) });


        // TODO: 4 arrays of guide points
	// TODO: connect the guide points

        // TODO: connectin
	//var start = new Point(512, 512);
	var start = new Point(0, 0);
	path.moveTo(start);
	path.lineTo(new Point(256, 256));
	path.lineTo(new Point(0, 512));
	//path.lineTo(start.add([ 0, -512 ]));



	// Create drawing
	view.draw();
    };
};

canvasSketch(sketch, settings);
