import { defineStore } from 'pinia';
import type { Project, Experience, ContactUrl } from '../types';

const API_BASE_URL = '/api';

export const useDataStore = defineStore('data', {
  state: () => ({
    projects: [] as Project[],
    experience: [] as Experience[],
    contactUrls: [] as ContactUrl[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const [projectsRes, expRes, contactRes] = await Promise.all([
          fetch(`${API_BASE_URL}/projects`),
          fetch(`${API_BASE_URL}/experience`),
          fetch(`${API_BASE_URL}/contact-urls`),
        ]);

        if (!projectsRes.ok || !expRes.ok || !contactRes.ok) {
           throw new Error('Failed to fetch some data');
        }

        this.projects = await projectsRes.json();
        this.experience = await expRes.json();
        this.contactUrls = await contactRes.json();
      } catch (err) {
        console.error(err);
        this.error = 'Failed to fetch data';
      } finally {
        this.loading = false;
      }
    },
  },
});
