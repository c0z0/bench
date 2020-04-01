<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import VanillaTilt from "vanilla-tilt";
  import { clickOutside } from "../utils/clickOutside.js";
  import AppleLogo from "../icons/apple.svg";
  import WindowsLogo from "../icons/windows.svg";
  import UbuntuLogo from "../icons/ubuntu.svg";

  let dropdown = false;

  const onDropDownClick = () => {
    dropdown = !dropdown;
  };

  const onDropDownClickOutside = () => {
    dropdown = false;
  };

  onMount(() => {
    const screenshot = document.querySelectorAll(".tilt");

    VanillaTilt.init(screenshot, {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.5,
      scale: 1.05,
      startX: 10
    });

    return () => screenshot.vanillaTilt.destroy();
  });
</script>

<style>
  main {
    max-width: 782pt;
    margin: 0 auto;
    padding: 0 2rem;
  }
  .hero {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    margin: 0;
    margin-bottom: 0.5rem;
  }

  h2 {
    margin: 0;
    font-size: 2.75rem;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 3rem;
  }

  .tilt {
    border-radius: 0.25rem;
    overflow: hidden;
    position: relative;
  }

  .img-wrapper {
    flex: 1.5;
    margin: 0.5rem;
  }

  .screenshot {
    width: 100%;
    margin-bottom: -4px; /* argh */
  }

  .logo {
    height: 3rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .title-wrapper {
    margin-right: 3rem;
    flex: 1.1;
  }

  svg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  .download {
    color: var(--primary);
    padding: 0.8rem 0;
    border-radius: 0.25rem;
    background: var(--background);
    cursor: pointer;
    display: flex;
    width: 10rem;
    justify-content: center;
    position: relative;
    outline: none;
    border: none;
    font-size: 1rem;
    font-weight: 500;
  }

  .dropdown {
    position: absolute;
    background: var(--foreground);
    top: calc(100% + 0.6rem);
    left: 0;
    right: 0;
    border-radius: 0.25rem;
    /* border-top-left-radius: 0; */
    /* border-top-right-radius: 0; */
  }

  .dropdown:before {
    content: "";
    display: inline-block;
    position: absolute;
    height: 0.5rem;
    width: 0.5rem;
    background: var(--foreground);
    left: 50%;
    top: -4px;
    transform: translateX(-50%) rotate(45deg);
    z-index: -1;
    border-bottom: none;
    border-right: none;
  }

  .dropdown-item {
    display: flex;
    color: var(--background) !important;
    padding: 0.75rem 1rem;
    text-decoration: none;
  }

  .dropdown-item:first-child {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }

  .dropdown-item:last-child {
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  .dropdown-item:not(:last-child) {
    border-bottom: 1px #ddd solid;
  }

  .dropdown-item:hover {
    background: #eee;
  }

  .chevron {
    margin-right: 0.5rem;
    height: 1rem;
    vertical-align: text-bottom;
    display: none;
  }

  .by {
    display: block;
    margin-top: 1rem;
    color: var(--foreground) !important;
    text-decoration: none;
  }

  .by:hover {
    text-decoration: underline;
  }

  .screenshot-mobile {
    display: none;
  }

  @media screen and (max-width: 992px) {
    .hero {
      align-items: flex-end;
    }
    .img-wrapper,
    svg {
      display: none;
    }

    .title-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0;
      padding-bottom: 8rem;
    }

    h1 {
      font-size: 3rem;
    }

    h2 {
      font-size: 2rem;
    }

    .logo {
      height: 2.5rem;
    }

    p,
    h1,
    h2 {
      text-align: center;
    }

    .screenshot-mobile {
      width: 100%;
      display: block;
    }

    .img-wrapper-mobile {
      max-width: 500px;
      margin: 2rem 0;
      width: 80%;
    }
  }

  @media screen and (max-height: 700px) {
    .hero {
      align-items: center;
    }

    .title-wrapper {
      padding-bottom: 0;
    }
  }
</style>

<svelte:head>
  <title>bench - your new workspace</title>
  <meta
    name="description"
    content="Bench is a single app that meets all your online communication
    needs." />
</svelte:head>

<main>
  <div class="hero">
    <div class="title-wrapper">
      <h1>
        Meet
        <img src="logo.svg" alt="logo" class="logo" />
      </h1>
      <h2>your new workspace</h2>
      <div class="tilt img-wrapper-mobile">
        <img
          src="/screenshot-sh.png"
          alt="screenshot"
          class="screenshot-mobile" />
      </div>
      <p>
        Bench is a single app that meets all your online communication needs.
      </p>
      <button
        class="download"
        class:dropdown-open={dropdown}
        on:click={onDropDownClick}
        use:clickOutside
        on:click_outside={onDropDownClickOutside}>
        <img src="/chevron-down.svg" alt="chevron" class="chevron" />
        Download
        {#if dropdown}
          <div class="dropdown" transition:fly={{ y: -8, duration: 300 }}>
            <a
              href="http://hazel.bench.cserdean.com/download/dmg"
              class="dropdown-item">
              <AppleLogo height="16px" width="24px" />
              for Mac
            </a>
            <a
              href="http://hazel.bench.cserdean.com/download/exe"
              class="dropdown-item">
              <WindowsLogo height="16px" width="24px" />
              for Windows
            </a>
            <!--
            <a href="" class="dropdown-item">
              <UbuntuLogo height="16px" width="24px" />
              for Ubuntu
            </a>
            !-->
          </div>
        {/if}
      </button>
      <a href="https://cserdean.com" class="by">Built by cserdean.com</a>
    </div>
    <div class="img-wrapper tilt">
      <img src="/screenshot-sh.png" alt="Screenshot" class="screenshot" />
    </div>
  </div>
  <svg viewBox="0 0 100 100" class="sc-kgoBCf iQWuJD">
    <polygon
      points="55,0 100,0 100,100 55,100"
      fill="url(#prefix__paint0_linear)" />
    <defs>
      <linearGradient
        id="prefix__paint0_linear"
        x1="100"
        y1="100"
        x2="33"
        y2="100"
        gradientUnits="userSpaceOnUse">
        <stop stop-color="#222" />
        <stop offset="1" stop-color="#111" />
      </linearGradient>
    </defs>
  </svg>
</main>
