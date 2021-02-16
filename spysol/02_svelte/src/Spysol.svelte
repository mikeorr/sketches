<script>
  import * as svelte from 'svelte';
  import * as models from "./models.js";

  let deck = new models.Deck()
  let sorted = deck.sorted();

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
    /* font-family: serif; */
    /* font-family: sans-serif; */
  }
  .card-black {
    color: black;
  }
  .card-red {
    color: red;
  }
  .card-name {
    font-size: 20px;
  }
  .card-chr {
    font-size: 40px;
  }
</style>

<div class="Spysol">
  <header class="Spysol-header">
  </header>
  <details open="open">
    <summary>Testing</summary>
      <h1>Sorted card names</h1>
      {#each sorted as card (card.id)}
      <span class="card card-name" class:card-red={card.red} class:card-black={!card.red}>
        {card.name.padStart(3)}&nbsp;
      </span>
      {/each}
      <h1>Sorted card chars</h1>
      {#each sorted as card (card.id)}
      <span class="card card-chr {card.red ? 'card-red' : 'card-black'}" style="font-size: 40px">{card.chr}</span>
      {/each}
  </details>
</div>
