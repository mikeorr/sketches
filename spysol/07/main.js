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
//   reserve: true to obscure card's value
//   selected: true to mark the card as selected to move
// content: calculated from suit and rank
// Note: Font size is inherited from the containing row or ancestor.
class SpyCard extends HTMLElement {
    setValue(suit, rank, spec, drag) {
        this.suit = suit;
        this.rank = rank;
        this.setAttribute("suit", suit);
        this.setAttribute("rank", rank);
        this.innerText = spec.getFace(suit, rank);
        if (drag) {
            this.draggable = true;
            this.addEventListener("dragstart", onDrag);
        }
    }

    get reserve()  { return Boolean(this.getAttribute("reserve")); }
    get selected() { return Boolean(this.getAttribute("selected")); }

    set reserve(value)  { this.toggleAttribute("reserve",  value); }
    set selected(value) { this.toggleAttribute("selected", value); }

    select(yes) {
        let card = this;
        do {
           card.selected = yes; 
        } while ( card = card.nextSibling ) ;
    }

    move(dst) {
        let card = this;
        do {
            card.selected = false;
            dst.append(card);
        } while ( card = card.nextSibling );
    }
}

class SpyModel extends HTMLElement {
}

class SpyRow extends HTMLElement {
    makeDroppable() {
        this.addEventListener("dragover", onDragOver);
        this.addEventListener("drop", onDrop);
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
        const card = document.createElement("spy-card");
        card.setValue(suit, rank, this.spec, drag);
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
        let hand, row, size;
        const tableau = document.getElementById("tableau");
        this.stock = this.createCardDeck(true);
        this.rows = [];
        tableau.replaceChildren();
        for (let size of this.spec.rowSizes) {
            hand = this.stock.splice(0, size);
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

function onDrag(event) {
    const card = event.target;
    card.select();
    spy.dragging = card;
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    const dst = event.target;
    if (spy.dragging) {
        spy.dragging.move(dst);
        spy.dragging = null;
    }
    event.preventDefault();
}


// Initialize game.
function initialize() {
    document.getElementById("btn-draw").addEventListener("click", draw);
    document.getElementById("btn-colors").addEventListener("click", changeColors);
    document.getElementById("btn-new").addEventListener("click", newGame);
    spy.newGame();
}


initialize();
