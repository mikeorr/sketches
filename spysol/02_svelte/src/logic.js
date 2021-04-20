import shuffleArray from "array-shuffle";

const maxCards = 104;

export class Card {
    static _rankLetters = {1: "A", 11: "J", 12: "Q", 13: "K"};

    constructor (id, faceUp=false) {
        const rs = (id - 1) % 26;    // 0-12 = clubs A-K, 13-25 = hearts A-K.
        const clubs = rs < 13;       // true = clubs|black, false = hearts|red.
        const rank = (rs % 13) + 1;  // rank 1-13.
        this.id = id;
        this.rank = rank;
        this.faceUp = faceUp;
        if (clubs) {
            this.suit = "\u{2663}";
            this.color = "black";
            this.black = true;
        } else {
            this.suit = "\u{2665}";
            this.color = "red";
            this.black = false;
        }
        this.name = (Card._rankLetters[rank] || rank) + this.suit;
        this.chr = this._getChr(rank, clubs);
    }

    _getChr(rank, clubs) {
        const base = clubs ? 0x1F0D1 : 0x1F0B1;
        const offset = (rank < 12) ? (rank - 1) : rank;
        return String.fromCodePoint(base + offset);
    }
}


export function makeCardDeck(faceUp=true, shuffled=false, order=null) {
    let card, deck, id;
    deck = [];
    for (id = 1; id <= 104; id++) {
        card = new Card(id, faceUp);
        deck.push(card);
    }
    if (order) {
        deck = order.map(i => deck[i]);
    } else if (shuffled) {
        shuffleArray(deck);
    }
    return deck;
}

export function getCardDeck(order=true, faceUp=true) {
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const suits = [true, false, true, false, true, false, true, false];
    let deck = [];
    let id = 0;
    let rank, suit, card;
    for (suit of suits) {
         for (rank of ranks) {
            card = {
                id: ++id,
                rank: rank,
                suit: suit,
                faceUp: faceUp,
            };
            deck.push(card);
        }
     }
     if (order === true) {
        return deck;
     } else if (order === false) {
        return shuffle(deck);
     } else if (Array.isArray(order)) {
        return order.map(i => deck[i - 1]);
     }
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
