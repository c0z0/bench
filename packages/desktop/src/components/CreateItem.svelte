<script>
  export let favicon;
  export let onClick;
</script>

<div class="wrapper" on:click={onClick}>
  <img src="app-icons/{favicon}" class="icon" alt="app-icon">
</div>

<style>
  .wrapper {
    padding: 1rem;
    margin: .5rem;
    border-radius: .5rem;

    cursor: pointer;
  }

  .wrapper:hover {
    background: var(--background);
  }

  .icon {
    height: 5rem;
    width: 5rem;

    background-image: url('app-icons/messenger.svg');
    background-size: cover;
  }
</style>
