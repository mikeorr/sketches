import * as randomizers from "random-seedable";
//import shuffleArray from "array-shuffle";

const suitLength = 13;
const maxCards = suitLength * 8;   // 104.


/** getCardDeck() -- Create a Spider card deck.
 *
 * Return an array of card objects. Each card has properties:
 *   id: integer incrementing from 1 to 104.
 *   rank: integer between 1 and 13 (representing Ace to King).
 *   suit: boolean:
 *     'false' is Clubs and represents clubs/spades/black.
 *     'true' is Hearts and represents hearts/diamonds/red.
 * The first 13 cards are clubs 1-13, then hearts 1-13, then repeating
 * these three times, for a total of 104 cards (13 * 8).
 *
 */
export function getCardDeck() {
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const suits = [false, true];
    let cards = [];
    let id = 0;
    let rank;
    let suit;
    let card;
    let iter;
    for (iter = 1; iter <=4; iter++) {
        for (suit of suits) {
            for (rank of ranks) {
                card = {
                    id: ++id,
                    rank: rank,
                    suit: suit,
                }
                cards.push(card);
            }
        }
     }
     return cards;
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


export class SpysolGame {
    // Constants
    maxCards = maxCards;
    suitLength = suitLength;

    // Board
    tableau = new Tableau();
    foundations = 0;
    stock = [];
    won = false;

    // UI helpers
    changed = false;
    changedSelection = false;
    selection = {column: null, index: null};

    clear() {
        for (let c of this.tableau.columns) {
            c.reserve.splice();
            c.cards.splice();
        }
        this.foundations = 0;
        this.stock = [];
        this.won = false;
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

    getFoundationsPercent() {
        return this.foundations / maxCards * 100;
    }


    move(col1, index, col2) {
        const src = this.tableau.columns[col1];
        const dst = this.tableau.columns[col2];
        const cards = src.cards.splice(index);
        dst.cards.push(...cards);
        if (!src.cards.length && src.reserve.length) {
            src.cards.push(src.reserve.pop());
        }
        //this.changed = true;
        return true;
    }

    canMove(col1, index, col2) {
        const c1 = this.tableau.columns[col1];
        const c2 = this.tableau.columns[col2];
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
        const cards = this.tableau.columns[column].cards;
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
