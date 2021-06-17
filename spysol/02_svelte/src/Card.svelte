<script>

// Properties.
export let card;


  //svelte.onMount(() => {
  //});
</script>

<style>
  .card {
    font-family: monospace;
  }
  .card-black {
    color: black;
  }
  .card-red {
    color: red;
  }
  .card-chr {
    font-size: 40px;
  }
</style>

<span class="card card-chr card-{card.color}">{card.chr}</span>
