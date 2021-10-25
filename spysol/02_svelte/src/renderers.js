// Card rendering classes.

// Unicode characters.

class CardRenderer {
    static charBack = "\u{1F0A0}";
    static charClubs = [];
    static charHearts = [];

    constructor(card, faceUp, peek, selected) {
        this.card = card;
        this.faceUp = faceUp;
        this.peek = peek;
        this.selected = selected;
        this.color = card.suit % 2 ? "red" : "black";
    }

    getClasses() {
        let classes = ["card", this.constructor.deckClass];
        if (this.faceUp || this.peek) {
            let c = this.color;
            if (this.selected) {
                c += "-selected";
            } else if (this.faceUp) {
            } else if (this.peek) {
                c += "-peek";
            }
            classes.push(c);
        } else {
            classes.push("back");
        }
        return classes;
    }

    getContent() {
        if (this.faceUp || this.peek) {
            return this.getFace();
        } else {
            return this.constructor.charBack;
        }
    }

    getFace () {
        if (this.card.rank % 2) {   // Hearts (representing any red suit).
            return this.constructor.charsHearts[this.card.rank - 1];
        } else {   // Clubs (representing any black suit).
            return this.constructor.charsClubs[this.card.rank - 1];
        }
    }
}

export class TextCardRenderer extends CardRenderer {
    static name = "Text";
    static deckClass = "text";
    static charsRanks = [
        "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    static charClubs = "\u2663";
    static charHearts = "\u2665";
    static charClubsPeek = "\u2667";
    static charHeartsPeek = "\u2661";

    getFace() {
        const rank = this.constructor.charsRanks[this.card.rank - 1];
        const suit = this.getSuit();
        const text = rank + suit;
        return text.padStart(3);
    }

    getSuit() {
        const cls = this.constructor;
        if (this.card.suit % 2) {
            return this.peek ? cls.charHeartsPeek : cls.charHearts;
        } else {
            return this.peek ? cls.charClubsPeek : cls.charClubs;
        }
    }
}


export class UnicodeCardRenderer extends CardRenderer {
    static name = "Unicode";
    static deckClass = "unicode";
    static charsClubs = [
        "\u{1F0D1}",  // PLAYING CARD ACE OF CLuBS.
        "\u{1F0D2}",  // PLAYING CARD TWO OF CLuBS.
        "\u{1F0D3}",  // PLAYING CARD THREE OF CLuBS.
        "\u{1F0D4}",  // PLAYING CARD FOuR OF CLuBS.
        "\u{1F0D5}",  // PLAYING CARD FIVE OF CLuBS.
        "\u{1F0D6}",  // PLAYING CARD SIX OF CLuBS.
        "\u{1F0D7}",  // PLAYING CARD SEVEN OF CLuBS.
        "\u{1F0D8}",  // PLAYING CARD EIGHT OF CLuBS.
        "\u{1F0D8}",  // PLAYING CARD NINE OF CLuBS.
        "\u{1F0DA}",  // PLAYING CARD TEN OF CLuBS.
        "\u{1F0DB}",  // PLAYING CARD JACK OF CLuBS.
        "\u{1F0DD}",  // PLAYING CARD QuEEN OF CLuBS.
        "\u{1F0DE}",  // PLAYING CARD KING OF CLuBS.
    ];
    static charsHearts = [
        "\u{1F0B1}",  // PLAYING CARD ACE OF HEARTS.
        "\u{1F0B2}",  // PLAYING CARD TWO OF HEARTS.
        "\u{1F0B3}",  // PLAYING CARD THREE OF HEARTS.
        "\u{1F0B4}",  // PLAYING CARD FOuR OF HEARTS.
        "\u{1F0B5}",  // PLAYING CARD FIVE OF HEARTS.
        "\u{1F0B6}",  // PLAYING CARD SIX OF HEARTS.
        "\u{1F0B7}",  // PLAYING CARD SEVEN OF HEARTS.
        "\u{1F0B8}",  // PLAYING CARD EIGHT OF HEARTS.
        "\u{1F0B8}",  // PLAYING CARD NINE OF HEARTS.
        "\u{1F0BA}",  // PLAYING CARD TEN OF HEARTS.
        "\u{1F0BB}",  // PLAYING CARD JACK OF HEARTS.
        "\u{1F0BD}",  // PLAYING CARD QuEEN OF HEARTS.
        "\u{1F0BE}",  // PLAYING CARD KING OF HEARTS.
    ];

}


export class NeaveillCardRenderer extends CardRenderer {
    static name = "Neaveill";
    static deckClass = "neaveill";
    static charsClubs = "nopqrstuvwxyz".split("");
    static charsHearts = "NOPQRSTUVWXYZ".split("");
}
