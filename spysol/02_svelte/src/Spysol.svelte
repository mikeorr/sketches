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


  // For debugging.
  let shuffled = logic.getCardDeck();
  let sorted = logic.getCardDeck();
  logic.shuffle(shuffled);

  game.deal();

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
      {#each game.columns as c (c.id)}
        <td>
          {#each c.reserve as card (card.id)}
          <div>
          <Card card={card} />
          </div>
          {/each}
          {#each c.cards as card (card.id)}
          <div>
          <Card card={card} />
          </div>
          {/each}
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
