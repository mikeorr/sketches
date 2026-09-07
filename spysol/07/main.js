import * as rs from "./random.js";

// Animation frame throttles in milliseconds, fastest to slowest.
const T = [50, 250, 500, 1000];

const FACES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const HUES = [0, 60, 120, 180, 300];  // red, yellow, green, blue, purple.
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const ROW_CARD_COUNTS = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];
const SUITS = [1, 2, 1, 2, 1, 2, 1, 2];


class SpyCard extends Element {
    constructor() {
        super();
    }
}

customElements.define("spy-card", SpyCard);


// Initialize game.
function initialize() {
}


if (document.readyState === "complete") {
    initialize();
} else {
    document.addEventListener("DOMContentLoaded", initialize, {once: true});
}
