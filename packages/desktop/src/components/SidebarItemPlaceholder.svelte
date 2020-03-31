{#each Array(0) as _}
  <div class="wrapper">
    <div class="favicon"></div>
    <div class="title"></div>
  </div>
{/each}

<style>
  .wrapper {
    padding: 0 1rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 3rem;
  }

  .title {
    flex: 1;
    user-select: none;
    height: 1rem;
    background: var(--content-background);
  }

  .favicon {
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;
    border-radius: .25rem;
    background: var(--content-background);
  }
</style>
