import { onMounted, onUnmounted, ref, type Ref } from 'vue';

export interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  once?: boolean;
}

export function useReveal(options: RevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px 100px 0px',
    once = true
  } = options;

  const elements = ref<HTMLElement[]>([]);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        const delay = target.dataset.revealDelay || '0';
        
        setTimeout(() => {
          target.classList.add('revealed');
          if (once) {
            observer.unobserve(target);
          }
        }, parseInt(delay));
      } else if (!once) {
        entry.target.classList.remove('revealed');
      }
    });
  }, { threshold, rootMargin });

  const revealRef = (el: any) => {
    if (el && !elements.value.includes(el)) {
      elements.value.push(el);
      observer.observe(el);
    }
  };

  onUnmounted(() => {
    observer.disconnect();
    elements.value = [];
  });

  return {
    revealRef
  };
}
