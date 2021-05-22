import shuffleArray from "array-shuffle";

const maxCards = 104;
const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const suits = [0, 1, 0, 1, 0, 1, 0, 1];
const rankLetters = {1: "A", 11: "J", 12: "Q", 13: "K"};

export class Card {
    constructor (rank, suit, id, faceUp=true) {
        this.id = id;
        this.rank = rank;
        this.suit = suit;
        this.faceUp = faceUp;
        this.name = this._getName(rank, suit);
        this.chr = this._getChr(rank, suit);
        this.black = Boolean(suit);
        this.color = suit ? "red" : "black";
    }

    _getChr(rank, suit) {
        const base = suit ? 0x1f0b1 : 0x1f0d1;
        const offset = (rank < 12) ? (rank - 1) : rank;
        return String.fromCodePoint(base + offset);
    }

    _getName(rank, suit) {
        const rankName = rankLetters[rank] || rank;
        const suitName = suit ? "\u{2665}" : "\u{2663}";   // clubs, hearts.
        return rankName + suitName;
    }
}


export function getCardDeck(faceUp=true, order=true) {
    let deck = [];
    let id = 0;
    let rank, suit, card;
    for (suit of suits) {
         for (rank of ranks) {
            card = new Card(rank, suit, ++id, faceUp);
            deck.push(card);
        }
     }
     if (order === false) {
        shuffle(deck);
     } else if (Array.isArray(order)) {
        deck - order.map(i => deck[i - 1]);
     }
     return deck;
}

export function getCardText(rank, suit, series) {
    let base, offset;
    if (series == "Playing Cards") {
        base = [0x1f0d1, 0x1f0b1][suit];
        offset = (rank < 12) ? (rank - 1) : rank;
        return String.fromCodePoint(base + offset);
    }
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
    return foundations === maxCards;
}
