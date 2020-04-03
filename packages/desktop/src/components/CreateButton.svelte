<script>
  import Plus from "../icons/plus.svg";

  export let onClick;
  export let active;
</script>

<style>
  button {
    /* padding: 0 1rem; */
    width: 100%;
    background: var(--background);
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
    -webkit-app-region: no-drag;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
  }

  button:hover {
    background: var(--content-background);
  }

  button.active {
    background: var(--primary);
  }

  .img {
    background: var(--content-background);
    padding: 0.25rem;
    width: 1.75rem;
    height: 1.75rem;
    /* margin-right: 1rem; */
    border-radius: 0.25rem;
    color: var(--icon-foreground);
  }

  button.active .img {
    background: none;
    color: #fffa;
  }
</style>

<button on:click={onClick} class={active ? 'active' : ''}>
  <div class="img">
    <Plus height="100%" width="100%" />
  </div>
</button>
