<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="glass-panel p-8 md:p-12 rounded-[2rem] w-full max-w-md shadow-[0_0_60px_rgba(0,232,255,0.1)]">
      <div class="flex flex-col items-center mb-8">
        <span class="material-symbols-outlined text-primary text-5xl mb-4 drop-shadow-[0_0_10px_rgba(0,232,255,0.4)]">shield_lock</span>
        <h2 class="font-headline text-2xl font-black uppercase tracking-widest text-on-background">Admin Access</h2>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label class="font-label text-xs uppercase tracking-widest text-on-surface-variant px-1">Identity_Key</label>
          <input
            v-model="email"
            class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            placeholder="admin@nebula.sys" type="email" required />
        </div>
        <div class="space-y-2">
          <label class="font-label text-xs uppercase tracking-widest text-on-surface-variant px-1">Access_Protocol</label>
          <input
            v-model="password"
            class="w-full bg-[#1A1A23] border border-primary/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            placeholder="••••••••" type="password" required />
        </div>

        <div v-if="error" class="text-error text-xs font-label uppercase tracking-wider text-center bg-error/10 py-2 rounded-lg border border-error/20">
          {{ error }}
        </div>

        <button
          :disabled="loading"
          class="w-full bg-primary py-4 rounded-xl text-on-primary font-headline font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,232,255,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit">
          {{ loading ? 'AUTHENTICATING...' : 'ESTABLISH_SESSION' }}
        </button>
      </form>
      
      <div class="mt-8 text-center">
        <router-link to="/" class="text-on-surface-variant hover:text-white transition-colors font-label text-[10px] uppercase tracking-widest">
          Return to Terminal
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await response.json();
    if (response.ok) {
      authStore.setToken(data.token);
      router.push({ name: 'admin-dashboard' });
    } else {
      error.value = data.error || 'Authentication failed';
    }
  } catch (err) {
    error.value = 'Network protocol failure';
  } finally {
    loading.value = false;
  }
};
</script>
