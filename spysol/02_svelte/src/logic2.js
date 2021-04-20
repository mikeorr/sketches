import shuffle from "array-shuffle";

const maxCards = 104;

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
     if (order === true) {
        return deck;
     } else if (order === false) {
        return shuffle(deck);
     } else if (Array.isArray(order)) {
        return order.map(i => deck[i - 1]);
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
