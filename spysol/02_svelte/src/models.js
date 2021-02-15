// Spysol models

const chars = {
    back: String.fromCodePoint(0x1F0A0),
    spades: String.fromCodePoint(0x2660),
    hearts: String.fromCodePoint(0x2665),
};

const letterRanks = {1: "A", 11: "J", 12: "Q", 13: "K"};


class Card {
    constructor (id) {
        let rankred, rank, red, suit, chr, rankname, symbol;
        rankred = id % 26;
        if (rankred <= 13) {
            rank = rankred;
            red = false;
            suit = "C";
            symbol = String.fromCodePoint(0x1F0D1 + rank - 1);
        } else {
            rank = rankred - 13;
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
    }
}


export function makeCards() {
    let cards, id;
    cards = [];
    for(id = 1; id <= 124; id++) {
        cards.push(new Card(id));
    }
    return cards;
};
