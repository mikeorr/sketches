import shuffleArray from "array-shuffle";

const maxCards = 104;

export class Card {
    static _letterRanks = {1: "A", 11: "J", 12: "Q", 13: "K"};
    constructor (id, rank, clubs, faceUp=true) {
        const chrBase = clubs ? 0x1F0D1 : 0x1F0B1;
        const chrOffset = rank > 11 ? (rank + 1) : rank;
        this.id = id;
        this.rank = rank;
        this.suit = String.fromCodePoint(clubs ? 0x2663 : 0x2665);
        this.black = clubs;
        this.red = !clubs;
        this.color = clubs ? "black" : "red";
        this.name = (this.constructor._letterRanks[rank] || rank) + this.suit;
        this.chr = this._getChr(rank, clubs);
        this.faceUp = faceUp;
    }

    _getChr(rank, clubs) {
        let base, ord;
        base = clubs ? 0x1F0D1 : 0x1F0B1;
        if (rank < 12) {
            ord = base + rank - 1;  // Ace to Jack are zero offset from base.
        } else {
            ord = base + rank;   // Skip Cavalier between Jack and Queen.
        }
        return String.fromCodePoint(ord);
    }
}


export function makeCardDeck(faceUp=true, shuffled=false, order=null) {
    const clubsArr = [true, false, true, false, true, false, true, false];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let rank;
    let clubs;
    let deck = [];
    let id = -1;
    let card;
    for (clubs of clubsArr) {
        for (rank of ranks) {
            card = new Card(++id, rank, clubs, faceUp);
            deck.push(card);
        }
    }
    if (order) {
        deck = order.map(i => deck[i]);
    } else if (shuffled) {
        shuffleArray(deck);
    }
    return deck;
}

export function makeTableau() {
    //        0   1   2   3   4   5   6   7   8   9
    return [ [], [], [], [], [], [], [], [], [], [] ];
}

export function canMove(cards, target) {
    let rank = target.rank - 1;
    for (card of cards) {
        if (rank < 1 || card.rank !== rank) {
            return false;
        }
        rank--;
    }
    return true;
};

export function canPrompte(cards) {
    if (cards.length !== 13) {
        return false;
    }
    const suit = cards[0].suit;
    let rank = 13;
    for (card of cards) {
        if (card.suit !== suit || cards.rank !== rank--) {
            return false;
        }
    return true;
    }
}

export function countRuns(column) {
    return 0;
}

export function isWon(foundations) {
    return foundations === max.cards;
}
