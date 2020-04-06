<script>
  const { remote, ipcRenderer: ipc } = require("electron");

  import Logo from "../icons/logo.svg";
  import Sun from "../icons/sun.svg";
  import Moon from "../icons/moon.svg";
  import Monitor from "../icons/monitor.svg";
  import Chevron from "../icons/chevron.svg";
  import Volume from "../icons/volume.svg";
  import VolumeOff from "../icons/volumeOff.svg";
  import VolumeMed from "../icons/volumeMed.svg";
  import Toggle from "../components/Toggle.svelte";

  const { VERSION, MUTED, STARTUP_SUPPORTED } = remote.getGlobal("CONSTS");
  const mainApps = remote.getGlobal("apps");

  export let colors;
  export let activeColor;
  export let onColorClick;
  export let onThemeChange;
  export let themeSetting;
  export let systemColor;

  let startup = mainApps.openAtLogin();
  let allowNotifications = mainApps.allowNotifications();
  let mute = mainApps.isMuted();

  const onMuteChange = e => {
    mute = e.target.value;
    ipc.send("mute", mute);
  };

  const onStartupChange = () => {
    startup = !startup;
    ipc.send("startup", startup);
  };

  const onNotificationsChange = () => {
    allowNotifications = !allowNotifications;

    mainApps.toggleNotifications();
  };
</script>

<style>
  main {
    background: var(--background);
    padding: 1rem;
    min-height: calc(100vh - 2rem);
    user-select: none;

    display: flex;

    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--primary);
  }

  .colors {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
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

  a {
    margin-top: 1rem;
  }

  p {
    opacity: 0.25;
  }

  a:hover {
    text-decoration: underline;
  }

  select {
    font-size: 1rem;
    padding: 0.5rem 2.5rem;
    padding-right: 4rem;
    color: var(--foreground);
    -webkit-appearance: none;
    border: 1px solid var(--border-color);
    outline: none;
    background: var(--content-background);
    width: 100%;
  }

  .select-wrapper {
    margin: 0.5rem 0;
    position: relative;
    color: var(--icon-foreground);
    width: 13rem;
  }

  .prefix,
  .sufix {
    pointer-events: none;
    width: 1rem;
    height: 1rem;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .prefix {
    left: 1rem;
  }

  .sufix {
    right: 1rem;
  }

  .toggle-wrapper {
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    color: var(--icon-foreground);
    cursor: pointer;

    width: 13rem;
  }

  .toggle-wrapper span {
    pointer-events: none;
    transition: color 0.2s;
  }

  .toggle-wrapper.checked span {
    color: var(--foreground);
  }
</style>

<main>
  <Logo width="86.4444px" height="24px" />
  <div class="colors">
    {#each colors as color}
      <div
        class="color"
        style="--color: {color === 'system' ? systemColor : color}"
        class:active={color === activeColor}
        on:click={() => onColorClick(color)} />
    {/each}
  </div>
  <div class="select-wrapper">
    <div class="prefix">
      {#if themeSetting === 'dark'}
        <Moon width="100%" height="100%" />
      {:else if themeSetting === 'light'}
        <Sun width="100%" height="100%" />
      {:else}
        <Monitor width="100%" height="100%" />
      {/if}
    </div>
    <select on:change={onThemeChange} value={themeSetting}>
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
    <div class="sufix">
      <Chevron width="100%" height="100%" />
    </div>
  </div>
  <div class="select-wrapper">
    <div class="prefix">
      {#if mute === 'on'}
        <Volume width="100%" height="100%" />
      {:else if mute === 'blur'}
        <VolumeMed width="100%" height="100%" />
      {:else if mute === 'mute'}
        <VolumeOff width="100%" height="100%" />
      {/if}
    </div>
    <select on:change={onMuteChange} value={mute}>
      <option value="on">Sound on</option>
      <option value="blur">When focused</option>
      <option value="mute">Muted</option>
    </select>
    <div class="sufix">
      <Chevron width="100%" height="100%" />
    </div>
  </div>
  <div
    class="toggle-wrapper"
    on:click={onNotificationsChange}
    class:checked={allowNotifications}>
    <Toggle checked={allowNotifications} />
    <span>Allow notifications</span>
  </div>

  {#if STARTUP_SUPPORTED}
    <div
      class="toggle-wrapper"
      on:click={onStartupChange}
      class:checked={startup}>
      <Toggle checked={startup} />
      <span>Open at startup</span>
    </div>
    <a href="https://cserdean.com" rel="noopener noreferrer" target="_blank">
      Built by cserdean.com
    </a>
    <p>Version {VERSION}</p>
  {/if}
</main>
