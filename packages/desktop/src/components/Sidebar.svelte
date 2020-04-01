<script>
  import { fly } from "svelte/transition";

  import SidebarItem from "./SidebarItem.svelte";
  import SidebarItemPlaceholder from "./SidebarItemPlaceholder.svelte";
  import CreateButton from "./CreateButton.svelte";

  export let activeId;
  export let urls;
  export let urlsLoading;
  export let onClick;
  export let onCreateClick;
  export let createActive;
  export let onReorder;
  export let onDelete;

  let dragging = null;
  let draggedOverTrash = false;

  const onDragStart = (e, i) => {
    e.dataTransfer.effectAllowed = "move";
    dragging = i;
  };

  const onDragEnd = () => {
    dragging = null;
  };

  const onDragOver = (e, i) => {
    e.preventDefault();

    const overItem = urls[i];
    if (overItem.id === dragging) return;

    onReorder(dragging, i);
  };

  const onDraggedOverTrash = e => {
    e.preventDefault();

    draggedOverTrash = true;
  };

  const onTrashLeave = () => {
    draggedOverTrash = false;
  };
</script>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    background: var(--background);
    border-right: var(--border-color) 1px solid;
    -webkit-app-region: drag;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .apps {
    overflow-y: hidden;
    flex: 1;
  }

  .delete {
    width: 100%;
    background: var(--delete-background);
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 4rem;
  }

  .delete.highlight {
    background: var(--delete-highlight-background);
  }

  *::-webkit-scrollbar {
    display: none;
  }
</style>

<div class="wrapper">
  <div class="apps">
    {#each urls as url, i}
      <SidebarItem
        {...url}
        active={url.id === activeId}
        onClick={() => onClick(url.id)}
        onDragStart={e => onDragStart(e, url.id)}
        onDragEnd={() => onDragEnd()}
        onDragOver={e => onDragOver(e, i)} />
    {/each}
    {#if urlsLoading}
      <SidebarItemPlaceholder />
    {/if}
  </div>
  <div>
    {#if dragging}
      <div
        class="delete"
        class:highlight={draggedOverTrash}
        on:dragover={onDraggedOverTrash}
        on:dragleave={onTrashLeave}
        transition:fly={{ y: 16, duration: 500 }}
        on:drop={() => onDelete(dragging) || onTrashLeave() || onDragEnd()}>
        <img src="icons/trash.svg" alt="trash-icon" />
      </div>
    {/if}
    <CreateButton onClick={onCreateClick} active={createActive} />
  </div>
</div>
