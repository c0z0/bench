<script>
  import { fly } from "svelte/transition";

  export let title;
  export let favicon;
  export let id;
  export let active;
  export let onClick;
  export let onDragStart;
  export let onDragEnd;
  export let onDragOver;
</script>

<style>
  .wrapper {
    /* padding: 0 1rem; */
    border-bottom: 1px solid var(--border-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: var(--background);
    /* height: 3rem; */

    cursor: pointer;
    -webkit-user-drag: element;
    height: 4rem;
    position: relative;
  }

  .wrapper:not(.active):hover {
    background: var(--content-background);
  }

  /* .wrapper.active { */
  /*   background: var(--primary); */
  /* } *

  /* p { */
  /*   margin: 0; */
  /*   color: var(--foreground); */
  /*   flex: 1; */
  /*   user-select: none; */
  /*   font-size: .9rem; */
  /*   flex: 1; */
  /*   text-overflow: ellipsis; */
  /* } */

  .img {
    width: 4rem;
    height: 4rem;
    /* margin-right: 1rem; */
    border-radius: 0.25rem;
    /* background-color: var(--content-background); */

    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 500;
    font-size: 1.2rem;
    z-index: 1;
  }

  .img.text {
    background-color: var(--content-background);
    width: 2.5rem;
    height: 2.5rem;
    pointer-events: none;
  }

  img {
    pointer-events: none;
    width: 2.5rem;
    height: 2.5rem;
  }

  .knob {
    position: absolute;
    top: 0.75rem;
    bottom: 0.75rem;
    left: -12px;
    border-radius: 0.25rem;

    background: var(--primary);
    width: 12px;
  }

  .wrapper.active .knob {
    left: -6px;
  }

  .bg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.2;
    z-index: 0;
  }

  .wrapper.active .bg {
    background: var(--primary);
  }
</style>

<div
  class="wrapper {active ? 'active' : ''}"
  transition:fly={{ y: 16 }}
  on:click={onClick}
  on:dragstart={onDragStart}
  on:dragend={onDragEnd}
  on:dragover={onDragOver}>
  <div class="knob" />
  <div class="bg" />
  <div class="img" class:text={!favicon}>
    {#if favicon}
      <img src="app-icons/{favicon}" alt="icon" draggable="false" />
    {:else}{title[0]}{/if}
  </div>
</div>
