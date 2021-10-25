<script>
  import * as renderers from "./renderers.js";

  // Properties.
  export let card = {id: 0, rank: 1, suit: 0};
  export let click = null;
  export let faceUp = true;
  export let peek = false;
  export let deck = 0;
  export let selected = false;


  // Other reactive variables.
  let classes;
  let content;
  let renderer;

  function getRenderer(card, faceUp, peek, selected, deck) {
    switch (deck) {
        case 1:
            return new renderers.NeaveillCardRenderer(card, faceUp, peek, selected);
        case 2:
            return new renderers.TextCardRenderer(card, faceUp, peek, selected);
        default:
            return new renderers.UnicodeCardRenderer(card, faceUp, peek, selected);
    }
  }

  $: renderer = new getRenderer(card, faceUp, peek, selected, deck);
  $: classes = renderer.getClasses().join(" ");
  $: content = renderer.getContent();


  //svelte.onMount(() => {
  //});
</script>

<style>
  .card {
    font-family: monospace;
  }
  .unicode {
    font-size: 40px;
  }
  .text {
    font-size: 20px;
    border: solid 1px;
  }
  .neaveill {
    font-family: neaveill;
    font-size: 40px;
  }
  .black {
    color: black;
    background-color: white;
  }
  .red {
    color: red;
    background-color: white;
  }
  .black-peek {
    color: gray;
  }
  .red-peek {
    color: salmon;
  }
  .black-selected {
    color: white;
    background-color: black;
  }
  .red-selected {
    color: red;
    background-color: black;
  }
  .back {
    color: gray;
  }
</style>

{#if click}
<span class="{classes}" on:click="{click}">{content}</span>
{:else}
<span class="{classes}">{content}</span>
{/if}
