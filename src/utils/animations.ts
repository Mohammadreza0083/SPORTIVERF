import { animate, inView, stagger } from 'motion';

/**
 * Utility functions for Motion One kinetic animations
 */

export function setupScrollReveals(): void {
  if (typeof window === 'undefined') return;

  inView('.reveal-on-scroll', (element) => {
    animate(
      element,
      { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] },
      { duration: 0.6 }
    );
  });

  inView('.stagger-grid', (element) => {
    const children = element.querySelectorAll('.stagger-item');
    if (children.length > 0) {
      animate(
        children,
        { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
        { delay: stagger(0.1), duration: 0.5 }
      );
    }
  });
}

export function setupStickyHeaderAnimation(headerElement: HTMLElement | null): void {
  if (!headerElement || typeof window === 'undefined') return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 60 && currentScrollY > lastScrollY) {
      // Scrolling down - hide header
      animate(headerElement, { transform: 'translateY(-100%)' }, { duration: 0.3 });
    } else {
      // Scrolling up - reveal header
      animate(headerElement, { transform: 'translateY(0%)' }, { duration: 0.3 });
    }

    lastScrollY = currentScrollY;
  });
}

export function animatePulse(target: string | HTMLElement): ReturnType<typeof animate> {
  return animate(
    target,
    { opacity: [0.3, 1, 0.3] },
    { duration: 1.5, repeat: Infinity }
  );
}
