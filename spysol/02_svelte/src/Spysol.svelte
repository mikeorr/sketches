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
  export let peek = false;

  // Reactive variables.
  let game = new logic.SpysolGame();

  let selection = new logic.Selection();


  // For debugging.
  let shuffled = logic.getCardDeck();
  let sorted = logic.getCardDeck();
  logic.shuffle(shuffled);

  game.deal();

  function onClick(colnum, index) {
    console.debug("Clicked card:", ...arguments);
    if (selection.active) {
        console.log("Destination click not implemented.");
        selection.clear();
    } else {
        selection.set(colnum, index);
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
      {#each game.columns as c, colnum (c.id)}
        <td>
          {#each c.reserve as card, index (card.id)}
          <div>
          <Card card={card} faceUp={false} peek={peek} />
          </div>
          {/each}
          <hr />
          {#each c.cards as card, index (card.id)}
          <div>
          <Card card="{card}" click="{onClick.bind(this, colnum, index)}" selected="{selection.isCardSelected(colnum, index)}" />
          </div>
          {/each}
        </td>
      {/each}
    </tr>
  {/if}
  </table>
  <!-- End Tableau -->

  <p><button on:click={onChangeLayout}>Change Layout</button></p>

  <!-- BEGIN Help -->
  <details>
    <summary>Help</summary>
    Rules
    Navigation
  </details>
  <!-- END Help -->

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
