<script>
  export let activeUrl;
</script>

<style>
  main {
    width: 100%;
    height: 100%;
    background: var(--content-background);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h5 {
    margin: 0;
    color: var(--foreground-secondary);
  }
</style>

<main>
  {#if !activeUrl}
    <h2>🤷 No apps...</h2>
    <h5>Add an app from the sidebar</h5>
  {/if}
</main>
