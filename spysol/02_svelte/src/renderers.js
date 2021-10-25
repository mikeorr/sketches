// Card rendering classes.

// Unicode characters.

export class TextCardRenderer {
    static name = "ASCII";
    static charsClubs = [
        "A\u2663", "2\u2663", "3\u2663", "4\u2663", "5\u2663", "6\u2663",
        "7\u2663", "8\u2663", "9\u2663", "10\u2663", "J\u2663", "Q\u2663", "K\u2663"];
    static charsHearts = [
        "A\u2665", "2\u2665", "3\u2665", "4\u2665", "5\u2665", "6\u2665",
        "7\u2665", "8\u2665", "9\u2665", "10\u2665", "J\u2665", "Q\u2665", "K\u2665"];
    static charBack = "\u{1F0A0}";   // PLAYING CARD BACK.
    static deckClass = "card-chr";

    constructor(card, faceUp, peek, selected) {
        this.card = card;
        this.faceUp = faceUp;
        this.peek = peek;
        this.selected = selected;
        this.color = card.suit % 2 ? "red" : "black";
    }

    getClasses() {
        let classes = ["card", this.constructor.deckClass];
        if (this.constructor.deckClass) {
            classes.push(this.constructor.deckClass);
        }
        let c = "card-" + this.color;
        if (this.selected) {
            c += "-selected";
        } else if (this.faceUp) {
        } else if (this.peek) {
            c += "-peek";
        } else {
            c += "-back";
        }
        classes.push(c);
        return classes;
    }

    getContent() {
        if (this.faceUp || this.peek) {
            if (this.rank % 2) {   // Hearts (representing any red suit).
                return this.constructor.charsHearts[this.card.rank - 1];
            } else {   // Clubs (representing any black suit).
                return this.constructor.charsClubs[this.card.rank - 1];
            }
        } else {
            return charBack;
        }
    }
}


export class UnicodeCardRenderer extends TextCardRenderer {
    static name = "Unicode";
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


export class NeaveillCardRenderer extends TextCardRenderer {
    static name = "Neaveill";
    static charsClubs = "nopqrstuvwxyz".split();
    static charsHearts = "NOPQRSTUVWXYZ".split();
    static deckClass = "nv";
}
