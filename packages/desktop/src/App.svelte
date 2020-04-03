<script>
  import { onDestroy } from "svelte";
  const { ipcRenderer: ipc, remote } = require("electron");

  import Main from "./screens/Main.svelte";
  import About from "./screens/About.svelte";
  import getSystemTheme from "./lib/getSystemTheme.js";

  const { SYSTEM_COLOR } = remote.getGlobal("CONSTS");

  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("p");

  const colors = [
    ...(SYSTEM_COLOR ? ["system"] : []),
    "#fe51bb",
    "#ab55ac",
    "#0072c6",
    "#777",
    "#83bb00",
    "#a12753",
    "#d14526"
  ];

  let activeColor = localStorage.getItem("THEME") || colors[0];
  let themeSetting = localStorage.getItem("IS_DARK") || "dark";

  const isDarkMode = themeSetting => {
    if (themeSetting === "system") {
      return getSystemTheme.getTheme() === "dark";
    }

    return themeSetting === "dark";
  };

  let darkmode;

  $: darkmode = isDarkMode(themeSetting);

  const onColorClick = c => {
    localStorage.setItem("THEME", c);
    ipc.send("update-theme", c);
    activeColor = c;
  };

  const onThemeChange = e => {
    const t = e.target.value;
    themeSetting = t;

    localStorage.setItem("IS_DARK", t);
    ipc.send("update-theme", t);
  };

  ipc.on("update-theme", (e, t) => {
    activeColor = localStorage.getItem("THEME");
    themeSetting = localStorage.getItem("IS_DARK");
  });

  const onSystemThemeChange = () => {
    darkmode = isDarkMode(themeSetting);
  };

  getSystemTheme.listen(onSystemThemeChange);

  onDestroy(() => {
    getSystemTheme.removeListener(onSystemThemeChange);
  });
</script>

<div
  style="--primary: {activeColor === 'system' ? SYSTEM_COLOR : activeColor}"
  class:lightmode={!darkmode}>
  {#if page === 'about'}
    <About
      {colors}
      {activeColor}
      {onColorClick}
      systemColor={SYSTEM_COLOR}
      {onThemeChange}
      {themeSetting} />
  {:else}
    <Main />
  {/if}
</div>
