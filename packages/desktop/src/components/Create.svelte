<script>
  import CreateItem from "./CreateItem.svelte";

  export let onCreate;
  export let predefinedApps;

  let url = "";

  const onSubmit = e => {
    e.preventDefault();
    onCreate({ url });
  };
</script>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    background: var(--content-background);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .predefined {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    max-width: 35rem;
    border-bottom: 1px solid var(--border-color);

    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }

  h4 {
    width: 100%;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    max-width: 35rem;
  }

  input {
    padding: 1rem 2rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    background: var(--background);
    border: none;
    outline: none;
    color: var(--foreground);
    border-radius: 0.5rem;
  }

  input#url {
    width: calc(100% - 4rem);
  }

  input#submit {
    background: var(--primary);
    cursor: pointer;
    color: white;
  }
</style>

<div class="wrapper">
  <h2>Add an app</h2>
  <div class="predefined">
    {#each predefinedApps as p}
      <CreateItem favicon={p.favicon} onClick={() => onCreate(p)} />
    {/each}
  </div>
  <form on:submit={onSubmit}>
    <h4>Or bring your own:</h4>
    <input
      type="url"
      id="url"
      placeholder="Enter a URL..."
      autofocus
      bind:value={url}
      required />
    <input type="submit" id="submit" />
  </form>
</div>
