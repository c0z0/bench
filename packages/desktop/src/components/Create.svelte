<script>
  import CreateItem from "./CreateItem.svelte";
  import Chevron from "../icons/chevron.svg";

  export let onCreate;
  export let predefinedApps;

  let url = "";
  let expanded = false;

  let innerRef = null;
  let inputRef = null;
  let expandoHeight;

  $: expandoHeight = innerRef ? innerRef.offsetHeight : 0;

  const onExpand = () => {
    expanded = !expanded;

    if (expanded) inputRef.focus();
  };

  const onSubmit = e => {
    e.preventDefault();
    onCreate({ url });
  };
</script>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    background: var(--content-background);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .predefined {
    position: relative;
  }

  .scroll {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    max-width: 35rem;

    padding-bottom: 1rem;
    height: 20rem;
    overflow-x: scroll;
  }

  .fadeout {
    border-bottom: 1px solid var(--border-color);
    position: relative;
    bottom: 4rem;
    left: 0;
    right: 0;
    height: 4rem;
    pointer-events: none;

    background: linear-gradient(transparent, var(--content-background));
    opacity: 0.95;
  }

  h4 {
    width: 100%;
    max-width: 35rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;
    user-select: none;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    max-width: 35rem;
  }

  .outer {
    width: 100%;
    max-width: 35rem;

    height: var(--height);
    opacity: var(--opacity);
    transition: height 0.2s, opacity 0.2s;
    overflow: hidden;
  }

  input {
    padding: 0.75rem 2rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    background: var(--background);
    border: none;
    outline: none;
    color: var(--foreground);
    border-radius: 0.5rem;
  }

  input#url {
    width: calc(100% - 4rem);
  }

  input#submit {
    background: var(--foreground);
    padding: 0;
    text-align: center;
    min-width: 140px;
    cursor: pointer;
    color: var(--background);
    height: 40px;
  }

  .chevron {
    transition: transform 0.2s;
    transform: rotate(0);
  }

  .chevron.expanded {
    transform: rotate(180deg);
  }
</style>

<div class="wrapper">
  <h2>Add an app</h2>
  <div class="predefined">
    <div class="scroll">
      {#each predefinedApps as p}
        <CreateItem favicon={p.favicon} onClick={() => onCreate(p)} />
      {/each}
    </div>
    <div class="fadeout" />
  </div>
  <h4 on:click={onExpand}>
    <span>Or bring your own</span>
    <span class="chevron" class:expanded>
      <Chevron width="20px" height="20px" />
    </span>
  </h4>
  <div
    class="outer"
    style="--height: {expanded ? expandoHeight : 0}px; --opacity: {expanded ? 1 : 0}">
    <form on:submit={onSubmit} bind:this={innerRef}>
      <input
        type="url"
        id="url"
        placeholder="Enter a URL..."
        bind:this={inputRef}
        bind:value={url}
        required />
      <input type="submit" id="submit" />
    </form>
  </div>
</div>
