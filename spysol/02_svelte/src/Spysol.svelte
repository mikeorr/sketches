<script>
  import * as svelte from 'svelte';
  import shuffle from "array-shuffle";
  import * as logic from "./logic.js";
  import Card from "./Card.svelte";

  const maxCards = 105;
  const maxHiddenRows = 4;

  // Properties.
  export let seed = null;   // Random number seed: 1 to 2,147,483,647.
  export let horizontal = false;  // Horizontal or vertical layout.

  // Reactive variables.
  let game = new logic.SpysolGame();
  let stock;
  let reserve;
  let tableau;
  let foundations;
  let runs;
  let won;
  let history;
  let historyIndex;
  let isHelp = false;
  let isOptions = false;
  let isScores = false;


  // For debugging.
  let shuffled = logic.getCardDeck();
  let sorted = logic.getCardDeck();
  logic.shuffle(shuffled);

  function clear() {
    stock = [];
    reserve = logic.makeTableau();
    tableau = logic.makeTableau();
    foundations = logic.makeTableau();
    history = [];
    historyIndex = -1;
    runs = 0;
    won = false;
  }

  function deal() {
    let i;
    let cards = logic.getCardDeck();
    logic.shuffle(cards);
    for (i of logic.tableauRange) {
        reserve[i] = cards.splice(0, 4);
    }
    for (i of logic.tableauRange) {
        tableau[i].push(cards.shift());
        tableau[i] = tableau[i];
    }
    stock = cards;
  }

  clear();
  deal();

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

  function onChangeLayout(event) {
    horizontal = !horizontal;
  }


  svelte.onMount(() => {
  });
</script>

<div class="Spysol">
  <header class="Spysol-header">
  </header>

  <!-- BEGIN Tableau -->
  <table id="tableau" class="tableau">
  {#if horizontal}
  <p>Horizontal layout under construction.</p>
  {:else}
    <tr>
      {#each logic.tableauRange as i (i)}
        <td>
          {#each reserve[i] as card (card.id)}
          <div>
          <Card card={card} />
          </div>
          {/each}
          <div>
          <Card card={tableau[i][0]} />
          </div>
        </td>
      {/each}
    </tr>
  {/if}
  </table>
  <!-- End Tableau -->

  <p><button on:click={onChangeLayout}>Change Layout</button></p>

  <!-- BEGIN Testing -->
  <details>
    <summary>Testing</summary>
      <h1>Shuffled card components</h1>
      {#each shuffled as card (card.id)}
      <Card card={card} />
      {/each}
      <h1>Sorted card components</h1>
      {#each sorted as card (card.id)}
      <Card card={card} />
      {/each}
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
  <!-- END Testing -->

</div>
