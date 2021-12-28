<script>
  // Properties.


  // Other reactive variables.
  let classes;
  let content;

  $: classes = "card compact black";
  $: content = "?";


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
  .compact {
  }
  .hex {
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

<span class="{classes}" on:click="{click}">{content}</span>
