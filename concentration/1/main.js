import random from "./random.js";

const PRIZES = [
        "☀", "☂", "⛟", "☎", "☜", "☝","☞", "☟", "☠", "☯",
        "☢", "♂", "♀",  "⚖", "⛲", "⛵", "✈", "🪀", "🪁", "☘",
        "☃", "⚓", "⚀", "⚁","⚂", "⚃", "⚄", "⚅", "☑", "☒",
];
const LAYOUTS = [
    Array(PRIZES.length).fill(2),
    Array(20).fill(2),
    [0, 0, 0, 2],
];

const params = new URLSearchParams(document.location.search);  // Query params.

let goal = 0;       // How many points to win.
let layout = 1;     // Which layout to use. Subscript/key of 'LAYOUTS'.
let rooms = null;   // Array of all rooms. Initialized by `createRooms`.
let room1 = null;   // First selected room of potential pair.
let room2 = null;   // Second selected room of potential pair.
let initialized = false;  // Has 'initialized()' been called?
let peek = false;   // Make prizes visible through closed doors.
let points = 0;

// Debugging options.
//
// Query param 'n=1' (no shuffle) to keep prize pairs sorted in adjacent rooms.
let shuffle = ! params.get("n");

function create(name, ...classes) {
    let el;
    el = document.createElement(name);
    el.classList.add(...classes);
    return el;
}

function getPrizes() {
    const counts = LAYOUTS[layout];
    let i, j, count, prize, prizes;
    prizes = [];
    for (i=0; i < counts.length; i++) {
        count = counts[i];
        prize = PRIZES[i];
        for (j=1; j <= count; j++) {
            prizes.push(prize);
        }
    }
    return prizes;
}

function newGame() {
    let room, prize, prizes, tableau;
    prizes = getPrizes();
    if (shuffle) {
        random.shuffle(prizes);
    }
    rooms = [];
    for (prize of prizes) {
        room = create("data", "room");
        room.dataset.prize = prize;
        room.dataset.state = "closed";
        room.addEventListener("click", onClickRoom);
        rooms.push(room);
    }
    tableau = create("div", "tableau");
    tableau.id = "tableau";
    tableau.append(...rooms);
    document.getElementById("tableau_ctr").replaceChildren(tableau);
    room1 = null;
    room2 = null;
    points = 0;
    goal = rooms.length / 2;
    renderScore();
    renderWon(false);
}

function checkRoomPair() {
    const prize1 = room1.dataset.prize;
    const prize2 = room2.dataset.prize;
    const captured = prize1 && prize2 && prize1 === prize2;
    if (captured) {
        room1.dataset.state = "";
        room2.dataset.state = "";
        points++;
        renderScore();
        if (points >= goal) {
            renderWon(true);
        }
    } else {
        room1.dataset.state = "closed";
        room2.dataset.state = "closed";
    }
    room1 = null;
    room2 = null;
}

function renderScore() {
    const progress = document.getElementById("progress");
    const score = document.getElementById("score");
    const text = `Score = ${points} / ${goal}`;
    score.innerText = text;
    progress.min = 0;
    progress.max = goal;
    progress.value = points;
}

function renderWon(won) {
    document.getElementById("won").hidden = !won;
    document.getElementById("tableau_ctr").hidden = won;
}

function onClickRoom(event) {
    const room = event.target;
    room.dataset.state = "open";
    if (!room1) {
        room1 = room;

    } else {
        room2 = room;
        setTimeout(checkRoomPair, 1000);
    }
}

function onClickPeek(event) {
    peek = event.target.checked;
    document.querySelector("main").classList.toggle("peek", peek);
}

function init() {
    if (!initialized) {
        const elNew = document.getElementById("btn-new")
        const elPeek = document.getElementById("ck-peek")
        elNew.addEventListener("click", newGame);
        elPeek.addEventListener("click", onClickPeek);
        elPeek.checked = peek;
        initialized = true;
        newGame();
    }
}

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init, {once: true});
}
