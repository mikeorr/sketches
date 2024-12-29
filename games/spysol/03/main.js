import * as rs from "./random-seedable/index.js";

// Animation frame throttles in milliseconds, fastest to slowest.
const T = [50, 250, 500, 1000];

const HUES = [0, 60, 120, 180, 300];  // red, yellow, green, blue, purple.
const LEVELS = [85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25];  // Lightest to darkest.
const MAX_ID = 104;   // Card ID range 1 - 104.
const MAX_POINTS = 8;  // How many points to win.

let DOM = {};
let hues = HUES.slice(0, 2);   // [suit 1 hue, suit 2 hue]
let initialized = false;  // Has 'initialized()' been called?
let isShowRank = true;
let lastID = 0;  // Last card ID number, to generate card IDs for dragging.
let points = 0;
let stock = [];   // [card ID].

class ColorManager {
    HUES = [0, 60, 120, 180, 300];  // red, yellow, green, blue, purple.
    LEVELS = [85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25];  // Lightest to darkest.

    constructor() {
        this.change();
    }

    change() {
        this.hues = rs.random.shuffle(HUES).slice(0, 2);
        document.querySelectorAll("li.card").forEach(this.changeCard.bind(this));
    }

    changeCard(card) {
        card.style.backgroundColor = this.getCardColor(card);
    }

    getCardColor(card) {
        const hue = this.hues[card.suit - 1];
        const level = this.LEVELS[card.rank - 1];
        const color = `hsl(${hue}deg 100% ${level}%)`;
        return color;
    }

}

const colors = new ColorManager();


function createCard(id=1, series="", draggable=false) {
    const sr = (id - 1) % 26;          // 0-12 = suit 1, 13-25 = suit 2.
    const rank = (sr % 13) + 1;        // Rank 1-12.
    const suit = (sr >= 13) ? 2 : 1;   // Suit 1 or 2.
    let card;
    card = document.createElement("li");
    card.suit = suit;   // Non-DOM attribute.
    card.rank = rank;   // Non-DOM attribute.
    card.dataset.suit = suit;
    card.dataset.rank = rank;
    card.id = `card-${++lastID}`;
    card.classList.add("card");
    card.innerText = rank;
    colors.changeCard(card);
    if (draggable) {
        card.draggable = true;
        card.addEventListener("dragstart", onDragStart);
    }
    return card;
}

function createRow(ids, series, dragdrop) {
    ids ||= [];
    series ||= "";
    dragdrop ||= false;
    function cardForId(id) {
        const id_str = `${series}${id}`;
        return createCard(id, id_str, dragdrop);
    }
    let row;
    row = document.createElement("ol");
    row.classList.add("row");
    row.append( ...ids.map(cardForId) );
    if (dragdrop) {
        row.addEventListener("dragover", onDragOver);
        row.addEventListener("drop", onDrop);
    }
    return row;
}

function getCardsToDrop(id) {
    let card = document.getElementById(id);
    let cards = [card];
    while (card = card.nextSibling) {
        cards.push(card);
    }
    return cards;
}

function updateDraw() {
    DOM.stock.innerText = Math.round( stock.length / 10 );
    DOM.draw.disabled = !stock.length;
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
    DOM.points.innerText = points;
    DOM.progress.value = points;
    if (points == MAX_POINTS) {
        setTimeout(won, T[3]);
    }

}

function won() {
    DOM.won.hidden = false;
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
    const rows = DOM.tableau.querySelectorAll("ol.row");
    let card, id, row;
    for (row of rows) {
        id = stock.pop();
        if (!id) {
            break;
        }
        card = createCard(id, "card-", true);
        row.append(card);
    }
    updateDraw();
}

function onShowRanks() {
    isShowRank = !isShowRank;
    document.querySelectorAll("li.card").forEach(changeCardContent);
}


/* Start a new game */

function newGame() {
    let cards, i;
    colors.change();
    stock = [];
    for (i=1; i <= MAX_ID; i++) {
        stock.push(i);
    }
    rs.random.shuffle(stock, true);

    DOM.won.hidden = true;

    // Append tableau rows one at a time to ensure splices don't overlap.
    DOM.tableau.replaceChildren();
    DOM.tableau.append( createRow( stock.splice(0, 5), "card-", true) );
    DOM.tableau.append( createRow( stock.splice(0, 5), "card-", true) );
    DOM.tableau.append( createRow( stock.splice(0, 5), "card-", true) );
    DOM.tableau.append( createRow( stock.splice(0, 5), "card-", true) );
    DOM.tableau.append( createRow( stock.splice(0, 4), "card-", true) );
    DOM.tableau.append( createRow( stock.splice(0, 4), "card-", true) );
    DOM.tableau.append( createRow( stock.splice(0, 4), "card-", true) );
    DOM.tableau.append( createRow( stock.splice(0, 4), "card-", true) );
    DOM.tableau.append( createRow( stock.splice(0, 4), "card-", true) );
    DOM.tableau.append( createRow( stock.splice(0, 4), "card-", true) );

    updateDraw();
}


/* Initialize Spysol */

function init() {
    if (!initialized) {
        const model1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        const model2 = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

        DOM.models = document.getElementById("models");
        DOM.tableau = document.getElementById("tableau");
        DOM.change_colors = document.getElementById("change-colors");
        DOM.show_ranks = document.getElementById("show-ranks");
        DOM.points = document.getElementById("points");
        DOM.progress = document.getElementById("progress");
        DOM.stock = document.getElementById("stock");
        DOM.toggle_numbers = document.getElementById("toggle-numbers");
        DOM.draw = document.getElementById("draw");
        DOM.new_game = document.getElementById("new-game");
        DOM.won = document.getElementById("won");

        DOM.show_ranks.checked = isShowRank;   // Before adding toggle listener.

        DOM.change_colors.addEventListener("click", colors.change.bind(colors));
        DOM.show_ranks.addEventListener("change", onShowRanks);
        DOM.draw.addEventListener("click", onDraw);
        DOM.new_game.addEventListener("click", newGame);

        DOM.models.replaceChildren(
            createRow(model1, "model-", false),
            createRow(model2, "model-", false),
        );

        newGame();

        initialized = true;
    }
}

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init, {once: true});
}
