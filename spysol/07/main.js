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

    createCard(suit, rank) {
        const card = document.createElement("spy-card");
        card.setValue(suit, rank, this);
        return card;
    }

    createModelSuit(suit) {
        let card, cards, rank;
        cards = [];
        for (rank=1; rank <= this.ranks; rank++) {
            card = this.createCard(suit, rank);
            cards.push(card);
        }
        return cards;
    }

    createRow() {
        const row = document.createElement("spy-row");
        return row;
    }

    createRows() {
        let i, rows;
        rows = [];
        for (i = 1; i <= this.rowSizes.length; i++) {
            rows.push( this.createRow() );
        }
        return rows;
    }

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
    setValue(suit, rank, spec) {
        this.suit = suit;
        this.rank = rank;
        this.setAttribute("suit", suit);
        this.setAttribute("rank", rank);
        this.innerText = spec.getFace(suit, rank);
    }
}

class SpyModel extends HTMLElement {
}

class SpyRow extends HTMLElement {
}
customElements.define("spy-card", SpyCard);
customElements.define("spy-model", SpyModel);
customElements.define("spy-row", SpyRow);


// Logic class.

class Spysol {
    model1;
    model2;
    rows;
    spec = new StandardSpec();

    newGame() {
        this.model1 = this.spec.createModelSuit(1);
        this.model2 = this.spec.createModelSuit(2);
        this.rows = this.spec.createRows();
    }
};

const spy = new Spysol();



// Initialize game.
function initialize() {
    spy.newGame();
    document.getElementById("model1").replaceChildren(...spy.model1);
    document.getElementById("model2").replaceChildren(...spy.model2);
    document.getElementById("tableau").replaceChildren(...spy.rows);
    spy.rows[0].replaceChildren(spy.spec.createCard(1, 1), spy.spec.createCard(1, 2));
    spy.rows[1].replaceChildren(spy.spec.createCard(2, 1), spy.spec.createCard(2, 2));
}


initialize();
