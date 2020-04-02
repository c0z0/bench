<script>
  import Logo from "../icons/logo.svg";
  const { remote } = require("electron");

  const { VERSION } = remote.getGlobal("CONSTS");

  export let colors;
  export let activeColor;
  export let onColorClick;
</script>

<style>
  main {
    background: var(--background);
    padding: 1rem;
    min-height: calc(100vh - 2rem);

    display: flex;

    flex-direction: column;
    align-items: center;
    color: var(--primary);
  }

  .colors {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .color {
    background: var(--color);
    content: "";
    height: 2rem;
    width: 2rem;
    border: 0.25rem solid transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    margin: 0.5rem;
    margin-top: 0;
  }

  .color.active {
    border-color: var(--foreground);
  }

  a,
  p {
    color: var(--foreground) !important;
    opacity: 0.5;
    text-decoration: none;
    margin: 0.25rem 0;
  }

  p {
    opacity: 0.25;
  }

  a:hover {
    text-decoration: underline;
  }
</style>

<main>
  <Logo width="86.4444px" height="24px" />
  <div class="colors">
    {#each colors as color}
      <div
        class="color"
        style="--color: {color}"
        class:active={color === activeColor}
        on:click={() => onColorClick(color)} />
    {/each}
  </div>
  <a href="https://cserdean.com" rel="noopener noreferrer" target="_blank">
    Built by cserdean.com
  </a>
  <p>Version {VERSION}</p>
</main>
