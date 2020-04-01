<script>
  export let favicon;
  export let onClick;
</script>

<style>
  .wrapper {
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 0.5rem;

    cursor: pointer;
    -webkit-app-region: no-drag;
  }

  .wrapper:hover {
    background: var(--background);
  }

  .icon {
    height: 5rem;
    width: 5rem;

    background-image: url("app-icons/messenger.svg");
    background-size: cover;
  }
</style>

<div class="wrapper" on:click={onClick}>
  <img
    src="app-icons/{favicon}"
    class="icon"
    alt="app-icon"
    draggable="false" />
</div>
