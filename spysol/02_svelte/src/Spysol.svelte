<script>
  import {onMount} from 'svelte';
  let count = 0;
  onMount(() => {
    const interval = setInterval(() => count++, 1000);
    return () => {
      clearInterval(interval);
    };
  });
</script>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }
  .Spysol {
    text-align: center;
  }

  .Spysol-header {
  }
  .App-link {
    color: #ff3e00;
  }
</style>

<div class="Spysol">
  <header class="Spysol-header">
    <p>Page has been open for <code>{count}</code> seconds.</p>
  </header>
</div>
