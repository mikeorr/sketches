<script>
  import * as svelte from 'svelte';
  import shuffle from "array-shuffle";
  import * as logic from "./logic.js";
  import Card from "./Card.svelte";

  const maxCards = 105;
  const maxHiddenRows = 4;

  const decks = ["Unicode", "Neaveill", "Text"];

  // Properties.
  export let seed = null;   // Random number seed: 1 to 2,147,483,647.
  export let horizontal = false;  // Horizontal or vertical layout.
  export let peek = true;

  // Reactive variables.
  let deck = 0;
  let game = new logic.SpysolGame();
  let selection = new logic.Selection();


  // For debugging.
  let shuffled = logic.getCardDeck();
  let sorted = logic.getCardDeck();
  logic.shuffle(shuffled);

  game.deal();

  function onClickCard(colnum, index) {
    console.debug("Clicked card:", ...arguments);
    if (selection.active) {
        const success = game.move(selection.colnum, selection.index, colnum, true);
        if (success) {
            selection.clear();
            game.columns[selection.colnum] = game.columns[selection.colnum];
            game.columns[colnum] = game.columns[colnum];
        } else {
            console.debug("Move failed.");
        }
    } else {
        selection.set(colnum, index);
        game.columns[colnum] = game.columns[colnum];
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

  <!-- BEGIN Tableau -->
  <table id="tableau" class="tableau">
  {#if horizontal}
    {#each game.columns as c, colnum (c.id)}
      <tr>
        <td>
          {#each c.reserve as card, index (card.id)}
          <Card
            card="{card}"
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
      {#each game.columns as c, colnum (c.id)}
        <td>
          {#each c.reserve as card, index (card.id)}
          <div>
          <Card
            card="{card}"
            faceUp="{false}"
            peek="{peek}"
            selected="{false}"
            deck="{deck}"
          />
          </div>
          {/each}
          {#if c.reserve.length}
          <hr />
          {/if}
          {#each c.cards as card, index (card.id)}
          <div>
          <Card
            card="{card}"
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

  <p>
    <button on:click={onChangeLayout}>Layout</button>
    <button on:click={onChangePeek}>Peek</button>
    <button on:click={onChangeDeck}>Deck</button>
  </p>

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
