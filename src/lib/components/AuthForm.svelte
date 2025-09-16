<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let mode: 'login' | 'register' = 'login';
  let email = '';
  let password = '';
  let loading = false;
  let error: string | null = null;

  async function submit() {
    loading = true;
    error = null;
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      dispatch('authenticated', data.user);
    } catch (e: any) {
      error = e?.message || 'Authentication failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="text-center mb-6">
  <img src="/causaLens.svg" alt="CausaLens Logo" class="h-10 w-auto mx-auto" />
</div>

<div class="max-w-sm mx-auto bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
  <div class="mb-4">
    <h2 class="text-lg font-semibold text-slate-900">Sign in to continue</h2>
    <p class="text-sm text-slate-600 mt-1">Create an account or log in to generate digests.</p>
  </div>

  {#if error}
    <div class="text-red-600 text-sm mb-3">{error}</div>
  {/if}

  <form on:submit|preventDefault={submit} class="space-y-3">
    <div>
      <label class="block text-sm text-slate-700 mb-1" for="auth-email">Email</label>
      <input id="auth-email" class="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" bind:value={email} required />
    </div>
    <div>
      <label class="block text-sm text-slate-700 mb-1" for="auth-password">Password</label>
      <input id="auth-password" class="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" bind:value={password} required />
    </div>
    <button class="w-full bg-blue-600 text-white rounded-md px-3 py-2 disabled:opacity-50" type="submit" disabled={loading}>
      {loading ? 'Please wait…' : (mode === 'login' ? 'Log in' : 'Create account')}
    </button>
  </form>

  <div class="mt-3 text-sm text-center">
    <button class="text-blue-600 hover:underline" on:click={() => (mode = mode === 'login' ? 'register' : 'login')}>
      {mode === 'login' ? "Don't have an account? Register" : 'Have an account? Log in'}
    </button>
  </div>
</div>

