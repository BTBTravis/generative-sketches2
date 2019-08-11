import * as utils from './artUtils';
const path = require('path');
const canvasSketch = require('canvas-sketch');

const settings = {
    dimensions: [ 512, 512 ]
};


const colCount = 11;

function drawGrid(i, letters) {
    console.log({i, letters});
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

    console.log({grid});

    // add letters
    const gg = new Group();
    grid.children.forEach((g, i) => {
        const l = letters[i];
        //l.bringToFront();
        //console.log({g, l, i});
        l.translate(new Point(l.bounds.center.x * -1, l.bounds.center.y * -1));
        l.translate(new Point(g.bounds.center.x, g.bounds.center.y - 35));
        l.scale(0.70, l.bounds.bottomCenter);
        //l.translate(g.bounds.center);
        //g.addChild(l);
        //console.log({g});
        //l.bringToFront();
        //l.fullySelected = true;
        //l.bringToFront()
        //l.addTo(g);

        //console.log('g: ', g);
        //const l = letters[i];
        //console.log({l});
        //g.addChild(l);
        gg.addChild(l);
    });

    i.remove();
}

function loadAsset(p) {
    return new Promise((res, rej) => {
        const lettersSVG = paper.project.importSVG(path.resolve(__dirname, 'assets/' + p), (svg) => {
            res(svg);
        });
    });
}

function perspectiveWarp(raster) {
    //const keep = new Group();
    //keep.addChild(raster);
    //rasterLetter.scale(1);
    //rasterLetter.fullySelected = true;
    const letterParts = new Group();
    for (let i = 0; i < raster.bounds.height; i++) {
        const part = raster.getSubRaster(new Rectangle([0, i], [raster.bounds.width * 2, i + 1]));
        letterParts.addChild(part);
    }

    letterParts.children.reverse();
    letterParts.children.forEach((l, i) => {
        // og 2
        const scale =  .95 / 40 * (i - 0) + 1;
        l.scale(scale, 1, l.bounds.center);
    });
    const partsFinal = letterParts.rasterize();
    letterParts.remove();
    raster.remove();
    return partsFinal;
}

const sketch = () => {
    return ({ context, width, height }) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
        utils.initPaperJs();

        Promise.all([loadAsset('key.svg'), loadAsset('letters.svg')])
            .then(([key, letters]) => {
                const ogLayer = project.layers[0];

                console.log({letters});
                let j = 0;
                letters.children.forEach((l, i) => {
                    if (l.bounds.width + l.bounds.height > 100) {
                        l.remove();
                    }
                });

                const rasterLetters = letters.children.map(l => {
                    const raster = l.rasterize();
                    //raster.fullySelected = true;
                    ogLayer.addChild(raster);
                    return raster;
                });
                letters.remove();

                const indexsToRemove = [];
                const comboLetters = [];
                for(let i = 1; i < rasterLetters.length; i++) {
                    const length = rasterLetters[i].bounds.center.subtract(rasterLetters[i - 1].bounds.center).length;
                    if (length < 40) {
                        const combo = new Group();
                        combo.addChild(rasterLetters[i]);
                        combo.addChild(rasterLetters[i - 1]);
                        const r = combo.rasterize();
                        combo.remove();
                        comboLetters.push(r);
                        indexsToRemove.push(i);
                        indexsToRemove.push(i - 1);
                    }
                    //rasterLetters[i].fullySelected = true;
                    //console.log({length, a: rasterLetters[i].bounds.center, b: rasterLetters[i - 1].bounds.center});
                }

                const xxx = [...rasterLetters.filter((l, i) => !indexsToRemove.includes(i)), ...comboLetters];
                console.log({xxx});
                project.clear();
                const warps = xxx.map((r) => {
                    return perspectiveWarp(r);
                });
                project.clear();
                //letters.remove();

                utils.shuffle(warps);
                drawGrid(key, warps);
                //warps.forEach(x => ogLayer.addChild(x));
                //warps.forEach(x => x.bringToFront());
            });

        utils.paperJsDraw();
    };
};

canvasSketch(sketch, settings);
