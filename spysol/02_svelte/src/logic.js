import * as randomizers from "random-seedable";
//import shuffleArray from "array-shuffle";

const maxCards = 104;

const CLUBS = {base: 0x1F0D1, black: true, chr: "\u{2663}", name: "C"};
const HEARTS = {base: 0x1F0B1, black: false, chr: "\u{2665}", name: "H"};
const RANKS = [
    {rank: 1,  name: "A",  offset: 0},
    {rank: 2,  name: "2",  offset: 1},
    {rank: 3,  name: "3",  offset: 2},
    {rank: 4,  name: "4",  offset: 3},
    {rank: 5,  name: "5",  offset: 4},
    {rank: 6,  name: "6",  offset: 5},
    {rank: 7,  name: "7",  offset: 6},
    {rank: 8,  name: "8",  offset: 7},
    {rank: 9,  name: "9",  offset: 8},
    {rank: 10, name: "10", offset: 9},
    {rank: 11, name: "J",  offset: 10},
    {rank: 12, name: "Q",  offset: 12},   // Skip offset 11 (Cavalier card).
    {rank: 13, name: "K",  offset: 13},
];

export const tableauRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export class Card {

    constructor (id, faceUp=false) {
        if (!Number.isInteger(id) || id < 1) {
            throw new Error("card ID must be integer >= 1");
        }
        this.id = id;
        this.faceUp = faceUp;
        const c = this.constructor;
        const rs = (id - 1) % 26;    // 0-12 = clubs A-K, 13-25 = hearts A-K.
        const rank = RANKS[rs % 13];
        const suit = (rs < 13) ? CLUBS : HEARTS;
        this.rank = rank.rank;
        this.suit = rs >= 13 ? 1 : 0;
        this.name = rank.name + suit.chr;
        this.chr = String.fromCodePoint(suit.base + rank.offset);
        this.black = suit.black;
        this.color = suit.black ? "black" : "red";
        this.selected = false;
    }

}

export function getCardDeck(faceUp=true, order=true) {
    let deck = [];
    let id;
    let card;
    for (id = 1; id <= maxCards; id++) {
        card = new Card(id, faceUp);
        deck.push(card);
     }
     return deck;
}

// Shuffle an array.
export function shuffle(arr, seed=undefined, algorithm=undefined) {
    let prng;
    let random;
    if (algorithm == "mersenne") {
        prng = randomizers.MersenneTwister;
    } else {
        prng = randomizers.XORShift64;
    }
    if (seed) {
        random = new prng(seed);
    } else {
        random = new prng();
    }
    return random.shuffle(arr);
}

export function makeTableau() {
    //        0   1   2   3   4   5   6   7   8   9
    return [ [], [], [], [], [], [], [], [], [], [] ];
}


class Changes {
    constructor() {
        this.tableau = [];
        this.reserve = [];
        this.clear();
    }

    clear() {
        this.tableau.splice(0);
        this.reserve.splice(0);
        this.foundations = false;
        this.outcome = false;
    }
}


class Column {
    constructor(id) {
        this.id = id;
        this.reserve = [];   // Array of Card.
        this.cards = [];   // Array of Card.
    }

    clear() {
        this.reserve.splice();
        this.cards.splice();
    }
}


export class SpysolGame {

    // Constants.
    maxfoundations = 8;
    suitLength = 13;

    // Board.
    //columns: Defined in constructor.
    foundations = [];

    // UI helpers.
    changed = false;
    changedSelection = false;
    won = false;
    selection = {column: null, index: null};

    constructor() {
        // Board
        this.columns = [
            new Column(0), // 0.
            new Column(1), // 1.
            new Column(2), // 2.
            new Column(3), // 3.
            new Column(4), // 4.
            new Column(5), // 5.
            new Column(6), // 6.
            new Column(7), // 7.
            new Column(8), // 8.
            new Column(9), // 9.
        ];
        //this.tableau = [ [], [], [], [], [], [], [], [], [], [] ];
        //this.reserve = [ [], [], [], [], [], [], [], [], [], [] ];
        //this.colNums = [  0,  1,  2,  3,  4,  5,  6,  7,  8,  9 ];
        //this.foundations = [];

        // Internal housekeeping

        this.clear();
    }

    clear() {
        this.columns.forEach( x => x.clear() );
        this.foundations.splice();
        this.won = false;
        this.changed = true;
    }

    deal() {
      let c;
      let cards = getCardDeck();
      shuffle(cards);
      for (let c of this.columns) {
          c.reserve.push(...cards.splice(0, 4));
          c.cards.push(cards.shift())
          c.changed = true;
      }
      this.stock = cards;
    }

    move(col1, index, col2, force=false) {
        const src = this.columns[col1];
        const dst = this.columns[col2];
        const cards = src.cards.splice(index);
        dst.cards.push(...cards);
        if (!src.cards.length && src.reserve.length) {
            src.cards.push(src.reserve.pop());
        }
        return true;
    }

    canMove(col1, index, col2) {
        const c1 = this.tableau[col1];
        const c2 = this.tableau[col2];
        if (!c1.length) {
            return false;
        }
        let rank = target.rank - 1;
        for (card of cards) {
            if (rank < 1 || card.rank !== rank) {
                return false;
            }
            rank--;
        }
        // TODO: Rank is wrong.
        if (c2.length) {
            return c2[0].rank = rank + 1;
        } else {
            return true;
        }
    }

    canPromote(column) {
        const cards = this.tableau[column];
        if (cards.length !== 13) {
            return false;
        }
        const suit = cards[0].suit;
        let rank = 13;
        for (card of cards) {
            if (card.suit !== suit || cards.rank !== rank--) {
                return false;
            }
        }
        return true;
    }

    isWon() {
        return this.foundations.length >= this.maxFoundations;
    }
}


export class Selection {
    active = false;
    colnum = null;
    index = null;

    set(colnum, index) {
        this.colnum = colnum;
        this.index = index;
        this.active = true;
    }

    clear() {
        this.active = false;
        this.colnum = null;
        this.index = null;
    }

    isCardSelected(colnum, index) {
        return this.active && colnum === this.colnum && index >= this.index;
    }
}
