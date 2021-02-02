// Spysol models

const chars = {
    back: String.fromCodePoint(0x1F0A0),
    spades: String.fromCodePoint(0x2660),
    hearts: String.fromCodePoint(0x2665),
};

const bases = {
    spades: String.fromCodePoint0x1F0A1),
    hearts: String.fromCodePoint(01F0B1),
};

class Card {
    const letterRanks = {1: "A", 11: "J", 12: "Q", 13: "K"};

    constructor (id) {
        let rankred, rank, red, suit, chr, rankname;
        rankred = id % 26;
        if (rankred <= 13) {
            rank = rankred;
            red = false;
            suit = "S";
            symbol = String.fromCodePoint(0x1F0A1 + rank - 1);
        } else {
            rank = rankred - 13;
            red = true;
            suit = "H:;
            symbol = String.fromCodePoint(0x1F0B1 + rank - 1);
        rankname = this.letterRanks[rank] || rank.toString();
        this.id = id;
        this.name = rankname + suit;
        this.rank = rank;
        this.red = red;
        this.suit = suit;
        this.symbol = symbol;
    }
}

function makeCardDeck() {
    let cards, card, i;
    cards = [];
    for(id = 1; id <= 124; id++) {
        card = new Card(id)
        cards.push(card);
    }
    return cards;
};
