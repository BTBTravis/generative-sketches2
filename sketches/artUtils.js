const paper = require('paper');

export const defaultSize = [512, 512];

export function initPaperJs() {
    paper.install(window);
    paper.setup(document.querySelector('canvas'));
}

export function paperJsDraw() {
    view.draw();
}

/* Get random number in rage
 * @param {int} min - bottom of range
 * @param {int} max - top of range
 *
 * @return {int} random number within range
 */
export function r(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 *
 * @return {Array} shuffled array
 */
export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
