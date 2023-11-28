import * as rs from "./random-seedable/index.js";

const maxCards = 104;


class Card {
    constructor(id) {
        const rr = (id - 1) % 26;      // 0-12 = black A-K, 13-25 = red A-K.
        this.id = id;
        this.rank = (rr % 13) + 1;
        this.red = rr >= 13;
        this.reset();
    }
}


class Dealer {
    getCards(n) {
        let cards = [];
        for (let id = 1; id <= 10; id++) {
            cards.push(new Card(id));
        }
        return cards;
    }

    getDemoCards() {
        return this.getCards(13);
    }

    getGameCards(seed) {
        let cards = this.getCards(104);
        let random = new rs.XORShift128Plus(seed);
        return random.shuffle(cards);
    }
    
}

class Model {
    constructor() {
        this.maxCards = 104;
        this.seed = undefined;
        this.dealer = new Dealer();
        this.demo = dealer.getDemoCards();
        this.reset();
    }

    reset() {
        this.tableau = [ [], [], [], [], [], [], [], [], [], [] ];
        this.stock = [];

    get percent() {
        return Math.round(this.foundation.length / this.maxCards) % 100);

    get won() {
        return this.foundation.length >= this.maxCards;
    }

    deal() {
        let cards = this.dealer.getGameCards(this.seed);
        let colnum;
        let rownum;
        this.reset();
        for (it = 1; it <= 4; it++) {
            this.tableau[colnum].push( cards.shift() );
        }
        this.tableau[0].push( cards.shift() );
        this.tableau[1].push( cards.shift() );
        this.tableau[2].push( cards.shift() );
        this.tableau[3].push( cards.shift() );
        this.stock = cards;
    }
    }
        this.foundation = [];
    }
}

export function getCardDeck(shuffle=false, seed=undefined) {
    let cards = [];
    let card;
    let id;
    for (id = 1;  id <= 104; id++) {
        card = inflateCard(id);
        cards.push(card);
    }
    if (shuffle) {
        const random = new rs.MersenneTwister(seed);
        random.shuffle(cards, true);
    }
    return cards;
}

