import * as rs from "./random-seedable/index.js";

// Animation frame throttles in milliseconds, fastest to slowest.
const T = [50, 250, 500, 1000];

const HUES = [0, 60, 120, 180, 300];  // red, yellow, green, blue, purple.
const MAX_POINTS = 8;  // How many points to win.

let DOM = {};
let hues = HUES.slice(0, 2);   // [suit 1 hue, suit 2 hue]
let foundation = [];  // `[card]`.
let initialized = false;  // Has 'initialized()' been called?
let points = 0;
let stock = [];   // `[card]`.

function createCard(prefix, suit, rank, serial, draggable) {
    let card;
    card = document.createElement("li");
    card.suit = suit;   // Non-DOM attribute.
    card.rank = rank;   // Non-DOM attribute.
    card.id = `${prefix}-${suit}-${rank}-${serial}`;
    card.classList.add("card", `rank${rank}`, `suit${suit}`);
    card.innerText = rank;
    if (draggable) {
        card.draggable = true;
        card.addEventListener("dragstart", onDragStart);
    }
    return card;
}

function resetCard(card) {
    card.classList.remove("promoting");
}

class DeckManager {
    static ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    deck = [];

    constructor() {
        const suits = [1, 2];
        const serials = [1, 2, 3, 4];
        let card, suit, rank, serial;
        for (suit of suits) {
            for (rank of this.constructor.ranks) {
                for (serial of serials) {
                    card = createCard("card", suit, rank, serial, true);
                    this.deck.push(card);
                }
            }
        }
    }

    newGame() {
        const rowCardCounts = [5, 5, 5, 5, 4, 4, 4, 4, 4, 4];
        let cards, count, i, row, rows;
        this.deck.forEach(resetCard);
        cards = rs.random.shuffle(this.deck.slice());
        rows = [];
        for (count of rowCardCounts) {
            row = this.createRow();
            row.append( ...cards.splice(0, count) );
            row.addEventListener("dragover", onDragOver);
            row.addEventListener("drop", onDrop);
            rows.push(row);
        }
        return {rows: rows, stock: cards};
    }

    // Create an empty row (an HTML <ol> element).
    createRow() {
        let row;
        row = document.createElement("ol");
        row.classList.add("row");
        return row;
    }

}


class UI {
    initialize() {
        this.DOM = {
            btn_colors: document.getElementById("btn-colors"),
            btn_draw:   document.getElementById("btn-draw"),
            btn_new:    document.getElementById("btn-new"),
            tableau:    document.getElementById("tableau"),
            points:     document.getElementById("points"),
            progress:   document.getElementById("progress"),
            stock:      document.getElementById("stock"),
            won:        document.getElementById("won"),
        }
    }

    changeColors() {
        const hues = rs.random.shuffle(HUES).slice(0, 2);
        document.documentElement.style.setProperty("--hue1", hues[0]);
        document.documentElement.style.setProperty("--hue2", hues[1]);
    }

    showWon(value) {
        this.DOM.won.hidden = !value;
    }

    updateDraw() {
        this.DOM.stock.innerText = Math.round( stock.length / 10 );
        this.DOM.btn_draw.disabled = !stock.length;
    }

    updateScore() {
        this.DOM.points.innerText = points;
        this.DOM.progress.value = points;
    }

}


const dm = new DeckManager();
const ui = new UI();


function getCardsToDrop(id) {
    let card = document.getElementById(id);
    let cards = [card];
    while (card = card.nextSibling) {
        cards.push(card);
    }
    return cards;
}


/* Promotion and winning routines */

// trypromote(cards)
//   Try to promote the last cards in the row if they qualify.
//   Arg row: HTMLOListElement.
//   If the last 13 cards in the row contain a complete suit, chain to the
//   first promotion step.
function tryPromote(row) {
    const cards = Array.from(row.children);
    const count = cards.length;
    if (cards.length >= 13) {
        const hand = cards.slice(cards.length - 13, cards.length);
        if (canPromote(hand)) {
            hand.forEach( card => card.classList.add("promoting") );
            setTimeout(promote1, T[3], hand);
        }
    }

}

// canPromote(cards) -> bool
//   Is this array of cards a complete suit?
function canPromote(cards) {
    if (cards.length != 13) {
        return false;
    }
    const suit = cards[0].suit;
    let rank = 0;
    let card;
    for (card of cards) {
        if (card.rank != ++rank || card.suit != suit) {
            return false;
        }
    return true;
    }
}

function promote1(hand) {
    hand.forEach(card => card.remove() );
    setTimeout(promote2, T[3]);
}

function promote2() {
    points++;
    ui.updateScore();
    if (points == MAX_POINTS) {
        setTimeout(won, T[3]);
    }

}

function won() {
    ui.showWon(true);
}


/* Drag and drop listeners */

function onDragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function onDragOver(ev) {
    ev.preventDefault();
}

function onDrop(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
    const id = ev.dataTransfer.getData("text/plain");
    const cards = getCardsToDrop(id);
    let dst = ev.target;
    // If destination is a card, go up to the ancestor row.
    while (dst && ! dst.classList.contains("row")) {
        dst = dst.parentElement;
    }
    dst.append(...cards);
    tryPromote(dst);
    // TODO: Try promote source row too.
}


/* Other listeners */

function onDraw(ev) {
    const rows = ui.DOM.tableau.querySelectorAll("ol.row");
    let card, id, row;
    for (row of rows) {
        card = stock.pop();
        if (!card) {
            break;
        }
        row.append(card);
    }
    ui.updateDraw();
}


/* Start a new game */

function newGame() {
    // Reset game to initial state.
    ui.showWon(false);
    stock = [];
    foundation = [];
    points = 0;
    ui.updateScore();
    ui.updateDraw();
    ui.DOM.tableau.replaceChildren();

    // Deal the tableau rows and set the stock and UI for a new game.
    const data = dm.newGame();
    stock = data.stock;
    ui.DOM.tableau.replaceChildren(...data.rows);
    ui.updateDraw();
}


/* Initialize Spysol */

function init() {
    if (!initialized) {
        ui.initialize();
        ui.DOM.btn_colors.addEventListener("click", ui.changeColors.bind(ui));
        ui.DOM.btn_draw.addEventListener("click", onDraw);
        ui.DOM.btn_new.addEventListener("click", newGame);
        newGame();
        initialized = true;
    }
}

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init, {once: true});
}
