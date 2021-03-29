<script>
  import * as svelte from 'svelte';
  import shuffle from "array-shuffle";
  import * as logic from "./logic.js";

  const maxCards = 105;
  const maxHiddenRows = 4;

  // Reactive variables.
  let stock = [];
  let tableau = logic.makeTableau();
  let foundations = 0;
  let runs = 0;
  let won = false;
  let history = [];
  let historyIndex = -1;
  let isHelp = false;
  let isOptions = false;
  let isScores = false;
  let sorted = logic.makeCardDeck();   // For debugging.

  function reset() {
    stock = [];
    tableau = logic.makeTableau();
    foundations = 0;
    history = [];
    historyIndex = -1;
    runs = 0;
    won = false;
  }

  function deal() {
    let cards = logic.makeCardDeck(false, true);
    tableau = logic.makeTableau();
    tableau[0] = cards.splice(0, 6);
    tableau[1] = cards.splice(0, 6);
    tableau[2] = cards.splice(0, 6);
    tableau[3] = cards.splice(0, 6);
    tableau[4] = cards.splice(0, 5);
    tableau[5] = cards.splice(0, 5);
    tableau[6] = cards.splice(0, 5);
    tableau[7] = cards.splice(0, 5);
    tableau[8] = cards.splice(0, 5);
    tableau[9] = cards.splice(0, 5);
    stock = cards;
    tableau[0][-1].faceUp = true;
    tableau[1][-1].faceUp = true;
    tableau[2][-1].faceUp = true;
    tableau[3][-1].faceUp = true;
    tableau[4][-1].faceUp = true;
    tableau[5][-1].faceUp = true;
    tableau[6][-1].faceUp = true;
    tableau[7][-1].faceUp = true;
    tableau[8][-1].faceUp = true;
    tableau[9][-1].faceUp = true;
  }

  $: {
    let count = foundations;
    count += logic.countRuns(tableau[0]);
    count += logic.countRuns(tableau[2]);
    count += logic.countRuns(tableau[2]);
    count += logic.countRuns(tableau[3]);
    count += logic.countRuns(tableau[4]);
    count += logic.countRuns(tableau[5]);
    count += logic.countRuns(tableau[6]);
    count += logic.countRuns(tableau[7]);
    count += logic.countRuns(tableau[8]);
    count += logic.countRuns(tableau[9]);
    if (runs !== count) {
        runs = count;
    }
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
  <!--
  <div id="rows">
    <p>{model.columns[0].hidden.map(x => x.chr).join(" ")} | {model.columns[0].faceUp.map(x => x.chr).join(" ")}</p>
  </div>
  -->
  <details open="open">
    <summary>Testing</summary>
      <h1>Sorted card chars</h1>
      {#each sorted as card (card.id)}
      <span class="card card-chr card-{card.color}">{card.chr}</span>
      {/each}
      <h1>Sorted card names</h1>
      {#each sorted as card (card.id)}
      <span class="card card-name card-{card.color}">{card.name.padStart(3)}</span>
      {/each}
      <p class="card card-chr">&#x1f0a0;</p>
  </details>
</div>
