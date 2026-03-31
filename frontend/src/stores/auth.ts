import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token');
    },
  },
});
