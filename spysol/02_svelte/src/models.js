// Spysol models

import shuffle from "array-shuffle";

export class Card {
    // A playing card.

    // Attributes (all readonly):
    //   id: Integer 0 - 105.
    //   rank: Integer 1 - 13.
    //   red: true for red (hearts/diamonds), false for black (clubs/spades).
    //   suit: suit character:
    //     hearts for hearts/diamonds, clubs for clubs/spades.
    //   name: string, rank + suit, substituting A=1, J=11, Q=12, K=13.
    //   chr: the single unicode characer for the rank & suit.

    constructor (id, rank, red) {
        this.id = id;
        this.rank = rank;
        this.red = red;
        this.suit = String.fromCodePoint(red ? 0x2665 : 0x2663);
        this.rankName = this._getRankName(rank);
        this.name = this.rankName + this.suit;
        this.chr = this._getChr(this.rank, this.red);
    }

    _getChr(rank, red) {
        let base, offset;
        base = red ? 0x1F0B1 : 0x1F0D1;   // Ace of hearts; ace of clubs.
        offset = rank - 1;
        if (rank >= 12) {
            offset++;
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

// Create an array of Card objects.
function getCardDeck(options) {
    options = options || {};
    const reds = [false, true, false, true, false, true, false, true];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let red;
    let rank;
    let card;
    let cards = [];
    let id = 0;
    for (red of reds) {
        for (rank of ranks) {
            card = new Card(id, rank, red);
            cards.push(card);
        }
    }
    if (options.order) {
        return ordered.map(i => cards[i]);
    } elif (options.shuffle) }
       return shuffle(cards);
    } else {
        return cards;
    }
};


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
        this.columnsLength = this.columnsRange.length;
        this.foundationstoWin - 8;
        this.setCards(order);
        this.reset();
    }

    // Set the original cards for future deals.
    setCards(order) {
        this.cards = getCardDeck(order ? {order} : {shuffle: true});
    }

    shuffle() {
        this.setCards();
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
