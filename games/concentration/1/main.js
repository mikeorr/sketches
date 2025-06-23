import random from "./random.js";

const PRIZES = [
        "☀", "☂", "☃", "⛟", "☎", "☜", "☝","☞", "☟", "☠",
        "☯", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅", "☑", "☒", "☘",
        "☢", "♂", "♀", "⚓", "⚖", "⛲", "⛵", "✈", "🪀", "🪁",
];
const GOAL = 30;   // How many points to win. (Number of rooms / 2.)

// Debugging flags, normally false.
const DEBUG_OPEN = false;        // Start with all doors open?
const DEBUG_NO_SHUFFLE = false;  // Don't shuffle prizes to random rooms?

let rooms = null;   // Array of all rooms. Initialized by `createRooms`.
let room1 = null;   // First selected room of potential pair.
let room2 = null;   // Second selected room of potential pair.
let initialized = false;  // Has 'initialized()' been called?
let peek = false;   // Make prizes visible through closed doors.
let points = 0;

function create(name, ...classes) {
    let el;
    el = document.createElement(name);
    el.classList.add(...classes);
    return el;
}

function assertGoalLength(arr, what) {
    const expected = GOAL * 2;
    console.assert(arr.length === expected,
        "Found", arr.length, what, ", expected", expected);
}

function getPrizes(shuffle) {
    let prize, prizes;
    prizes = [];
    for (prize of PRIZES) {
        prizes.push(prize, prize);
    }
    if (shuffle) {
        random.shuffle(prizes);
    }
    return prizes;
}

function newGame() {
    let room, prizes;
    prizes = getPrizes(!DEBUG_NO_SHUFFLE);
    assertGoalLength(prizes, "prizes");
    for (room of rooms) {
        room.dataset.prize = prizes.shift();
        room.dataset.state = DEBUG_OPEN ? "open" : "closed";
    }
    room1 = null;
    room2 = null;
    points = 0;
    renderScore();
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
        if (points >= GOAL) {
            rooms.forEach( room => room.dataset.state = "won" );
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
    const text = `Score = ${points} / ${GOAL}`;
    score.innerText = text;
    progress.min = 0;
    progress.max = GOAL;
    progress.value = points;
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
        let room;
        const elNew = document.getElementById("btn-new")
        const elPeek = document.getElementById("ck-peek")
        rooms = document.querySelectorAll(".room");
        assertGoalLength(rooms, "rooms");
        for (room of rooms) {
            room.addEventListener("click", onClickRoom);
            room.dataset.state = "closed";
        }
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
