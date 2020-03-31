<script>
  import TitleButton from './TitleButton.svelte'
  const { ipcRenderer: ipc} = require('electron')

  export let activeId;

  const onRefresh = () => ipc.send('refresh', activeId)
  const onForward = () => ipc.send('forward', activeId)
  const onBackward = () => ipc.send('backward', activeId)
  const onAbout = () => ipc.send('about')

  $: disabled = activeId === null;
</script>

<div class="wrapper">
  <TitleButton icon="b-logo" onClick={onAbout}/>
  <TitleButton disabled={disabled} onClick={onBackward} icon="arrow-left"/>
  <TitleButton disabled={disabled} onClick={onForward} icon="arrow-right"/>
  <TitleButton disabled={disabled} onClick={onRefresh} icon="refresh"/>
  <p>bench</p>
</div>

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
    padding-left: 70px;
    /* justify-content: flex-end; */
    -webkit-app-region: drag;
  }

  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    opacity: .5;
    -webkit-app-region: drag;
  }
</style>
