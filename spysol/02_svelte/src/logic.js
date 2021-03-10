import shuffleArray from "array-shuffle";

export class Card {
    static _letterRanks = {1: "A", 11: "J", 12: "Q", 13: "K"};
    constructor (id, rank, clubs, visible=true) {
        const chrBase = clubs ? 0x1F0D1 : 0x1F0B1;
        this.id = id;
        this.rank = rank;
        this.suit = String.fromCodePoint(clubs ? 0x2663 : 0x2665);
        this.black = clubs;
        this.red = !clubs;
        this.color = clubs ? "black" : "red";
        this.name = (this.constructor._letterRanks[rank] || rank) + this.suit;
        this.chr = String.fromCodePoint(chrBase + rank - 1);
        this.visible = visible;
    }
}


export function makeCardDeck(visible=true, shuffled=false, order=null) {
    const clubsArr = [true, false, true, false, true, false, true, false];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let rank;
    let clubs;
    let deck = [];
    let id = -1;
    let card;
    for (clubs of clubsArr) {
        for (rank of ranks) {
            card = new Card(++id, rank, clubs, visible);
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
