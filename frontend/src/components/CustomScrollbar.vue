<template>
  <div class="fixed right-1 top-0 bottom-0 w-1.5 z-[9999] pointer-events-none group">
    <!-- Track -->
    <div class="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
    
    <!-- Thumb -->
    <div 
      ref="thumb"
      class="absolute right-0 w-full bg-primary/20 rounded-full transition-[background,box-shadow] duration-300 pointer-events-auto cursor-pointer hover:bg-primary/40 hover:shadow-[0_0_15px_rgba(135,239,255,0.4)]"
      :style="{ height: thumbHeight + 'px', top: thumbTop + 'px' }"
      @mousedown="startDrag"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useLenis } from '../composables/useLenis';

const { lenis } = useLenis();
const thumbHeight = ref(0);
const thumbTop = ref(0);
const isDragging = ref(false);
const startY = ref(0);
const startScrollTop = ref(0);

const updateThumb = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const ratio = clientHeight / scrollHeight;
  thumbHeight.value = Math.max(ratio * clientHeight, 40); // Minimum height of 40px
  
  const availableSpace = clientHeight - thumbHeight.value;
  const maxScroll = scrollHeight - clientHeight;
  
  if (maxScroll <= 0) {
    thumbHeight.value = 0;
  } else {
    thumbTop.value = (scrollTop / maxScroll) * availableSpace;
  }
};

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  startY.value = e.clientY;
  startScrollTop.value = window.pageYOffset || document.documentElement.scrollTop;
  
  document.body.classList.add('select-none');
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const deltaY = e.clientY - startY.value;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const maxScroll = scrollHeight - clientHeight;
  
  const ratio = maxScroll / (clientHeight - thumbHeight.value);
  const targetScroll = startScrollTop.value + deltaY * ratio;

  if (lenis.value) {
    lenis.value.scrollTo(targetScroll, { immediate: true });
  } else {
    window.scrollTo(0, targetScroll);
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.body.classList.remove('select-none');
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

onMounted(() => {
  window.addEventListener('scroll', updateThumb);
  window.addEventListener('resize', updateThumb);
  
  // Use a ResizeObserver to catch content changes that don't trigger resize event
  const observer = new ResizeObserver(updateThumb);
  observer.observe(document.body);
  
  updateThumb();
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateThumb);
  window.removeEventListener('resize', updateThumb);
});
</script>

<style scoped>
.select-none {
  user-select: none;
}
</style>
