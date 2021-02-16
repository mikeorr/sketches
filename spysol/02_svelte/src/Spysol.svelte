<script>
  import * as svelte from 'svelte';
  import * as models from "./models.js";

  let deck = new models.Deck()
  let sorted = deck.sorted();
  console.log(sorted.map(x => x.name).join(" "));

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

  .Spysol-header {
  }
  .App-link {
    color: #ff3e00;
  }
</style>

<div class="Spysol">
  <header class="Spysol-header">
  </header>
  <h1>Sorted cards</h1>
  {#each sorted as card (card.id)}
  <span style="font-family: monospace; margin-right: 1em">{card.name} </span>
  {/each}
</div>
