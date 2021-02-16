// Spysol models

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
        this.rank = (rs % 12) + 1;
        this.red = rs > 12;
        const rankname = letterRanks[this.rank] || this.rank.toString();
        if (this.red) {
            this.suit = chars.hearts;
            this.chr = String.fromCodePoint(0x1F0B1 + this.rank - 1);
        } else {
            this.suit = chars.clubs;
            this.chr = String.fromCodePoint(0x1F0D1 + this.rank - 1);
        }
        this.name = rankname + this.suit;

        /*
        let rankred, rank, red, suit, chr, rankname, symbol;
        rankred = id % 26;
        if (rankred <= 12) {
            rank = rankred + 1;
            red = false;
            suit = "C";
            symbol = String.fromCodePoint(0x1F0D1 + rank - 1);
        } else {
            rank = rankred - 12;
            red = true;
            suit = "H";
            symbol = String.fromCodePoint(0x1F0B1 + rank - 1);
        }
        rankname = letterRanks[rank] || rank.toString();
        this.id = id;
        this.name = rankname + suit;
        this.rank = rank;
        this.red = red;
        this.suit = suit;
        this.symbol = symbol;
        */
    }
}


export class Deck {

    sorted() {
        let cards = [];
        let id;
        for(id = 1; id <= 104; id++) {
            cards.push(new Card(id));
        }
        return cards;
    }

    shuffled() {
        let cards = this.sorted();
        // Shuffling not implemented.
        return cards;
    }

    ordered(order) {
        let orig = this.sorted();
        let cards = order.map( i => orig[x] );
        //let cards = [];
        //order.forEach( i => cards.push(orig[i-1]) );
        return cards;
    }
}
