<script>
  import * as svelte from 'svelte';
  import shuffle from "array-shuffle";
  import * as models from "./models.js";

  let deck = new models.Deck()
  let sorted = deck.sorted();
  let shuffled = deck.shuffled();
  sorted.reverse()
  let model = new models.SpysolModel();

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
