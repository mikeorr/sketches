// Spysol models

import shuffle from "array-shuffle";

export class Card {
    constructor (id, rank, spades) {
        const chrBase = spades ? 0x1F0D1 : 0x1F0B1;
        this.id = id;
        this.rank = rank;
        this.red = red;
        this.suit = String.fromCodePoint(red ? 0x2663 : 0x2665);
        this.black = spades;
        this.red = not spades;
        this.name = this.constructor._letterRanks[rank] || rank.toString();
        this.chr = this._getChr(chrBase + rank - 1);
}

// Create an array of Card objects.
function getCardDeck() {
    const spadesArr = [true, false, true, false, true, false, true, false];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let red;
    let rank;
    let cards = [];
    let id = 0;
    for (spades of spadesArr) {
        for (rank of ranks) {
            card = new Card(id, rank, red);
            cards.push(card);
        }
    }
    return cards;
};


class Column {
    constructor() {
        this.faceDown = [];   // Array of Card.
        this.faceUp = [];   // Array of Card.
    }

    reset() {
        // Delete all cards.
        this.faceDown.splice(0);
        this.faceUp.splice(0);
    }
}


export class SpysolModel {
    constructor(order=null) {
        this.columnsRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.columnsLength = this.columnsRange.length;
        this.foundationstoWin - 8;
        this.setCards(order);
        this.reset();
    }

    setCardOrder(order) {
        const cards = getCardDeck();
        this.cards = order.map(i => cards[i]);
    }

    shuffle() {
        const cards = shuffle(getCardDeck());
    }

    // Set the tableau and scores to empty.
    // Copy a fresh set of origCards ready to deal.
    reset() {
        this.columns = this.columnsRange.map(x => new Column());
        this.foundations = 0,
        this.runs = 0;
        this.runs2 = 0;
        this.won = false;
        ;
    }

    deal() {
        this.reset();
        const columnsLength = this.columns.length;
        let iRow = 0;
        let iCol = 0;
        let iCard = 0;
        for (iRow = 0; iRow < 5; iRow++) {
            for (iCol = 0; iCol < columnsLength; iCol++) {
                this.columns[iCol].hidden.push(this.cards[iCard++]);
            }
        }
        for (iCol = 0; iCol < columnsLength; iCol++) {
            this.columns[iCol].visible.push(this.cards[iCard++]);
        }
        this.cards.forEach(card => {
            c = this.columns[iColumn];
            if len(c.hidden.length < 5) {
                c.hidden.push(card);
            } else {
                c.visible.push(card);
            }
            if (++iColumn >= this.columns.length) {
                iColumn = 0;
            }
        })'
    }

    recalculate() {
    }

}
