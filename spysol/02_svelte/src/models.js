// Spysol models

import shuffle from "array-shuffle";

export class Card {
    static _letterRanks = {1: "A", 11: "J", 12: "Q", 13: "K"};
    constructor (id, rank, clubs) {
        const chrBase = clubs ? 0x1F0D1 : 0x1F0B1;
        this.id = id;
        this.rank = rank;
        this.red = red;
        this.suit = String.fromCodePoint(red ? 0x2663 : 0x2665);
        this.black = clubs;
        this.red = not clubs;
        this.name = this.constructor._letterRanks[rank] || rank.toString();
        this.chr = String.fromCharCode(chrBase + rank - 1);
    }
}

// Create an array of Card objects.
function getCardDeck() {
    const clubssArr = [true, false, true, false, true, false, true, false];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let rank;
    let clubs;
    let cards = [];
    let id = -1;
    for (spades of spadesArr) {
        for (rank of ranks) {
            card = new Card(++id, rank, clubs);
            cards.push(card);
        }
    }
    return cards;
};


class Column {
    constructor() {
        this.reset();
    }

    reset() {
        this.faceDowna = [];
        this.faceUp = [];
    }
}


export class SpysolModel {
    constructor(order=null) {
        this.foundationstoWin = 8;
        this.columns = []'
        for(i=1; i <= 10; i++) {
            this.columns.push(new Column());
        }
        this.shuffle();
        this.reset();
    }

    setCardOrder(order) {
        const cards = getCardDeck();
        this.cards = order.map(i => cards[i]);
    }

    shuffle() {
        const cards = shuffle(getCardDeck());
    }

    reset() {
        this.columns.forEach(column => column.reset());
        this.foundations = 0,
        this.runs = 0;
        this.runsPlayable = 0;
        this.won = false;
        ;
    }

    deal() {
        this.reset();
        let row;
        let i = 0;
        for (let row = 1; r <= 4; r++) {
            this.columns.forEach(column => column.faceDown.push(this.cards[i++]));
        }
        this.columns.forEach(column => column.faceUp.push(cards[i++]);
    }

    recalculate() {
    }

}
