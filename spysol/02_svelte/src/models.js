// Spysol models

import shuffle from "array-shuffle";

const chars = {
    back: String.fromCodePoint(0x1F0A0),
    clubs: String.fromCodePoint(0x2663),
    hearts: String.fromCodePoint(0x2665),
};

const letterRanks = {1: "A", 11: "J", 12: "Q", 13: "K"};


class Card {
    constructor (id) {
        const rs = id % 26;
        this.id = id;
        this.rank = (rs % 13) + 1;
        this.red = rs > 12;
        this.suit = this.red ? chars.hearts : chars.clubs;
        this.name = this._getRankName(this.rank) + this.suit;
        this.chr = this._getChr(this.rank, this.red);
    }

    _getChr(rank, red) {
        let base, offset;
        base = red ? 0x1F0B1 : 0x1F0D1;
        offset = rank - 1;
        if (rank >= 12) {
            offset++
        }
        return String.fromCodePoint(base + offset);
    }

    _getRankName(rank) {
        switch (rank) {
            case 1:
                return "A";
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                return rank.toString();
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            default:
                return undefined;
              
        }
    }
}


export class Deck {

    sorted() {
        let cards = [];
        let id;
        for(id = 0; id < 104; id++) {
            cards.push(new Card(id));
        }
        return cards;
    }

    shuffled() {
        return shuffle(this.sorted());
    }

    ordered(order) {
        let orig = this.sorted();
        let cards = order.map( i => orig[x] );
        //let cards = [];
        //order.forEach( i => cards.push(orig[i-1]) );
        return cards;
    }
}


class Column {
    constructor() {
        this.hidden = [];   // Array of Card.
        this.visible = [];   // Array of Card.
    }

    reset() {
        // Delete all cards.
        this.hidden.splice(0);
        this.hidden.splice(0);
    }
}


export class SpysolModel {
    constructor(order=null) {
        this.columnsRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.cards = this._getCards();
        this.reset();
    }

    reset() {
        this.columns = this.columnsRange.map(x => new Column());
        this.score = {
            foundations: 0,
            runs: 0,
            runs2: 0,
            won: false,
            foundationsToWin: 8,
        };
    }

    deal() {
        this.reset();
        const maxColumn = this.columns.length - 1;
        let iColumn = 0;
        let col;
        this.cards.forEach(card => {
            c = this.columns[iColumn];
            if (len(c.hidden.length < 5)) {
                c.hidden.push(card);
            } else {
                c.visible.push(card);
            }
            if (++iColumn >= this.columns.length) {
                iColumn = 0;
            }
        });
    }

    recalculate() {
        return this.score;
    }

    _getCards(order=null) {
        const deck = new Deck()
        if (order) {
            return deck.ordered(order);
        } else {
            return deck.shuffled();
        }
    }
}
