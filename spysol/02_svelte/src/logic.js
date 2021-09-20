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
        this.suit = rs >= 13;
        this.name = rank.name + suit.chr;
        this.chr = String.fromCodePoint(suit.base + rank.offset);
        this.black = suit.black;
        this.color = suit.black ? "black" : "red";
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

export function canPromote(cards) {
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
