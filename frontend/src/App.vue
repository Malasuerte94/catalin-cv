<template>
  <div class="min-h-screen text-on-surface">
    <ThreeBackground />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import ThreeBackground from './components/ThreeBackground.vue';
</script>
