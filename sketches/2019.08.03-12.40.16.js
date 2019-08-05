import * as utils from './artUtils';
const path = require('path');
const canvasSketch = require('canvas-sketch');

const settings = {
    dimensions: [ 512, 512 ]
};

const keysJson = `["~","!","@","#","$","%","^","&","*","(",")","_","+","1","2","3","4","5","6","7","8","9","0","-","=","q","w","e","r","t","y","u","i","o","p","[","]","a","s","d","f","g","h","j","k","l",";","z","x","c","v","b","n","m",",",".","?","Q","W","E","R","T","Y","U","I","O","P","{","}",":","L","K","J","H","G","F","D","S","A","Z","X","C","V","B","N","M","<",">"]`;
let keys = JSON.parse(keysJson);
for (let i = 0; i < 16; i++) {
    keys.push((i + 10).toString());
}
//keys = utils.shuffle(keys);

//console.log(keys.reduce((i, carry) => {
    //return i + '  ' + carry;
//}));



//document.addEventListener('keypress', (event) => {
//keys.add(event.key);
//});

const colCount = 11;

function handleSVGLoad(i) {
    //console.log('i: ', i);
}

function tilt(l) {
    const og = l.bounds.bottomCenter;
    const segs = l.segments.map(s => {
        const mv = (x, y) => {
            const scale = Math.abs(y - og.y) / 20;
            const diff = Math.abs(x - og.x);
            if (x != og.x && scale > 1) {
                if (x > og.x) {
                    return [og.x + (diff * scale), y];
                } else {
                    return [og.x - (diff * scale), y];
                }
            }
            return [x, y];
        };
        return new Segment({
            point: mv(s.point.x, s.point.y),
            handleOut: mv(s.handleOut.x, s.handleOut.y),
            handleIn: [s.handleIn.x, s.handleIn.y],
        });
    });
    let p = new Path({
        fillColor: 'black',
        //fullySelected: true
    });
    p.addSegments(segs);
    //l.remove();
    l.fillColor = 'pink';
    console.log('segs: ', segs[0]);
    console.log('l.segments', l.segments[0]);
    console.log('p: ', p);
    return p;
}

function drawGrid(i) {
    //const keyWidth = i.bounds.width;
    //const maxWidth = view.bounds.width / colCount;
    //const scale = 1 / (keyWidth / maxWidth);
    //const key1 = i.clone();
    //key1.translate(new Point(252, 256));
    //key1.scale(.25);
    i.scale(.45);
    i.translate(new Point(-190, -100));
    const grid = new Group();
    for(let row = 0; row < 13; row++) {
        for(let col = 0; col < 8; col++) {
            const key = i.clone();
            key.translate(new Point(col * 135, row * 80));
            grid.addChild(key);
        }
    }

    //console.log(grid);

    // add letters
    grid.children.forEach((g, i) => {
        //console.log('g: ', g);
        var txt = new PointText({
            point: g.bounds.center.add(new Point(0, -20)),
            content: keys[i],
            fillColor: 'black',
            justification: 'center',
            fontWeight: 'bold',
            fontSize: 30
        });
        tilt(txt);
        //console.log('txt: ', txt);
        //txt.shear(1, 0, txt.bounds.bottomCenter);
        //txt.skew(40, 0, txt.bounds.center);
        //txt.skew(40, 0, txt.bounds.bottomCenter);
        //txt.fullySelected = true;
        g.addChild(txt);
    });

    i.remove();
    console.log('grid: ', grid);

}

function loadAsset(p) {
    return new Promise((res, rej) => {
        const lettersSVG = paper.project.importSVG(path.resolve(__dirname, 'assets/' + p), (svg) => {
            res(svg);
        });
    });
}

const sketch = () => {
    return ({ context, width, height }) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
        utils.initPaperJs();

        Promise.all([loadAsset('key.svg'), loadAsset('letters.svg')])
            .then(([key, letters]) => {
                const g = new Group();
                //const l = letters.children[65].copyTo(g);
                const letters1 = utils.shuffle(letters.children);
                const tiltedLetters = letters1.map(l => {
                    if (l._type == 'rectangle') return null;
                    if (l.className == 'CompoundPath') {
                        const subPaths = l.children.map(path => tilt(path));
                        return new CompoundPath({
                            children: [...subPaths],
                            fillColor: 'black'
                        });
                    }
                    console.log({l});
                    l.copyTo(g);
                    return tilt(l);
                });
                //l.scale(4);
                //l.fullySelected = true;
                letters.remove();
                key.remove();
		//l.segments[1].transform(new Matrix(1, 1, 1, 1, 1, 1));
		//l.segments
		    //l.transform(new Matrix(1, 1, 0, 0, -10, 0));
		//l.segments.forEach(s => {
		//});


                //lMatrix(a, b, c, d, tx, ty)
                // drawGrid(key);
            });


        utils.paperJsDraw();
    };
};

canvasSketch(sketch, settings);
