// Animation utilities for intersection observer and scroll effects
export function observeElements(
  selector: string,
  callback: (element: Element, isVisible: boolean) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return;

  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      callback(entry.target, entry.isIntersecting);
    });
  }, defaultOptions);

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => observer.observe(el));

  return observer;
}

// Stagger animation for elements
export function setupStaggerAnimation(containerSelector: string, childSelector: string) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const children = container.querySelectorAll(childSelector);
  children.forEach((child, index) => {
    const element = child as HTMLElement;
    element.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
  });
}

// Add fade-in animation on scroll
export function setupFadeInOnScroll(selector: string) {
  if (typeof window === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.1 });

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => observer.observe(el));
}

// Count up animation for stats
export function animateCountUp(
  element: HTMLElement,
  target: number,
  duration: number = 2000,
  format?: (n: number) => string
) {
  let current = 0;
  const increment = target / (duration / 16);
  const startTime = Date.now();

  const update = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    current = Math.floor(target * progress);

    if (format) {
      element.textContent = format(current);
    } else {
      element.textContent = current.toString();
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  update();
}
