<script>
  export let icon;
  export let onClick;
  export let disabled = false;
</script>

<style>
  button {
    padding: 0.25rem;
    margin: 0;
    margin-right: 0.25rem;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
    user-select: none;
    border-radius: 2px;
    -webkit-app-region: no-drag;
  }

  button:not(:disabled):hover {
    background: var(--background);
  }

  img {
    opacity: 0.75;
    height: 1rem;
    width: 1rem;
    cursor: pointer;
  }

  img.logo {
    opacity: 1;
  }

  button:disabled img {
    opacity: 0.25;
  }
</style>

<button on:click={onClick} {disabled}>
  <img
    src="icons/{icon}.svg"
    alt="icon"
    class={icon === 'b-logo' ? 'logo' : ''} />
</button>
