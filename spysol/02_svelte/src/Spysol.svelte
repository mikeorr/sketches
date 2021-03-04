<script>
  import * as svelte from 'svelte';
  import shuffle from "array-shuffle";
  import * as logic from "./logic.js";

  const maxCards = 105;
  const maxHiddenRows = 4;

  function makeColumns() {
    //        0   1   2   3   4   5   6   7   8   9
    return [ [], [], [], [], [], [], [], [], [], [] ];
  }

  // Props, reactive variables, and their dependencies.
  export let debug = true;
  export let deck = null;
  let sorted = null;   // For debugging.
  let columns = makeColumns();
  let stock = [];
  let foundations = 0;
  let runs = 0;
  let won = false;
  let history = [];
  let historyIndex = -1;
  let isHelp = false;
  let isOptions = false;
  let isScores = false;


  function reset() {
    columns = [ [], [], [], [], [], [], [], [], [], [] ];
    stock = [];
    foundations = 0;
    runs = 0;
    won = false;
    history = [];
    historyIndex = -1;
  }

  reset();

  function deal(redeal=false) {
    stock = redeal ? deck.slice() : shuffle(logic.getCards());
    function pushHidden(column) {
        column.hidden.push(stock.pop());
    }
    function pushHidden(column) {
        column.visible.push(stock.pop());
    }
    for (let row = 1; row <= maxHiddenRows; row++) {
        columns.forEach(pusHidden);
    }
    columns.forEach(pushVisible);
    columns = columns;   // Kick UI.
    // 'stock' still contains remaining cards.
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
