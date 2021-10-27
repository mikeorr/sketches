// Card rendering classes.

export function getRenderer(deck) {
  switch (deck) {
      case 1:
          return new NeaveillCardRenderer();
      case 2:
          return new TextCardRenderer();
      case 3:
          return new CompactCardRenderer();
      case 4:
          return new HexCardRenderer();
      default:
          return new UnicodeCardRenderer();
  }
}


// Unicode characters.

class CardRenderer {
    static charBack = "\u{1F0A0}";
    static charClubs = [];
    static charHearts = [];

    getClasses(card, faceUp, peek, selected) {
        let classes = ["card", this.constructor.deckClass];
        if (faceUp || peek) {
            let color = card.suit %2 ? "red" : "black";
            if (selected) {
                color += "-selected";
            } else if (faceUp) {
            } else if (peek) {
                color += "-peek";
            }
            classes.push(color);
        } else {
            classes.push("back");
        }
        return classes;
    }

    getContent(card, faceUp, peek) {
        if (faceUp || peek) {
            return this.getFace(card);
        } else {
            return this.constructor.charBack;
        }
    }

    getFace (card) {
        if (card.rank % 2) {   // Hearts (representing any red suit).
            return this.constructor.charsHearts[card.rank - 1];
        } else {   // Clubs (representing any black suit).
            return this.constructor.charsClubs[card.rank - 1];
        }
    }
}

export class CompactCardRenderer extends CardRenderer {
    static name = "Compact";
    static deckClass = "compact";
    static charsRanks = "A23456789TJQKI".split("");

    getFace(card) {
        const rank = this.constructor.charsRanks[card.rank - 1];
        return rank;
    }
}


export class HexCardRenderer extends CompactCardRenderer {
    static name = "Hex";
    static deckClass = "hex";
    static charsRanks = "123456789ABCDE".split("");
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

    getFace(card) {
        const rank = this.constructor.charsRanks[card.rank - 1];
        const suit = this.getSuit(card);
        const text = rank + suit;
        return text.padStart(3);
    }

    getSuit(card, peek) {
        const cls = this.constructor;
        if (card.suit % 2) {
            return peek ? cls.charHeartsPeek : cls.charHearts;
        } else {
            return peek ? cls.charClubsPeek : cls.charClubs;
        }
    }
}


export class UnicodeCardRenderer extends CardRenderer {
    static name = "Unicode";
    static deckClass = "unicode";
    static charsClubs = [
        "\u{1F0D1}",  // PLAYING CARD ACE OF CLUBS.
        "\u{1F0D2}",  // PLAYING CARD TWO OF CLUBS.
        "\u{1F0D3}",  // PLAYING CARD THREE OF CLUBS.
        "\u{1F0D4}",  // PLAYING CARD FOuR OF CLUBS.
        "\u{1F0D5}",  // PLAYING CARD FIVE OF CLUBS.
        "\u{1F0D6}",  // PLAYING CARD SIX OF CLUBS.
        "\u{1F0D7}",  // PLAYING CARD SEVEN OF CLUBS.
        "\u{1F0D8}",  // PLAYING CARD EIGHT OF CLUBS.
        "\u{1F0D8}",  // PLAYING CARD NINE OF CLUBS.
        "\u{1F0DA}",  // PLAYING CARD TEN OF CLUBS.
        "\u{1F0DB}",  // PLAYING CARD JACK OF CLUBS.
        "\u{1F0DD}",  // PLAYING CARD QuEEN OF CLUBS.
        "\u{1F0DE}",  // PLAYING CARD KING OF CLUBS.
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
