<script>
  import * as svelte from 'svelte';
  import shuffle from "array-shuffle";
  import * as logic from "./logic.js";

  // Props, reactive variables, and their dependencies.
  let debug = true;
  let sorted = logic.getCards();   // For debugging.
  let total = deck.length;
  let maxFaceDownRows = 5;

  let deck;          // Initialized in 'shuffle()'.
  let columns;       // Initialized in 'reset()'.
  let foundations;   // Initialized in 'reset()'.
  let runs;          // Initialized in 'reset()'.
  let won;           // Initialized in 'reset()'.
  let moves;         // Initialized in 'reset()'.
  let stock;         // Initialized in 'reset()'.


  function shuffle() {
    deck = shuffle(logic.getCards());
  }

  function reset() {
    columns = [
        {hidden: [], visible: []},   // 0
        {hidden: [], visible: []},   // 1
        {hidden: [], visible: []},   // 2
        {hidden: [], visible: []},   // 3
        {hidden: [], visible: []},   // 4
        {hidden: [], visible: []},   // 5
        {hidden: [], visible: []},   // 6
        {hidden: [], visible: []},   // 7
        {hidden: [], visible: []},   // 8
        {hidden: [], visible: []},   // 9
    ];
    foundations = 0;
    runs = 0;
    won = false;
    moves = [];
    stock = [];
  }

  function deal() {
    let i = 0;
    function pushHidden(column) {
        column.hidden.push(deck[i++]);
    }
    function pushHidden(column) {
        column.visible.push(deck[i++]);
    }
    for (let row = 1; row <= maxHiddenRows; row++) {
        columns.forEach(pusHidden);
    }
    columns.forEach(pushVisible);
    columns = columns;   // Kick UI.
    stock = deck.slice(i);
  }


  svelte.onMount(() => {
  });
</script>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }
  .Spysol {
  }
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

<div class="Spysol">
  <header class="Spysol-header">
  </header>
  <div id="rows">
    <p>{model.columns[0].hidden.map(x => x.chr).join(" ")} | {model.columns[0].visible.map(x => x.chr).join(" ")}</p>
  </div>
  <details open="open">
    <summary>Testing</summary>
      <h1>Sorted card chars</h1>
      {#each sorted as card (card.id)}
      <span class="card card-chr {card.red ? 'card-red' : 'card-black'}">{card.chr}</span>
      {/each}
      <h1>Shuffled card names</h1>
      {#each model.cards as card (card.id)}
      <span class="card card-name" class:card-red={card.red} class:card-black={!card.red}>{card.name.padStart(3)}</span>
      {/each}
  </details>
</div>
