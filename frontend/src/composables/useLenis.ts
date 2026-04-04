import Lenis from 'lenis';
import { onMounted, onUnmounted, ref } from 'vue';

const globalLenis = ref<Lenis | null>(null);

export function useLenis() {
  let rafId: number;

  const init = () => {
    if (globalLenis.value) return;

    globalLenis.value = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time: number) {
      globalLenis.value?.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
  };

  const destroy = () => {
    // We might not want to destroy it if it's shared, 
    // but usually useLenis is called in App.vue once.
    globalLenis.value?.destroy();
    globalLenis.value = null;
    cancelAnimationFrame(rafId);
  };

  onMounted(() => {
    init();
  });

  onUnmounted(() => {
    // If we have multiple components using it, we might need a counter.
    // But since it's only in App.vue, it's fine.
  });

  return {
    lenis: globalLenis,
  };
}
