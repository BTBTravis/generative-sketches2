import * as utils from './artUtils';
const path = require('path');
const canvasSketch = require('canvas-sketch');

const settings = {
    dimensions: [ 512, 512 ]
};


const colCount = 11;

function drawGrid(i, letters) {
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
        l.translate(new Point(l.bounds.center.x * -1, l.bounds.center.y * -1));
        l.translate(new Point(g.bounds.center.x, g.bounds.center.y - 35));
        l.scale(0.70, l.bounds.bottomCenter);
        //gg.addChild(g);
        gg.addChild(l);
        //grid.children[i] = gg;
    });

    i.remove();
    return {
        placedLetters: gg,
        placedKeys: grid
    };
}

function loadAsset(p) {
    return new Promise((res, rej) => {
        const lettersSVG = paper.project.importSVG(path.resolve(__dirname, 'assets/' + p), (svg) => {
            res(svg);
        });
    });
}

function perspectiveWarp(raster) {
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
                let j = 0;
                letters.children.forEach((l, i) => {
                    if (l.bounds.width + l.bounds.height > 100) {
                        l.remove();
                    }
                });

                const rasterLetters = letters.children.map(l => {
                    const raster = l.rasterize();
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
                }

                const xxx = [...rasterLetters.filter((l, i) => !indexsToRemove.includes(i)), ...comboLetters];
                project.clear();
                const warps = xxx.map((r) => {
                    return perspectiveWarp(r);
                });
                project.clear();
                utils.shuffle(warps);
                const { placedLetters, placedKeys } = drawGrid(key, warps);
                console.log({ placedLetters, placedKeys });
                //const sortFn = (a,b) => {
                    //const changeInX = a.bounds.centerX - b.bounds.centerX;
                    //const changeInY =  a.bounds.centerY - b.bounds.centerY;
                    //if (changeInY < 0 && changeInX < 0) {
                        //return 1;
                    //} else if (changeInY < 0) {
                        //return 0;
                    //} else {
                        //return -1;
                    //}

                //};
                //placedKeys.children.sort(sortFn);
                //placedLetters.children.sort(sortFn);
                //for (let i = 0; i < 50; i++) {
                   //placedKeys.children[i].remove();
                    ////placedObjs.addChild(new Group(placedKeys.children[i], placedLetters.children[i]));
                //}
                const placedObjs = new Group();
                placedLetters.children.reverse();
                placedKeys.children.reverse();
                for (let i = 0; i < 103; i++) {
                    const letter = placedLetters.children[103 - i];
                    const key = placedKeys.children[103 - i];
                    placedObjs.addChild(new Group([key, letter]));
                }
                console.log({placedObjs});
                const controlKeys = [
                    'q',
                    'w',
                    'e',
                    'r',
                    't',
                    'y',
                    'u',
                    'i',
                    'o',
                    'p',
                    'a',
                    's',
                    'd',
                    'f',
                    'g',
                    'h',
                    'j',
                    'k',
                    'l',
                    'z',
                    'x',
                    'c',
                    'v',
                    'b',
                    'n',
                    'm'
                ];
                const assignedIndexs = new Set();
                const getIndex = () => {
                    const randomIndex = utils.r(0,103);
                    if (!assignedIndexs.has(randomIndex)) {
                        assignedIndexs.add(randomIndex);
                        return randomIndex;
                    }
                    else {
                       return getIndex();
                    }
                };
                const controlKeysIndexPairs = controlKeys.reduce((carry, letter) => {
                    carry[letter] = getIndex();
                    return carry;
                }, {});
                console.log({controlKeysIndexPairs});
                const up = new Set();
                const down = new Set();
                document.addEventListener('keydown', (event) => {
                    const i = controlKeysIndexPairs[event.key];
                    if (!down.has(i)) {
                        down.add(i);
                        const movementVector = new Point(0, 50);
                        placedObjs.children[i].translate(movementVector);
                        //placedLetters.children[i].translate(movementVector);
                        //placedKeys.children[i].translate(movementVector);
                        up.delete(i);
                    }
                });

                document.addEventListener('keyup', (event) => {
                    const i = controlKeysIndexPairs[event.key];
                    if (!up.has(i)) {
                        up.add(i);
                        const movementVector = new Point(0, -50);
                        placedObjs.children[i].translate(movementVector);
                        //placedLetters.children[i].translate(movementVector);
                        //placedKeys.children[i].translate(movementVector);
                        down.delete(i);
                    }
                });

            });

        utils.paperJsDraw();
    };
};

canvasSketch(sketch, settings);
