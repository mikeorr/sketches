<script>

  /*
  const unicodeChars = [
    // Suit 0: Clubs.
    [0x1f0d1, 0x1f0d2, 0x1f0d3, 0x1f0d4, 0x1f0d5,
     0x1f0d6, 0x1f0d7, 0x1f0d8, 0x1f0d8, 0x1f0da,
     0x1f0db, 0x1fdd, 0x1fde].map(String.fromCodePoint),
    // Suit 1: Hearts.
    [0x1f0b1, 0x1f0b2, 0x1f0b3, 0x10fb4, 0x1f0b5,
     0x1f0b6, 0x1f0b7, 0x1f0b8, 0x1f0b8, 0x1f0ba,
     0x1f0bb, 0x1fbd, 0x1fbe].map(String.fromCodePoint),
  ]

  console.log("Initialized unicodeChars", unicodeChars);
  */


  // Properties.
  export let card = {id: 0, rank: 1, suit: 0};
  export let click = null;
  export let faceUp = true;
  export let peek = false;
  export let deck = "unicode";


  // Other reactive variables.
  let suitClass;
  let text;

  function getCardChar() {
    let suitOffset, rankOffset;
    suitOffset = card.suit ? 0x1f0b1 : 0x1f0d1;
    if (card.rank < 12) {
        rankOffset = card.rank - 1;
    } else {
      rankOffset = card.rank;
    }
    return String.fromCodePoint(suitOffset + rankOffset);
    //console.log("getCardChar card", card);
  }

  function getCardColor() {
    //console.log("getCardColor card", card);
    return (card.suit % 2) ? "red" : "black";
  }


  /*
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
        align: "right",
    },
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
  //let text = "";

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
        classes.push(card.clubs ? "clubs" : "hearts");
    } else if (peek) {
        classes.push(card.clubs ? "peek-clubs" : "peek-hearts");
    } else {
        classes.push("back");
    }
    return classes.join(" ");
  }

  */

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
  .card-chr {
    font-size: 40px;
  }
  .reserve .card-black {
    color: gray;
  }
  .reserve .card-red {
    color: LightRed;
  }
</style>

{#if false}
XXX
{:else if click}
<span class="card card-chr card-{getCardColor()}" on:click="{click}">{getCardChar()}</span>
{:else}
<span class="card card-chr card-{getCardColor()}">{getCardChar()}</span>
{/if}
