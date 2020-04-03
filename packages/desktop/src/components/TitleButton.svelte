<script>
  import { fly } from "svelte/transition";
  export let onClick = () => {};
  export let disabled = false;
  export let label = "";
  export let primary;
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
    color: var(--icon-foreground);
    display: inline-flex;
    align-items: center;
  }

  button.primary {
    color: var(--primary);
  }

  span {
    color: var(--foreground);
    margin-left: 0.5rem;
    font-size: 0.75rem;
  }

  button:not(:disabled):hover {
    background: var(--background);
  }
</style>

<button
  on:click={onClick}
  {disabled}
  transition:fly={{ x: 4, duration: 200 }}
  class:primary>
  <slot />
  {#if label}
    <span>{label}</span>
  {/if}
</button>
