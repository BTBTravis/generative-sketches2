import { getColor } from './colors';
const path = require('path');

const canvasSketch = require('canvas-sketch');
const paper = require('paper');

const settings = {
    dimensions: [ 512, 512 ]
};
function drawTri(x, y, size, color) {
    const tri = new Path();
    const halfSize = size / 2;
    const ogPt = new Point(x, y);
    const rightPt = new Point(x + halfSize, y);
    const leftPt = new Point(x - halfSize, y);
    let topPt = new Point(x, y - size);
    //topPt += new Point({angle: 60, length: size});
    tri.strokeColor = 'red';
    tri.segments = [ogPt, rightPt, topPt, leftPt];
    tri.closePath();
    //tri.fullySelected = true;

    const outside = new Path({
        segments: [[0,0], [500,0], [500,500],[0,500]],
    });

    outside.closePath();
    //outside.fullySelected = true;
    var finalPath = new CompoundPath({
	children: [ tri, outside ],
	fillColor: color,
	//selected: true
    });
    finalPath.shadowColor = new Color(0, 0, 0, .5);
    finalPath.shadowBlur = 20;
    finalPath.shadowOffset = new Point(1, 1);

    return finalPath;
}

function sortColorsByBrightness(colors) {
    return colors.sort(function(a, b) {
	if (a === null) return 1;
	return a.brightness - b.brightness;
    });
}

const sketch = () => {
    return ({ context, width, height }) => {
	context.fillStyle = 'white';
	context.fillRect(0, 0, width, height);
	paper.install(window);
	paper.setup(document.querySelector('canvas'));


        var bg = new Path.Rectangle(new Point(0,0), new Point(500, 500));
        bg.fillColor = 'black';

	const disk = new Raster(path.resolve(__dirname, 'assets/star_disk.jpg'));
	disk.onLoad = function() {
	    view.setViewSize(500,500);
	    console.log('The image has loaded.');

	    console.log(sensors.map(s => disk.getAverageColor(s)));
	};
	disk.translate(new Point({angle: 0, length: 250}));
	disk.translate(new Point({angle: 90, length: 550}));


	disk.scale(.95);

	const tris = [
	    drawTri(250, 460, 400, getColor()),
	    drawTri(250, 465, 440, getColor()),
	    drawTri(250, 475, 480, getColor()),
	    drawTri(250, 480, 510, getColor()),
	    drawTri(250, 490, 570, getColor()),
	    drawTri(250, 510, 650, getColor()),
	    drawTri(250, 550, 770, getColor()),
	    drawTri(250, 600, 900, getColor())
	];

        let sensors = [
            new Rectangle(new Point(225, 320), new Size(60, 60)),
            new Rectangle(new Point(225, 250), new Size(60, 60)),
            new Rectangle(new Point(225, 180), new Size(60, 60)),
            new Rectangle(new Point(225, 110), new Size(60, 60)),
            new Rectangle(new Point(295, 320), new Size(60, 60)),
            new Rectangle(new Point(155, 320), new Size(60, 60)),
            new Rectangle(new Point(365, 350), new Size(60, 60)),
            new Rectangle(new Point(85, 350), new Size(60, 60)),
        ];

        sensors = sensors.map(r => {
            var path = new Path.Rectangle(r);
	    //path.strokeColor = 'black';
            //path.fullySelected = true;
	    return path;
        });


	view.onFrame = function(event) {
	    disk.rotate(.15);
	    let colors = sensors.map(s => disk.getAverageColor(s));
	    colors = sortColorsByBrightness(colors);
	    tris.forEach((tri, i) => {
		tri.fillColor = colors[i];
	    });

	}
	view.draw();
    };
};

canvasSketch(sketch, settings);
