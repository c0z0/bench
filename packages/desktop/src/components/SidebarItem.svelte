<script>
  export let title;
  export let favicon;
  export let id;
  export let active;
  export let onClick;
  export let onDragStart;
  export let onDragEnd;
  export let onDragOver;
</script>

<div class="wrapper {active ? 'active' : ''}" on:click={onClick} on:dragstart={onDragStart} on:dragend={onDragEnd} on:dragover={onDragOver}>
  <div class="img" class:text={!favicon}>
    {#if favicon}
      <img src="app-icons/{favicon}" alt="icon" draggable="false" />
    {:else}
      {title[0]}
    {/if}
  </div>
  <!-- <p>{title}</p> !-->
</div>

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
    -webkit-app-region: no-drag;
    height: 4rem;
  }

  .wrapper:hover {
    background: var(--content-background);
  }

  .wrapper.active {
    background: var(--primary);
  }

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
    border-radius: .25rem;
    /* background-color: var(--content-background); */

    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 500;
    font-size: 1.2rem;
  }

  .img.text {
    background-color: var(--content-background);
    width: 2.5rem;
    height: 2.5rem;
  }

  img {
    width: 2.5rem;
    height: 2.5rem;
  }
</style>
