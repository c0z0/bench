<script>
  import Sidebar from "../components/Sidebar.svelte";
  import Titlebar from "../components/Titlebar.svelte";
  import PagePlaceholder from "../components/PagePlaceholder.svelte";
  import Create from "../components/Create.svelte";

  const { remote, ipcRenderer: ipc } = require("electron");
  const {
    SIDEBAR_WIDTH,
    TITLEBAR_HEIGHT,
    PRED_APPS,
    WINDOWS
  } = remote.getGlobal("CONSTS");

  const ADD_ID = "add";

  let urls = JSON.parse(localStorage.getItem("URLS")) || [];
  let urlsLoading = false;
  let activeId = null;

  const updateUrls = newUrls => {
    localStorage.setItem("URLS", JSON.stringify(newUrls));
    urls = newUrls;
  };

  ipc.on("update-apps", (e, apps) => {
    updateUrls(apps);
    urlsLoading = false;

    if (urls.length) activeId = urls[0].id;
  });

  ipc.on("app-created", (e, apps) => {
    updateUrls(apps);
    activeId = apps[apps.length - 1].id;
  });

  const onSidebarClick = id => {
    ipc.send("focus", id);
    activeId = id;
  };

  const onCreateClick = () => {
    activeId = ADD_ID;
    ipc.send("hide");
  };

  const onCreate = app => {
    ipc.send("create", app);
  };

  const onReorder = (draggingId, overIndex) => {
    const dragedItem = urls.find(u => u.id === draggingId);
    const newUrls = urls.filter(u => u.id !== draggingId);

    newUrls.splice(overIndex, 0, dragedItem);

    ipc.send("update-apps", newUrls);

    updateUrls(newUrls);
  };

  const onDelete = id => {
    const newUrls = urls.filter(u => u.id !== id);

    if (id === activeId) {
      if (newUrls.length) onSidebarClick(newUrls[0].id);
      else ipc.send("hide");
    }

    ipc.send("update-apps", newUrls);

    updateUrls(newUrls);
  };
</script>

<style>
  main {
    -webkit-user-drag: drag;
    height: 100vh;
    width: 100vw;

    display: grid;

    grid-template-columns: var(--sidebar-width) auto;
    grid-template-rows: var(--titlebar-height) auto;
    overflow: hidden;
  }

  #sidebar {
    grid-column: 1 / span 1;
    grid-row: 2 / span 1;
  }

  #titlebar {
    grid-column: 1 / span 2;
    grid-row: 1 / span 1;
  }

  #placeholder {
    background: white;
    grid-column: 2 / span 1;
    grid-row: 2 / span 1;
  }
</style>

<main
  style="--sidebar-width: {SIDEBAR_WIDTH}px; --titlebar-height: {TITLEBAR_HEIGHT}px">
  <div id="sidebar">
    <Sidebar
      {urls}
      {urlsLoading}
      {activeId}
      onClick={onSidebarClick}
      {onCreateClick}
      createActive={activeId === ADD_ID}
      {onReorder}
      {onDelete} />
  </div>
  <div id="titlebar">
    <Titlebar
      activeId={activeId === ADD_ID ? null : activeId}
      windows={WINDOWS} />
  </div>
  <div id="placeholder">
    {#if urls.length === 0 && activeId !== ADD_ID}
      <PagePlaceholder />
    {/if}
    {#if activeId === ADD_ID}
      <Create
        {onCreate}
        predefinedApps={PRED_APPS.filter(a => !urls.find(u => u.url === a.url))} />
    {/if}
  </div>
</main>
