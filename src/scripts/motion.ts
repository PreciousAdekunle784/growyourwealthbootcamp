/**
 * Motion language: "ink settling on a ledger".
 * Lines rise out of their own baseline, folio rules draw left to right, images unmask
 * from the bottom like a page being turned up. Everything is CSS-driven; this
 * file only flips `.is-in` when an element enters the viewport.
 */

const root = document.documentElement;
const motionOn = root.classList.contains('motion');

const SELECTOR = '[data-reveal], [data-lines], [data-mask]';

function revealAll() {
  document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add('is-in'));
}

if (!motionOn) {
  revealAll();
} else {
  // A clip-path mask hides the element from IntersectionObserver too, so masked
  // elements are watched through their (unclipped) parent.
  const owners = new Map<Element, Element[]>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (owners.get(entry.target) ?? []).forEach((el) => el.classList.add('is-in'));
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  document.querySelectorAll(SELECTOR).forEach((el) => {
    const target = el.hasAttribute('data-mask') && el.parentElement ? el.parentElement : el;
    const list = owners.get(target) ?? [];
    list.push(el);
    owners.set(target, list);
    io.observe(target);
  });

  // Safety net: never leave content hidden if something goes wrong.
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 1200);
  });

  // Gentle scroll-linked drift for elements marked [data-drift="0.06"].
  const drifters = Array.from(document.querySelectorAll<HTMLElement>('[data-drift]'));
  if (drifters.length && window.matchMedia('(min-width: 900px)').matches) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      for (const el of drifters) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        const speed = Number(el.dataset.drift) || 0.05;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }
}
