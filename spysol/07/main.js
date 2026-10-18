import * as rs from "./random.js";

// Animation frame throttles in milliseconds, fastest to slowest.
const T = [50, 250, 500, 1000];

const HUES = [0, 60, 120, 180, 300];  // red, yellow, green, blue, purple.
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const ROW_CARD_COUNTS = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];
const SUITS = [1, 2, 1, 2, 1, 2, 1, 2];

class StandardSpec {
    name = "Standard";
    ranks = 13;
    rowSizes = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];
    faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    getFace(suit, rank) {
        return this.faces[rank - 1] || "?";
    }
}


// Custom HTML elements.

// HTML <spy-card suit="1" rank="1" reserve selected>A</spy-card>
// attributes:
//   suit: 1-2
//   rank: 1-13
//   reserve: Card is "face down"; obscure the content so it can't be read.
//   selected: Card is participating in a drag move.
// content: Specified in constructor.
// Note: Font size is inherited from the containing row or ancestor.
class SpyCard extends HTMLElement {
    constructor(suit, rank, face, drag) {
        super();
        this.suit = suit;
        this.rank = rank;
        this.face = face;
        if (drag) {
            this.draggable = true;
            this.addEventListener("dragstart", onDragStart);
            this.addEventListener("dragend", onDragEnd);
        }
    }

    connectedCallback() {
        this.setAttribute("suit", this.suit);
        this.setAttribute("rank", this.rank);
        this.innerText = this.face;
    }

    reserve(yes) { this.toggleAttribute("reserve", yes); }
    select(yes)  { this.toggleAttribute("select",  yes); }

    selectHand(yes) {
        let card = this;
        do {
           card.select(yes);
        } while ( card = card.nextSibling ) ;
    }

    moveHand(dst) {
        let card, cards;
        cards = [];
        card = this;
        do  {
            card.select(false);
            cards.push(card);
        } while (card = card.nextSibling);
        dst.append(...cards);
    }
}

class SpyModel extends HTMLElement {
}

class SpyRow extends HTMLElement {
    makeDroppable() {
        this.addEventListener("dragover", onDragOver);
        this.addEventListener("drop", onDrop);
    }

    unreserve() {
        // Ensure the last up to two cards are face up.
        Array.from(this.children).slice(-2).forEach( x => x.reserve(false) );
    }
}

customElements.define("spy-card", SpyCard);
customElements.define("spy-model", SpyModel);
customElements.define("spy-row", SpyRow);


// Logic class.

class Spysol {
    dragging;
    rows;
    score;
    stock;
    spec = new StandardSpec();

    createCard(suit, rank, drag) {
        //const card = document.createElement("spy-card");
        const face = this.spec.getFace(suit, rank)
        const card = new SpyCard(suit, rank, face, drag);
        //card.setValue(suit, rank, this.spec, drag);
        return card;
    }

    createCardDeck(shuffle) {
        let card, deck, rank, suit;
        deck = [];
        for (suit of SUITS) {
            for (rank = 1; rank <= this.spec.ranks; rank++) {
                card = this.createCard(suit, rank, true);
                deck.push(card);
            }
        }
        if (shuffle) {
            rs.random.shuffle(deck);
        }
        return deck;
    }

    createModelSuit(suit) {
        let card, cards, rank;
        cards = [];
        for (rank=1; rank <= this.ranks; rank++) {
            card = this.createCard(suit, rank, false);
            cards.push(card);
        }
        return cards;
    }

    createRow(droppable) {
        const row = document.createElement("spy-row");
        row.makeDroppable();
        return row;
    }

    createRows() {
        let i, rows;
        rows = [];
        for (i = 1; i <= this.spec.rowSizes.length; i++) {
            rows.push( this.createRow(droppable) );
        }
        return rows;
    }

    initModels() {
        let card, cards, rank, suit;
        for (suit of [1, 2]) {
            cards = [];
            for (rank=1; rank <= this.spec.ranks; rank++) {
                card = this.createCard(suit, rank);
                cards.push(card);
            }
            document.getElementById(`model${suit}`).replaceChildren(...cards);
        }
    }

    dealCards() {
        let card, hand, i, row, size;
        const tableau = document.getElementById("tableau");
        this.stock = this.createCardDeck(true);
        this.rows = [];
        tableau.replaceChildren();
        for (size of this.spec.rowSizes) {
            hand = [];
            for (i = 0; i < size; i++) {
                card = this.stock.pop();
                if (i < size - 2) {
                    card.reserve(true);
                }
                hand.push(card);
            }
            this.rows.push(hand);
            row = this.createRow();
            row.append(...hand);
            tableau.append(row);
        }
    }

    newGame() {
        this.score = 0;
        this.dragging = null;
        this.initModels();
        this.dealCards();
        this.renderDraw();
        this.renderScore();
    }

    renderDraw() {
        const el = document.getElementById("btn-draw")
        const rounds = this.stock.length / this.rows.length;
        el.innerText = `Draw (${rounds})`;
        el.disabled = !rounds;
    }

    renderScore() {
        const score = document.getElementById("score");
        const progress = document.querySelector("progress");
        score.innerText = this.score;
        progress.value = this.score;
    }
};

const spy = new Spysol();

// Get the element's row, which may be the element itself or an ancestor.
function getRow(el) {
    while (el) {
        if (el instanceof SpyRow) {
            return el;
        }
        el = el.parentElement();
    }
    return null;
}


// Event callbacks

function changeColors() {
    const hues = rs.random.shuffle(HUES).slice(0, 2);
    document.documentElement.style.setProperty("--hue1", hues[0]);
    document.documentElement.style.setProperty("--hue2", hues[1]);
}

function newGame() {
    if ( window.confirm("Abandon current game?" ) ) {
        spy.newGame();
    }
}

function draw() {
    let card;
    if (spy.stock.length) {
        for (let i = 0; i < spy.rows.length; i++) {
            card = spy.stock.shift();
            if (card) {
                spy.rows[i].push(card);
                document.getElementById("tableau").children[i].append(card);
            }
        }
        spy.renderDraw();
    }
}

function onDragStart(event) {
    spy.dragging = event.target;
    spy.dragging.selectHand(true);
}

function onDragEnd(event) {
    spy.dragging.selectHand(false);
    spy.dragging = null;
}

function onDragOver(event) {
    event.preventDefault();
}

function onDragEnter(event) {
    event.currentTarget.classList.add("dragging");
}

function onDragLeave(event) {
    event.currentTarget.classList.remove("dragging");
}

function onDrop(event) {
    if (spy.dragging) {
        const start = spy.dragging;
        const src = spy.dragging.parentElement;
        const dst = event.currentTarget;
        console.assert(src instanceof SpyRow);
        console.assert(dst instanceof SpyRow);
        if (src === dst) {
        } else {
            start.moveHand(dst);
            src.unreserve();
            event.preventDefault();
        }
    }
}


// Initialize game.
function initialize() {
    document.getElementById("btn-draw").addEventListener("click", draw);
    document.getElementById("btn-colors").addEventListener("click", changeColors);
    document.getElementById("btn-new").addEventListener("click", newGame);
    spy.newGame();
}


initialize();
