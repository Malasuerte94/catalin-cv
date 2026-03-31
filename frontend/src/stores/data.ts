import { defineStore } from 'pinia';
import type { Project, Experience, ContactUrl, BackgroundKeyframe } from '../types';

const API_BASE_URL = '/api';

export const useDataStore = defineStore('data', {
  state: () => ({
    projects: [] as Project[],
    experience: [] as Experience[],
    contactUrls: [] as ContactUrl[],
    backgroundKeyframes: [] as BackgroundKeyframe[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const [projectsRes, expRes, contactRes, keyframesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/projects`),
          fetch(`${API_BASE_URL}/experience`),
          fetch(`${API_BASE_URL}/contact-urls`),
          fetch(`${API_BASE_URL}/background-keyframes`),
        ]);

        if (!projectsRes.ok || !expRes.ok || !contactRes.ok || !keyframesRes.ok) {
           throw new Error('Failed to fetch some data');
        }

        this.projects = await projectsRes.json();
        this.experience = await expRes.json();
        this.contactUrls = await contactRes.json();
        this.backgroundKeyframes = await keyframesRes.json();
      } catch (err) {
        console.error(err);
        this.error = 'Failed to fetch data';
      } finally {
        this.loading = false;
      }
    },
    async sendContactMessage(name: string, email: string, message: string) {
      try {
        const res = await fetch(`${API_BASE_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send message');
        return { success: true };
      } catch (err: any) {
        console.error(err);
        return { success: false, error: err.message };
      }
    },
  },
});
