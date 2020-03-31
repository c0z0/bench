<script>
  export let icon;
  export let onClick;
  export let disabled = false;
</script>

<button on:click={onClick} disabled={disabled}><img src="icons/{icon}.svg" alt="icon" class={icon === 'b-logo' ? 'logo' : ''}></button>

<style>
  button {
    padding: .25rem;
    margin: 0;
    margin-right: .25rem;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
    user-select: none;
    border-radius: 2px;
  }


  button:not(:disabled):hover {
    background: var(--background);
  }

  img {
    opacity: .75;
    height: 1rem;
    width: 1rem;
  } 

  img.logo {
    opacity: 1;
  }

  button:disabled img {
    opacity: .25;
  }

</style>
