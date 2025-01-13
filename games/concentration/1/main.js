import * as rs from "./random-seedable/index.js";

const FACES = [
        "☀", "☂", "☃", "⛟", "☎", "☜", "☝","☞", "☟", "☠",
        "☯", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅", "☑", "☒", "☘",
        "☢", "♂", "♀", "⚓", "⚖", "⛲", "⛵", "✈", "🪀", "🪁",
];

// Animation frame throttles in milliseconds, fastest to slowest.
const T = [50, 250, 500, 1000];

let initialized = false;  // Has 'initialized()' been called?
let points = 0;

function newGame() {
    const main = document.querySelector("main");
    let cell, cell2, face, lastID;
    document.getElementById("won").hidden = true;
    document.getElementById("points").innerText = 0;
    document.getElementById("progress").value = 0;
    lastID = 0;
    for (let face of FACES) {
        for (let it = 1; it <= 2; it++) {
            cell = document.createElement("span");
            cell.id = ++lastID;
            cell.classList.add("Cell", "face");
            cell.dataset.value = face;
            cell.innerHTML = face;
            main.append(cell);
        }
    }
}

function init() {
    if (!initialized) {
        newGame();
        document.getElementById("btn-new")
            .addEventListener("click", newGame);
        initialized = true;
    }
}

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init, {once: true});
}
