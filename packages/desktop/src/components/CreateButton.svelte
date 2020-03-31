<script>
  export let onClick;
  export let active;
</script>

<button on:click={onClick} class={active ? 'active' : ''}><img alt="add-icon" src="icons/plus.svg" draggable="false"></button>

<style>
  button {
    /* padding: 0 1rem; */
    width: 100%;
    background: none;
    color: var(--foreground);
    border: none;
    border-top: 1px solid var(--border-color);
    outline: none;
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 4rem;
    cursor: pointer;
  }

  button:hover {
    background: var(--content-background);
  }

  button.active {
    background: var(--primary);
  }

  img {
    background: var(--content-background);
    opacity: .66;
    padding: .25rem;
    width: 1.75rem;
    height: 1.75rem;
    /* margin-right: 1rem; */
    border-radius: .25rem;
  }

  button.active img {
    background: none;
  }
</style>
