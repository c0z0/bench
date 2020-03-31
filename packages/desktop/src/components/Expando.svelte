<script>
  import { onMount } from 'svelte'

  export let title;  
</script>
h
<div class="wrapper">
  <h4>{title}</h4>
  <div class="content">
    <slot></slot>
  </div>
</div>

<style>

</style>
