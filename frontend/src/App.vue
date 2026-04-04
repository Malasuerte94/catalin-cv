<template>
  <div class="min-h-screen text-on-surface">
    <AppLoader />
    <CustomScrollbar />
    <ThreeBackground />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import AppLoader from './components/AppLoader.vue';
import ThreeBackground from './components/ThreeBackground.vue';
import CustomScrollbar from './components/CustomScrollbar.vue';
import { useLenis } from './composables/useLenis';

useLenis();
</script>
