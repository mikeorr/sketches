import * as rs from "./random-seedable/index.js";

// Animation frame throttles in milliseconds, fastest to slowest.
const T = [50, 250, 500, 1000];

const HUES = [0, 60, 120, 180, 300];  // red, yellow, green, blue, purple.
const MAX_POINTS = 8;  // How many points to win.

let foundation = [];  // `[card]`.
let initialized = false;  // Has 'initialized()' been called?
let spy = null;   // `Spysol`.
let points = 0;
let stock = [];   // `[card]`.

class Spysol {
    deck = [];
    foundation = [];
    peek = false;
    points = [];
    ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    rowCardCounts = [5, 5, 5, 5, 4, 4, 4, 4, 4, 4];
    stock = [];

    constructor() {
        this.deck = this.makeDeck();
    }

    newGame() {
        const rowCounts = [5, 5, 5, 5, 4, 4, 4, 4, 4, 4];
        this.deal(rowCounts);
    }

    deal(rowCounts) {
        const tableau = document.getElementById("tableau");
        let cards, count, row;
        tableau.replaceChildren();
        this.stock = rs.random.shuffle(this.deck.slice());
        for (count of rowCounts) {
            cards = this.stock.splice(0, count);
            this.unreserve(cards[cards.length - 1]);
            row = this.createRow();
            row.append(...cards);
            row.addEventListener("dragover", onDragOver);
            row.addEventListener("drop", onDrop);
            tableau.append(row);
        }
    }


    // Create an empty row (an HTML <ol> element).
    createRow() {
        let ctr, row;
        row = document.createElement("div");
        row.classList.add("row");
        ctr = document.createElement("div");
        ctr.classList.add("row-ctr");
        ctr.append(row);
        return row;
    }

    togglePeek() {
        this.peek = !this.peek;
        const oldClass = peek ? "reserve" : "peek";
        const newClass = peek ? "peek" : "resereve";
        document.querySelectorAll(".tableau .card")
            .forEach( card => card.classList.replace(oldClass, newClass) );
    }

    // Private logic methods.

    makeDeck() {
        const suits = [1, 2];
        const serials = [1, 2, 3, 4];
        let card, deck, suit, rank, serial;
        deck = [];
        for (suit of suits) {
            for (rank of this.ranks) {
                for (serial of serials) {
                    card = this.createCard(
                        "card", suit, rank, serial, false, true);
                    deck.push(card);
                }
            }
        }
        return deck;
    }


    // Private HTMLElement methods.

    createCard(prefix, suit, rank, serial, draggable, reserve) {
        let card;
        card = document.createElement("div");
        card.suit = suit;   // non-dom attribute.
        card.rank = rank;   // non-dom attribute.
        card.id = `${prefix}-${suit}-${rank}-${serial}`;
        card.classList.add("card", `rank${rank}`, `suit${suit}`);
        card.innerText = rank;
        if (draggable) {
            card.draggable = true;
            card.addEventListener("dragstart", onDragStart);
        }
        if (reserve) {
            card.classList.add("reserve");
        }
        return card;
    }

    unreserve(row) {
        const cards = row.children;
        if (cards.length) {
            let card = cards[cards.length - 1];
            card.classList.remove("reserve", "peek");
            card.draggable = true;
            card.addEventListener("dragstart", onDragStart);
        }
    }


    // UI DOM methods.

    changeColors() {
        const hues = rs.random.shuffle(HUES).slice(0, 2);
        document.documentElement.style.setProperty("--hue1", hues[0]);
        document.documentElement.style.setProperty("--hue2", hues[1]);
    }

    clear() {
        document.getElementById("won").hidden = true;
        document.getElementById("stock").innerText = 0;
        document.getElementById("btn-draw").disabled = true;
        document.getElementById("points").innerText = 0;
        document.getElementById("progress").value = 0;
    }

    getCardsToDrop(card) {
        let cards = [card];
        while (card = card.nextSibling) {
            cards.push(card);
        }
        return cards;
    }

    getRow(cardOrRow) {
        let row = cardOrRow;
        while (row && ! row.classList.contains("row")) {
            row = roe.parentElement;
        }
        return row;
    }

    renderAll() {
        this.showWon(false);
        this.renderDraw();
        this.renderScore();
    }

    renderDraw() {
        document.getElementById("stock").innerText = Math.round( spy.stock.length / 10 );
        document.getElementById("btn-draw").disabled = !spy.stock.length;
    }

    renderScore() {
        document.getElementById("points").innerText = spy.points;
        document.getElementById("progress").value = spy.points;
    }

    showWon(value) {
        document.getElementById("won").hidden = !value;
    }


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
    let rank = 13;
    let card;
    for (card of cards) {
        if (card.rank != rank-- || card.suit != suit) {
            return false;
        }
    return true;
    }
}

function promote1(hand) {
    const row = spy.getRow(hand[0]);
    hand.forEach(card => card.remove() );
    spy.unreserve(row);
    setTimeout(promote2, T[3]);
}

function promote2() {
    spy.points++;
    spy.renderScore();
    if (spy.points == MAX_POINTS) {
        setTimeout(won, T[3]);
    }

}

function won() {
    document.getElementById("won").hidden = false;
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
    const srcCard = document.getElementById(id);
    const srcRow = spy.getRow(card);
    const cardsToDrop = spy.getCardsToDrop(srcCard);
    const dst = spy.getRow(ev.target);
    dst.append(...cardsToDrop);
    spy.unreserve(dst);
    tryPromote(dst);
    // TODO: Try promote source row too.
}


/* Other listeners */

function onDraw(ev) {
    const rows = document.getElementById("tableau").querySelectorAll(".row");
    let card, id, row;
    for (row of rows) {
        card = spy.stock.pop();
        if (!card) {
            break;
        }
        row.append(card);
    }
    spy.renderDraw();
}


/* Start a new game */

function newGame() {
    spy = new Spysol();
    spy.clear();
    spy.changeColors();

    // Deal the tableau rows and set the stock and UI for a new game.
    const rows = spy.newGame();
    spy.renderDraw();
}


/* Initialize Spysol */

function init() {
    if (!initialized) {
        newGame();
        document.getElementById("btn-colors")
            .addEventListener("click", spy.changeColors.bind(spy));
        document.getElementById("btn-draw")
            .addEventListener("click", onDraw);
        document.getElementById("btn-new")
            .addEventListener("click", newGame);
        document.getElementById("btn-peek")
            .addEventListener("click", spy.togglePeek.bind(spy));
        initialized = true;
    }
}

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init, {once: true});
}
