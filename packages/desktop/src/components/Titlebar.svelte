<script>
  const { ipcRenderer: ipc, remote } = require("electron");

  import TitleButton from "./TitleButton.svelte";
  import BLogo from "../icons/blogo.svg";

  export let activeId;
  export let windows;
  const win = remote.getCurrentWindow();

  let maximized = win.isMaximized();

  const onRefresh = () => ipc.send("refresh", activeId);
  const onForward = () => ipc.send("forward", activeId);
  const onBackward = () => ipc.send("backward", activeId);
  const onAbout = () => ipc.send("about");

  const onToggleMaximize = () => {
    maximized = win.isMaximized();
  };

  ipc.on("max", onToggleMaximize);

  $: disabled = activeId === null;

  const onMin = () => win.minimize();
  const onMax = () => win.maximize();
  const onUnmax = () => win.unmaximize();
  const onClose = () => win.close();
</script>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--content-background);
    border-right: var(--border-color) 1px solid;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 70px;
    /* justify-content: flex-end; */
    -webkit-app-region: drag;
  }

  .wrapper.windows {
    padding-left: 6px;
  }

  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    opacity: 0.5;
    -webkit-app-region: drag;
  }

  #window-controls {
    display: grid;
    grid-template-columns: repeat(3, 46px);
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
  }

  #window-controls .button {
    grid-row: 1 / span 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  #min-button {
    grid-column: 1;
  }
  #max-button,
  #restore-button {
    grid-column: 2;
  }
  #close-button {
    grid-column: 3;
  }

  #window-controls {
    -webkit-app-region: no-drag;
  }

  #window-controls .button {
    user-select: none;
  }
  #window-controls .button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  #window-controls .button:active {
    background: rgba(255, 255, 255, 0.2);
  }

  #close-button:hover {
    background: #e81123 !important;
  }
  #close-button:active {
    background: #f1707a !important;
  }
  #close-button:active .icon {
    filter: invert(1);
  }

  #restore-button {
    display: none !important;
  }

  .maximized #restore-button {
    display: flex !important;
  }

  .maximized #max-button {
    display: none;
  }

  .wrapper:not(.windows) #window-controls {
    display: none;
  }
</style>

<div class="wrapper" class:windows>
  <div>
    <TitleButton onClick={onAbout}>
      <BLogo height="16px" width="16px" />
    </TitleButton>
    <TitleButton {disabled} onClick={onBackward} icon="arrow-left" />
    <TitleButton {disabled} onClick={onForward} icon="arrow-right" />
    <TitleButton {disabled} onClick={onRefresh} icon="refresh" />
  </div>
  <p>bench</p>
  <div id="window-controls" class:maximized>
    <div class="button" id="min-button" on:click={onMin}>
      <img
        class="icon"
        alt="min"
        srcset="window-icons/min-w-10.png 1x, window-icons/min-w-12.png 1.25x,
        window-icons/min-w-15.png 1.5x, window-icons/min-w-15.png 1.75x,
        window-icons/min-w-20.png 2x, window-icons/min-w-20.png 2.25x,
        window-icons/min-w-24.png 2.5x, window-icons/min-w-30.png 3x,
        window-icons/min-w-30.png 3.5x"
        draggable="false" />
    </div>

    <div class="button" id="max-button" on:click={onMax}>
      <img
        class="icon"
        alt="max"
        srcset="window-icons/max-w-10.png 1x, window-icons/max-w-12.png 1.25x,
        window-icons/max-w-15.png 1.5x, window-icons/max-w-15.png 1.75x,
        window-icons/max-w-20.png 2x, window-icons/max-w-20.png 2.25x,
        window-icons/max-w-24.png 2.5x, window-icons/max-w-30.png 3x,
        window-icons/max-w-30.png 3.5x"
        draggable="false" />
    </div>

    <div class="button" id="restore-button" on:click={onUnmax}>
      <img
        alt="restore"
        class="icon"
        srcset="window-icons/restore-w-10.png 1x, window-icons/restore-w-12.png
        1.25x, window-icons/restore-w-15.png 1.5x, window-icons/restore-w-15.png
        1.75x, window-icons/restore-w-20.png 2x, window-icons/restore-w-20.png
        2.25x, window-icons/restore-w-24.png 2.5x, window-icons/restore-w-30.png
        3x, window-icons/restore-w-30.png 3.5x"
        draggable="false" />
    </div>

    <div class="button" id="close-button" on:click={onClose}>
      <img
        class="icon"
        alt="close"
        srcset="window-icons/close-w-10.png 1x, window-icons/close-w-12.png
        1.25x, window-icons/close-w-15.png 1.5x, window-icons/close-w-15.png
        1.75x, window-icons/close-w-20.png 2x, window-icons/close-w-20.png
        2.25x, window-icons/close-w-24.png 2.5x, window-icons/close-w-30.png 3x,
        window-icons/close-w-30.png 3.5x"
        draggable="false" />
    </div>

  </div>
</div>
