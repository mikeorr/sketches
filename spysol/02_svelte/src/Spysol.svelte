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
    margin-right: 1em;
    text-align: right;
  }
  .card-black {
    color: black;
  }
  .card-red {
    color: red;
  }
</style>

<div class="Spysol">
  <header class="Spysol-header">
  </header>
  <h1>Sorted cards</h1>
  {#each sorted as card (card.id)}
  <span class="card {card.red ? 'card-red' : 'card-black'}">
    {card.name} <!--{card.chr}-->
  </span>
  {/each}
</div>
