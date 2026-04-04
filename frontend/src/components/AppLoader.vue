<template>
  <Transition name="loader">
    <div v-if="loading" class="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center p-6 text-primary">
      <!-- Animated Logo / Icon -->
      <div class="relative w-24 h-24 mb-12">
        <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        <div class="absolute inset-4 border-2 border-secondary/40 rounded-full animate-pulse"></div>
        <span class="absolute inset-0 flex items-center justify-center material-symbols-outlined text-4xl">
          terminal
        </span>
      </div>

      <!-- Loading Text -->
      <div class="flex flex-col items-center gap-4 max-w-sm w-full">
        <div class="font-headline text-xs uppercase tracking-[0.3em] font-bold opacity-80">
          Initializing System_{{ progress }}%
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
            :style="{ width: progress + '%' }"
          ></div>
        </div>

        <!-- System Messages -->
        <div class="h-6 overflow-hidden mt-2">
          <Transition name="message" mode="out-in">
            <p :key="currentMessage" class="text-[10px] font-label uppercase tracking-widest text-on-surface-variant text-center">
              {{ currentMessage }}
            </p>
          </Transition>
        </div>
      </div>

      <!-- Glitchy Background Elements -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-nebula opacity-50 pointer-events-none"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useLenis } from '../composables/useLenis';

const { lenis } = useLenis();
const loading = ref(true);
const progress = ref(0);

watch(loading, (val) => {
  if (val) {
    lenis.value?.stop();
  } else {
    lenis.value?.start();
  }
}, { immediate: true });
const currentMessage = ref('Booting core modules...');

const messages = [
  'Allocating memory...',
  'Syncing neural networks...',
  'Compiling visual interfaces...',
  'Connecting to data nodes...',
  'Optimizing 3D engine...',
  'Finalizing system handshake...',
  'Welcome to the future.'
];

onMounted(() => {
  let messageIndex = 0;
  
  const interval = setInterval(() => {
    progress.value += Math.floor(Math.random() * 5) + 1;
    
    if (progress.value % 15 === 0 && messageIndex < messages.length - 1) {
      messageIndex++;
      currentMessage.value = messages[messageIndex];
    }

    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(interval);
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }, 50);
});
</script>

<style scoped>
.loader-leave-active {
  transition: opacity 0.8s ease-in-out, transform 0.8s cubic-bezier(0.7, 0, 0.3, 1);
}

.loader-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.message-enter-active, .message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1.5s linear infinite;
}
</style>
