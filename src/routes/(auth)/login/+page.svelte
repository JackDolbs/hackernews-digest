<script>
  import AuthForm from '$lib/components/AuthForm.svelte';
  import { onMount } from 'svelte';

  let redirectTo = '/';

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    redirectTo = params.get('redirectTo') || '/';
  });

  async function handleAuthenticated() {
    window.location.href = redirectTo;
  }
</script>

<main class="min-h-screen px-4 grid place-items-center">
  <div class="w-full max-w-sm">
    <AuthForm on:authenticated={handleAuthenticated} />
    <p class="mt-4 text-center text-xs text-slate-500">You'll be redirected after login.</p>

  </div>
</main>

