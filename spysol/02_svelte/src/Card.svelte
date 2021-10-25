<script>
  import * as renderers from "./renderers.js";

  // Properties.
  export let card = {id: 0, rank: 1, suit: 0};
  export let click = null;
  export let faceUp = true;
  export let peek = false;
  export let deck = "unicode";
  export let selected = false;


  // Other reactive variables.
  let classes;
  let content;
  let renderer;

  function  getContent(card, side) {
    if (side != 3) {
        return getCardChar();
    } else {
        return BACK;
    }
  }

  $: renderer = new renderers.UnicodeCardRenderer(card, faceUp, peek, selected);
  $: classes = renderer.getClasses().join(" ");
  $: content = renderer.getContent();


  //svelte.onMount(() => {
  //});
</script>

<style>
  .card {
    font-family: monospace;
  }
  .card-chr {
    font-size: 40px;
  }
  .card-black {
    color: black;
    background-color: white;
  }
  .card-red {
    color: red;
    background-color: white;
  }
  .card-black-peek {
    color: gray;
    background-color: white;
  }
  .card-red-peek {
    color: salmon;
    background-color: white;
  }
  .card-black-selected {
    color: white;
    background-color: black;
  }
  .card-red-selected {
    color: red;
    background-color: black;
  }
</style>

{#if click}
<span class="{classes}" on:click="{click}">{content}</span>
{:else}
<span class="{classes}">{content}</span>
{/if}
