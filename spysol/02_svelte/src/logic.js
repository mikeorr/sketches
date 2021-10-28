import * as randomizers from "random-seedable";
//import shuffleArray from "array-shuffle";

const suitLength = 13;
const maxCards = suitLength * 8;   // 104.

export class Card {
    constructor (id) {
        if (!Number.isInteger(id) || id < 1) {
            throw new Error("card ID must be integer >= 1");
        }
        this.id = id;
        const rs = (id - 1) % 26;    // 0-12 = clubs A-K, 13-25 = hearts A-K.
        this.rank = (rs % 13) +1;
        this.suit = rs >= 13 ? 1 : 0;
    }

}

export function getCardDeck() {
    let deck = [];
    let id;
    let card;
    for (id = 1; id <= maxCards; id++) {
        card = new Card(id);
        deck.push(card);
     }
     return deck;
}

// TODO: 'getRandomSeed()' function.


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


function countRuns(cardArr) {
    let count = 0;
    if (cardArr.length) {
        let start = 0;
        let i = 1;
        let run = 0;
        for (let i = 1; i < cardArr.length; i++) {
            if (cardArr[i].rank !== cardArr[i-1].rank - 1) {
                count += i - start;
                start++;
            }
        }
    }
    return count;
}


class Changes {
    constructor() {
        this.clear();
    }

    clear() {
        this.tableau = [];
        this.reserve = [];
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


class Tableau {
    constructor() {
        this.columns = [
            new Column(0),
            new Column(1),
            new Column(2),
            new Column(3),
            new Column(4),
            new Column(5),
            new Column(6),
            new Column(7),
            new Column(8),
            new Column(9),
        ];
        this.clear();
        //this.changed = true;
    }

    clear() {
        this.columns.forEach( x => x.clear() );
        //this.changed = true;
    }

    move(col1, index, col2) {
        const src = this.columns[col1];
        const dst = this.columns[col2];
        const cards = src.cards.splice(index);
        dst.cards.push(...cards);
        if (!src.cards.length && src.reserve.length) {
            src.cards.push(src.reserve.pop());
        }
        //this.changed = true;
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

    canPromote(colnum) {
        const cards = this.column[column].cards;
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

}


class Foundations {
    count = 0;

    clear() {
        this.count = 0;
    }

    promote(suit) {
        this.count += suitLength;
        this.percent = this.count / this.maxCards * 100;
        this.won = this.count == maxCards;
    }

    get percent() {
        return this.count / this.maxCards * 100;
    }

    get won() {
        return this.count === maxCards;
    }
}


export class SpysolGame {
    tableau = new Tableau();
    foundations = new Foundations();
    stock = [];

    // UI helpers.
    changed = false;
    changedSelection = false;
    selection = {column: null, index: null};

    clear() {
        this.tableau.clear();
        this.foundations.clear();
        this.stock = [];
        this.changed = true;
    }

    deal() {
      let c;
      let cards = getCardDeck();
      shuffle(cards);
      for (let c of this.tableau.columns) {
          c.reserve.push(...cards.splice(0, 4));
          c.cards.push(cards.shift())
          c.changed = true;
      }
      this.stock = cards;
    }

    get won() {
        return this.foundations.won;
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
