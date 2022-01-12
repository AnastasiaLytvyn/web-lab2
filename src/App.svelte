<script>
  let isLoading = false;
  let result = "";
  const formData = {};
  const API_URL = "/api/sendMail";
  const submit = async () => {
    isLoading = true;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formData),
      });
      const responseJSON = await response.json();
      if (!responseJSON.result.success) {
        result = responseJSON.errors.join(";");
      } else {
        result = "Email was sent";
      }
    } catch (e) {
      result = "error occured";
    } finally {
      isLoading = false;
    }
  };
</script>

<main>
  {#if isLoading}
    <div class="loader">
      <img src="../loader.gif" alt="loader" />
    </div>
  {:else}
    <form on:submit|preventDefault={submit}>
      <input
        name="email"
        type="email"
        placeholder="Enter your email"
        bind:value={formData.email}
      />
      <input
        name="name"
        type="text"
        placeholder="Enter your name"
        bind:value={formData.name}
      />
      <input
        name="password"
        type="password"
        placeholder="Enter your password"
        bind:value={formData.password}
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
        bind:value={formData.confirmPassword}
      />
      <input type="submit" disabled={isLoading} value="Send" />
    </form>
    <div>
      <p>{result}</p>
    </div>
  {/if}
</main>

<style>
  :root {
    --dark: #333;
    --lighter: #838383;
    --light: #666;
  }

  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  form {
    border: 1px solid var(--dark);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 10px 5px 5px var(--lighter);
  }

  input {
    border: 1px solid var(--light);
  }
</style>
