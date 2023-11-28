// Lamppost game

let board_size = 30;
let home_pos = Math.ceil(board_size / 2);

const lamppost_char = "L";
const visit_char = "\u{B7}";   // MIDDLE DOT.
const test_char = ".";
const direction_chars = [
    "\u{21d1}",   // 0: North:     UPWARDS DOUBLE ARROW.
    "\u{21d7}",   // 1: Northeast: NORTH EAST DOUBLE ARROW.
    "\u{21d2}",   // 2: East:      RIGHTWARDS DOUBLE ARROW.
    "\u{21d8}",   // 3: Southeast: SOUTH EAST DOUBLE ARROW.
    "\u{21d3}",   // 4: South:     DOWNWARDS DOUBLE ARROW.
    "\u{21d9}",   // 5: Southwest: SOUTH WEST DOUBLE ARROW.
    "\u{21d0}",   // 6: West:      LEFTWARDS DOUBLE ARROW.
    "\u{21d6}",   // 7: Northwest: NORTH WEST DOUBLE ARROW.
];

let position = {x: home_pos, y: home_pos};   // Current position.
let steps = 0;   // Count steps.
let throttle = 500;   // Delay between steps. 1000 = 1 second.

let dom = {};
let initialized = false;

function init() {
    if (!initialized) {
        dom.board = document.querySelector(".board");
        dom.toolbar = document.querySelector(".toolbar")
        dom.message = document.querySelector(".message")
        dom.steps = document.getElementById("steps");
        let world = document.createElement("table");
        world.classList.add("world");
        let x, y, row;
        for(y = 0; y <= board_size; y++) {
            row = world.insertRow();
            for(x = 0; x <= board_size; x++) {
                row.insertCell();
            }
        }
        dom.board.append(world);
        dom.world = world;
        initialized = true;
        start();
    }
}

function start() {
    let row, cell, home;
    for (row of dom.world.rows) {
        for (cell of row.cells) {
            cell.innerText = "";
            cell.clasName = "";
        }
    }
    home = dom.world.rows[home_pos].cells[home_pos];
    home.classList.add("home");
    home.innerText = lamppost_char;
    position = {x: home_pos, y: home_pos};
    steps = 0;
    setTimeout(step, throttle);
}

function step() {
    let direction;
    let cell;
    dom.world.rows[position.y].cells[position.x].classList.remove("current");
    direction = Math.floor(Math.random() * 8);
    switch (direction) {
        case 0:   // North
            position.y--;
            break;
        case 1:   // Northeast.
            position.x++;
            position.y--;
            break;
        case 2:   // East.
            position.x++;
            break;
        case 3:   // Southeast.
            position.x++;
            position.y++;
            break;
        case 4:   // South.
            position.y++;
            break;
        case 5:   // Southwest.
            position.x--;
            position.y++;
            break;
        case 6:   // West.
            position.x--;
            break;
        case 7:   // Northwest.
            position.x--;
            position.y--;
            break;
    }
    dom.steps.innerText = ++steps;
    if (position.x == home_pos && position.y == home_pos) {
        won();
    } else {
        cell = dom.world.rows[position.y]?.cells[position.x];
        if (cell) {
            cell.classList.add("current");
            cell.innerText = visit_char;
            //cell.innerText = direction_chars[direction];
            setTimeout(step, throttle);
        } else {
            lost();
        }
    }
}

function won() {
    dom.message.innerText = "Won.";
}

function lost() {
    dom.message.innerText = "Lost.";
}

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
