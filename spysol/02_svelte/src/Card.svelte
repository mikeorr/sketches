<script>
  //import * as svelte from 'svelte';
  //import * as logic from "./logic.js";

  /*
  class Card {
    static _rankLetters = {1: "A", 11: "J", 12: "Q", 13: "K"};

    constructor (id, faceUp=false) {
        const rs = (id - 1) % 26;    // 0-12 = clubs A-K, 13-25 = hearts A-K.
        const clubs = rs < 13;       // true = clubs|black, false = hearts|red.
        const rank = (rs % 13) + 1;  // rank 1-13.
        this.id = id;
        this.rank = rank;
        this.faceUp = faceUp;
        if (clubs) {
            this.suit = "\u{2663}";
            this.color = "black";
            this.black = true;
        } else {
            this.suit = "\u{2665}";
            this.color = "red";
            this.black = false;
        }
        this.name = (Card._rankLetters[rank] || rank) + this.suit;
        this.chr = this._getChr(rank, clubs);
    }

    _getChr(rank, clubs) {
        const base = clubs ? 0x1F0D1 : 0x1F0B1;
        const offset = (rank < 12) ? (rank - 1) : rank;
        return String.fromCodePoint(base + offset);
    }
  }
  */


  // Properties.
  export let card = {rank: 1, suit: 0, faceUp: true};
  export let peek = false;
  export let pattern = "letters";


  // Other reactive variables.
  let suitClass;
  let text;

  const patterns = {
    letters: {
        suitRanks: [
            ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"],
            ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"],
        ],
        back: "X",
        align: "center",
    },
    cards: {
        suitRanks: [
            [0x1f0d1, 0x1f0d2, 0x1f0d3, 0x1fd4, 0x1fd5,
             0x1fd6, 0x1f0d7, 0x1f0d8, 0x1f0d8, 0x1f0da,
             0x1f0db, 0x1fdd, 0x1fde].map(String.fromCodePoint),
            [0x1f0b1, 0x1f0b2, 0x1f0b3, 0x10fb4, 0x1fb5,
             0x1fb6, 0x1f0b7, 0x1f0b8, 0x1f0b8, 0x1f0ba,
             0x1f0bb, 0x1fbd, 0x1fbe].map(String.fromCodePoint),
        ],
        back: String.fromCodePoint(0x1f0a0),
        align: "right".
    },
    ;
  }

  $: if (card.faceUp) {
    suitClass = card.clubs ? "clubs" : "hearts";
  } else if (peek) {
    suitClass = card.clubs ? "peek-clubs" : "peek-hearts";
  } else {
    suitClass = "back";
  }

  $: {
    const front = faceUp || peek;
    if (pattern == "letters") {
      if (front) {
        const base = clubs ? 65 : 97;
        text = String.fromCodePoint(base + rank - 1);
      } else {
        text = "X";
      }
    } else {
      text = "?";
    }
  }

  let cssClass = "";
  let text = "";

  $: {
  }

  function getCardText() {
    const front = card.faceUp || peek;
    if (pattern === "letters") {
      if (front) {
        const base = clubs ? 65 : 97;
        return String.fromCodePoint(base + rank - 1);
      } else {
        return "X";
      }
    } else {
      console.log("Error in 'getCardText()': invalid pattern:", pattern)
      return undefined;
    }
  }

  function getCardClass() {
    let classes = ["card"]
    if (card.faceUp) {
        return card.clubs ? "card clib
        classes.push(card.clubs : "clubs" : "heartw");
    } elif (peek) {
        classes.push(card.clubs : "peek-clibs" : "peek-hearts");
    } else {
        classes.push("back");
    }
    return classes.join(" ");
  }


  //svelte.onMount(() => {
  //});
</script>

<style>
  .card {
    font-family: monospace;
  }
  .card-black {
    color: black;
  }
  .card-red {
    color: red;
  }
  .card-name {
    font-size: 20px;
    border: solid 1px;
  }
  .card-chr {
    font-size: 40px;
  }
</style>

<span class="card {getCardClass}">{card.name.padStart(3)}</span>
