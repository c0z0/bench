<script>
  const { ipcRenderer: ipc } = require('electron')

  import Main from './screens/Main.svelte'
  import About from './screens/About.svelte'

  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('p');
  const colors = ['#fe51bb', '#8d398f', '#0072c6', '#555', '#007239', '#911743']

  let activeColor = localStorage.getItem('THEME') || colors[0]

  const onColorClick = (c) => {
    localStorage.setItem('THEME', c)
    ipc.send('update-theme', c)
    activeColor = c;
  }

  ipc.on('update-theme', (e, t) => {
    activeColor = localStorage.getItem('THEME');
  })
</script>

<div style="--primary: {activeColor}">
{#if page === 'about'}
  <About colors={colors} activeColor={activeColor} onColorClick={onColorClick}/>
{:else}
  <Main />
{/if}
</div>
