import * as rs from "./random.js";

// Animation frame throttles in milliseconds, fastest to slowest.
const T = [50, 250, 500, 1000];

const HUES = [0, 60, 120, 180, 300];  // red, yellow, green, blue, purple.
const MAX_POINTS = 8;  // How many points to win.
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const ROW_CARD_COUNTS = [5, 5, 5, 5, 4, 4, 4, 4, 4, 4];

let DOM = null;   // Certain DOM elements, initialized by 'init()'.
let initialized = false;  // Has 'initialized()' been called?

// Game state. Reset by 'newGame()',
let points = 0;
let stock = [];   // `[card]`.


// Initialize Spysol.
function init() {
    if (!initialized) {
        DOM = {
            btn_colors: document.getElementById("btn-colors"),
            btn_draw:   document.getElementById("btn-draw"),
            btn_new:    document.getElementById("btn-new"),
            model1:     document.getElementById("model1"),
            model2:     document.getElementById("model2"),
            points:     document.getElementById("points"),
            progress:   document.getElementById("progress"),
            stock:      document.getElementById("stock"),
            tableau:    document.getElementById("tableau"),
            won:        document.getElementById("won"),
            rows:       null,
        };
        DOM.model1.replaceChildren( ...createModelSuit(1) );
        DOM.model2.replaceChildren( ...createModelSuit(2) );
        newGame();
        DOM.btn_colors.addEventListener("click", changeColors);
        DOM.btn_draw.addEventListener("click", onDraw);
        DOM.btn_new.addEventListener("click", newGame);
        initialized = true;
    }
}

// Start a new game.
function newGame() {
    let rcc;
    points = 0;
    stock = createDeck();
    rs.random.shuffle(stock);
    DOM.rows = ROW_CARD_COUNTS.map(createRow);
    DOM.tableau.replaceChildren(...DOM.rows);
    changeColors();
    renderAll();

}


// Create DOM elements.

function createRow(row_card_count) {
    let row;
    row = document.createElement("div");
    row.classList.add("row");
    row.addEventListener("dragover", onDragOver);
    row.addEventListener("drop", onDrop);
    row.append( ...stock.splice(0, row_card_count) );
    return row;
}

function createCard(suit, rank) {
    let card;
    card = document.createElement("div");
    card.suit = suit;   // non-dom attribute.
    card.rank = rank;   // non-dom attribute.
    card.classList.add("card", `rank${rank}`, `suit${suit}`);
    card.innerText = rank;
    return card;
}

function createDraggableCard(suit, rank, id) {
    let card = createCard(suit, rank);
    card.id = `card-${id}`;
    card.draggable = true;
    card.addEventListener("dragstart", onDragStart);
    return card;
}

function createModelSuit(suit) {
    return RANKS.slice().reverse().map( rank => createCard(suit, rank) );
}

function createDeck() {
    const suits = [1, 2, 1, 2, 1, 2, 1, 2];
    let card, deck, lastID, rank, suit;
    deck = [];
    lastID = 0;
    for (suit of suits) {
        for (rank of RANKS) {
            card = createDraggableCard(suit, rank, ++lastID);
            deck.push(card);
        }
    }
    return deck;
}


// UI DOM methods.

function changeColors() {
    const hues = rs.random.shuffle(HUES).slice(0, 2);
    document.documentElement.style.setProperty("--hue1", hues[0]);
    document.documentElement.style.setProperty("--hue2", hues[1]);
}

function clear() {
    document.getElementById("won").hidden = true;
    document.getElementById("stock").innerText = 0;
    document.getElementById("btn-draw").disabled = true;
    document.getElementById("points").innerText = 0;
    document.getElementById("progress").value = 0;
}

function renderAll() {
    showWon(false);
    renderDraw();
    renderScore();
}

function renderDraw() {
    //DOM.stock.innerText = Math.round( stock.length / 7 );
    DOM.stock.innerText = stock.length;
    DOM.btn_draw.disabled = !stock.length;
}

function renderScore() {
    DOM.points.innerText = points;
    DOM.progress.value = points;
}

function showWon(value) {
    DOM.won.hidden = !value;
}

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
    if (cards.length !== 13) {
        return false;
    }
    const suit = cards[0].suit;
    if (! ( cards.every( x => x.suit === suit ) ) ) {
        return false;
    }
    return (
        (cards[0].rank === 13) &&
        (cards[1].rank === 12) &&
        (cards[2].rank === 11) &&
        (cards[3].rank === 10) &&
        (cards[4].rank === 9) &&
        (cards[5].rank === 8) &&
        (cards[6].rank === 7) &&
        (cards[7].rank === 6) &&
        (cards[8].rank === 5) &&
        (cards[9].rank === 4) &&
        (cards[10].rank === 3) &&
        (cards[11].rank === 2) &&
        (cards[12].rank === 1) );
}

function promote1(hand) {
    hand.forEach(card => card.remove() );
    setTimeout(promote2, T[3]);
}

function promote2() {
    points++;
    renderScore();
    if (points == MAX_POINTS) {
        setTimeout(showWon, T[3], true);
    }

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
    let card, id, row;
    for (row of DOM.rows) {
        card = stock.shift();
        if (card) {
            row.append(card);
        }
    }
    renderDraw();
}



if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init, {once: true});
}
