import { type Directive } from 'vue';

export const vRevealText: Directive = {
  mounted(el: HTMLElement, binding) {
    const originalText = el.innerText.trim();
    if (!originalText) return;

    // Accessibility
    el.setAttribute('aria-label', originalText);
    el.innerHTML = '';

    const chars = originalText.split('').map(char => {
      const span = document.createElement('span');
      span.innerText = char;
      span.style.opacity = '0.05';
      span.style.filter = 'blur(4px)';
      span.style.transition = 'opacity 0.3s ease, filter 0.3s ease';
      span.style.display = 'inline';
      span.style.whiteSpace = 'pre-wrap';
      el.appendChild(span);
      return span;
    });

    const cursor = document.createElement('span');
    cursor.className = 'reveal-cursor';
    cursor.style.display = 'inline-block';
    cursor.style.width = '2px';
    cursor.style.height = '1.2em';
    cursor.style.backgroundColor = 'var(--color-primary)';
    cursor.style.verticalAlign = 'middle';
    cursor.style.opacity = '0';
    cursor.style.marginLeft = '2px';
    cursor.style.boxShadow = '0 0 10px var(--color-primary)';
    cursor.style.transition = 'opacity 0.2s ease';
    el.appendChild(cursor);

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      
      // Start typing when element is at 95% of viewport height (just entered)
      // Finish typing when element reaches 75% of viewport height (25% up from bottom)
      const start = vh * 0.95;
      const end = vh * 0.75;
      
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const activeCount = Math.floor(progress * chars.length);
      
      chars.forEach((span, i) => {
        if (i < activeCount) {
          span.style.opacity = '1';
          span.style.filter = 'blur(0px)';
        } else {
          span.style.opacity = '0.05';
          span.style.filter = 'blur(4px)';
        }
      });

      if (activeCount > 0 && activeCount < chars.length) {
        cursor.style.opacity = '1';
        chars[activeCount - 1].after(cursor);
      } else {
        cursor.style.opacity = '0';
      }
    };

    // Store for cleanup
    (el as any)._revealUpdate = update;
    window.addEventListener('scroll', update, { passive: true });
    // Initial call
    setTimeout(update, 100);
  },
  unmounted(el: HTMLElement) {
    if ((el as any)._revealUpdate) {
      window.removeEventListener('scroll', (el as any)._revealUpdate);
    }
  }
};
