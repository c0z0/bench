<script>
  import { fly } from 'svelte/transition'
  let dropdown = false;

  const onDropDownClick = () => {
    dropdown = !dropdown
  }
</script>
<svelte:head>
	<title>bench - your new workspace</title>
</svelte:head>

<main>
  <div class="hero">
    <div class="title-wrapper">
      <h1>
        Meet <img src="logo.svg" alt="logo" class="logo"> 
      </h1>
      <h2>your new workspace</h2>
      <img src="/screenshot-sm.png" alt="screenshot" class="screenshot-mobile">
      <p>Bench is a single app that meets all your online communication needs.</p>
      <button class="download" class:dropdown-open={dropdown} on:click={onDropDownClick}>
        <img src="/chevron-down.svg" alt="chevron" class="chevron">Download
        {#if dropdown}
          <div class="dropdown" transition:fly="{{y: -8, duration: 300}}">
            <a href="" class="dropdown-item">
              <img src="/apple-logo.svg" alt="apple-logo" class="download-logo">
              for Mac
            </a>
            <a href="" class="dropdown-item">
              <img src="/windows-logo.svg" alt="windows-logo" class="download-logo">
              for Windows
            </a>
            <a href="" class="dropdown-item">
              <img src="/ubuntu-logo.svg" alt="ubuntu-logo" class="download-logo">
              for Ubuntu
            </a>
          </div>
        {/if}
      </button>
      <a href="https://cserdean.com" class="by">Built by cserdean.com</a>
    </div>
    <div class="img-wrapper">
      <img src="/screenshot-sm.png" alt="Screenshot" class="screenshot">
    </div>
  </div>
  <svg viewBox="0 0 100 100" class="sc-kgoBCf iQWuJD"><polygon points="55,0 100,0 100,100 55,100" fill="url(#prefix__paint0_linear)"></polygon><defs><linearGradient id="prefix__paint0_linear" x1="100" y1="100" x2="33" y2="100" gradientUnits="userSpaceOnUse"><stop stop-color="#222"></stop><stop offset="1" stop-color="#111"></stop></linearGradient></defs></svg>
</main>

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
    margin-bottom: .5rem;
  }

  h2 {
    margin: 0;
    font-size: 2.75rem;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 3rem;
  }

  .img-wrapper {
    flex: 1.5;
  }

  .screenshot {
    max-width: 100%;
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
    color: var(--foreground) !important;
    padding: .8rem 0;
    border-radius: .25rem;
    background: var(--primary);
    cursor: pointer;
    display: flex;
    width: 10rem;
    justify-content: center;
    position: relative;
    outline: none;
    border: none;
    font-size: 1rem;
  }

  .dropdown-open {
    /* border-bottom-left-radius: 0; */
    /* border-bottom-right-radius: 0; */
  }

  .dropdown {
    position: absolute;
    background: var(--foreground);
    top: calc(100% + .6rem);
    left: 0;
    right: 0;
    border-radius: .25rem;
    /* border-top-left-radius: 0; */
    /* border-top-right-radius: 0; */
  }

  .dropdown:before {
    content: '';
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
    padding: .75rem 1rem;
    text-decoration: none;
  }

  .dropdown-item:first-child {
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
  }

  .dropdown-item:last-child {
    border-bottom-left-radius: .25rem;
    border-bottom-right-radius: .25rem;
  }

  .dropdown-item:not(:last-child) {
    border-bottom: 1px #ddd solid;
  }

  .dropdown-item:hover {
    background: #eee;
  }

  .download-logo {
    height: 1rem;
    margin-right: .5rem;
  }

  .chevron {
    margin-right: .5rem;
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
    .img-wrapper, svg {
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

    p, h1, h2 {
      text-align: center;
    }

    .screenshot-mobile {
      max-width: 500px;
      margin-top: 1rem;
      width: 80%;
      display: block;
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
