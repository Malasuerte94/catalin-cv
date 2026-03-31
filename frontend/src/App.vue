<template>
  <div class="min-h-screen text-on-surface">
    <CustomScrollbar />
    <ThreeBackground />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import ThreeBackground from './components/ThreeBackground.vue';
import CustomScrollbar from './components/CustomScrollbar.vue';
</script>
