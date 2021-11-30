<script>
  import * as svelte from 'svelte';
  import shuffle from "array-shuffle";
  import * as logic from "./logic.js";
  import * as renderers from "./renderers.js";
  import Card from "./Card.svelte";


  const maxCards = 105;
  const maxHiddenRows = 4;

  const decks = ["Unicode", "Neaveill", "Text", "Compact", "Hex"];

  // Properties.
  export let seed = null;   // Random number seed: 1 to 2,147,483,647.
  export let horizontal = false;  // Horizontal or vertical layout.
  export let peek = true;

  // Reactive variables.
  let deck = 0;
  let game = new logic.SpysolGame();
  let tableau = game.state.tableau.slice();
  let renderer;
  let selection = new logic.Selection();

  $: renderer = new renderers.getRenderer(deck);

  game.deal();

  /*
  const getID = card => card.id;
  tableau.forEach( (c, i) => {
    console.log("Tableau column", i, "reserve =", c.reserve.map(getID));
    console.log("Tableau column", i, "cards =", c.cards.map(getID));
  });
  */

  function onClickCard(colnum, index) {
    console.debug("Clicked card:", ...arguments);
    if (selection.active) {
        const success = game.move(selection.colnum, selection.index, colnum, true);
        if (success) {
            selection.clear();
            tableau[selection.colnum] = game.state.tableau[selection.colnum];
            tableau[colnum] = game.state.tableau[colnum];
        } else {
            console.debug("Move failed.");
        }
    } else {
        selection.set(colnum, index);
        tableau[colnum] = game.state.tableau[colnum];
    }
  }

  function onChangeDeck(event) {
    if (deck < decks.length - 1) {
        deck++;
    } else {
        deck = 0;
    }
  }

  function onChangeLayout(event) {
    horizontal = !horizontal;
  }

  function onChangePeek(event) {
    peek = !peek;
  }


  svelte.onMount(() => {
  });
</script>

<div class="Spysol">
  <header class="Spysol-header">
  </header>

  <p>
    <button on:click={onChangeLayout}>Layout</button>
    <button on:click={onChangePeek}>Peek</button>
    <button on:click={onChangeDeck}>Deck</button>
  </p>

  <!-- BEGIN Tableau -->
  <table id="tableau" class="tableau">
  {#if horizontal}
    {#each tableau as c, colnum}
      <tr>
        <td>
          {#each c.reserve as card, index (card.id)}
          <Card
            card="{card}"
            click="{null}"
            faceUp="{false}"
            peek="{peek}"
            selected="{false}"
            deck="{deck}"
          />
          {/each}
          {#if c.reserve.length}
          |
          {/if}
          {#each c.cards as card, index (card.id)}
          <Card
            card="{card}"
            renderer="{renderer}"
            click="{onClickCard.bind(this, colnum, index)}"
            selected="{selection.isCardSelected(colnum, index)}"
            deck="{deck}"
          />
          {/each}
        </td>
      </tr>
    {/each}
  {:else}
    <tr>
      {#each tableau as c, colnum}
        <td class="reserve">
          {#each c.reserve as card, index (card.id)}
          <div>
          <Card
            card="{card}"
            renderer="{renderer}"
            click="{null}"
            faceUp="{false}"
            peek="{peek}"
            selected="{false}"
            deck="{deck}"
          />
          </div>
          {/each}
        </td>
      {/each}
    </tr>
    <tr>
      {#each tableau as c, colnum}
        <td class="cards">
          {#each c.cards as card, index (card.id)}
          <div>
          <Card
            card="{card}"
            renderer="{renderer}"
            click="{onClickCard.bind(this, colnum, index)}"
            selected="{selection.isCardSelected(colnum, index)}"
            deck="{deck}"
          />
          </div>
          {/each}
        </td>
      {/each}
    </tr>
  {/if}
  </table>
  <!-- End Tableau -->

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
  </details>
  <!-- END Testing -->

</div>
