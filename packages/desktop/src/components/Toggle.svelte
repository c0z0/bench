<script>
  import { createEventDispatcher } from "svelte";

  export let checked = false;

  const dispatch = createEventDispatcher();
  const onClick = () => dispatch("change", !checked);
</script>

<style>
  .rail {
    width: 2rem;
    height: 1rem;
    background: var(--content-background);
    border-radius: 0.5rem;
    transition: background 0.2s;
    cursor: pointer;
    position: relative;
  }

  .rail.checked {
    background: var(--primary);
  }

  .knob {
    height: 0.8rem;
    width: 0.8rem;
    border-radius: 100%;
    background: var(--background);
    position: absolute;
    top: 0.1rem;
    left: 0.1rem;
    transition: left 0.2s;
  }

  .rail.checked .knob {
    left: 1.1rem;
  }
</style>

<div class="rail" class:checked on:click={onClick}>
  <div class="knob" />
</div>
