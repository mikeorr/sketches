import * as rs from "./random.js";

// Animation frame throttles in milliseconds, fastest to slowest.
const T = [50, 250, 500, 1000];

const SHIP = "&#128674;";

// Initialized in 'initialize()'.
let DOM = {};   // Certain DOM elements.
let initialized = false;   // True if initialized.
let y = null;   // YachtModel.

// Initialized in 'startRound()'.
let dice;
let roll;
let round;
let selected;


class YachtDieElement extends HTMLElement {
    _value;

    constructor() {
        super();
        this.addEventListener("click", onClickDie);
    }

    get value() { return this._value; }

    set value(value) {
        this._value = value;
        this.setAttribute("value", value);
        this.innerText = this.getDieFace(value);
    }

    getDieFace(value) {
        if (Number.isInteger(value) && value >= 1 && value <= 6) {
            return String.fromCodePoint(9856 + value - 1);
        } else {
            return "";
        }
    }

    get rolling()     { return this.hasAttribute("rolling"); }
    set rolling(yes)  { return this.toggleAttribute("rolling", yes); }

    get selected()    { return this.hasAttribute("selected"); }
    set selected(yes) { return this.toggleAttribute("selected", yes); }

}

customElements.define("yacht-die", YachtDieElement);


class YachtUI {
    tray     = document.getElementById("tray");
    btn_roll = document.getElementById("btn-roll");
    info_msg = document.getElementById("info");
    dice = this.createTrayDice();

    constructor() {
        this.tray.replaceChildren(...this.dice);
        this.btn_roll.addEventListener("click", onClickRoll);
    }

    createTrayDice() {
        let i, dice, die;
        dice = [];
        for (i=0; i<=4; i++) {
            die = document.createElement("yacht-die");
            die.addEventListener("click", onClickDie);
            dice.push(die);
        }
        return dice;
    }

    info(message) {
        this.info_msg.innerHTML = message;
    }

    hideAllDice() {
        this.dice.forEach(x => x.rolling = true);
    }

}


function initialize() {
    y = new YachtUI();
    startGame();
}

function startGame() {
    round = 0;
    startRound();
}

function startRound() {
    dice = [0, 0, 0, 0, 0];
    roll = 0;
    y.hideAllDice();
    y.info("Press 'Roll' to start game.");
}


function rollDie() {
    return rs.random.randRange(1, 6);
}

function rollDice() {
    let i, timeout, value;
    round++;
    const throttle = T[2];
    y.info("");
    timeout = 0;
    for (i=0; i<=4; i++) {
        if ( (round === 1) || y.dice[i].selected) {
            timeout += throttle;
            value = rollDie();
            dice[i] = value;
            y.dice[i].rolling = true;
            y.dice[i].selected = false;
            y.dice[i].value = value;
            setTimeout(showDie, timeout, i);
        }
    }
}

function showDie(i) {
    y.dice[i].rolling = false;
}

function onClickDie(e) {
    e.target.selected = !e.target.selected;
}

function onClickRoll(e) {
    rollDice();
}

if (document.readyState === "complete") {
    initialize();
} else {
    document.addEventListener("DOMContentLoaded", initialize, {once: true});
}
