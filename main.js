// Custom cursor — desktop mouse only; expand on clickable elements
const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (canUseCustomCursor) {
  const cursor = document.getElementById('cursor');
  if (cursor) {
    function isLimeSurface(el) {
      while (el && el !== document.documentElement) {
        if (el.classList?.contains('lime-surface')) return true;
        el = el.parentElement;
      }
      return false;
    }

    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      const target = document.elementFromPoint(e.clientX, e.clientY);
      cursor.classList.toggle('on-lime', isLimeSurface(target));
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
  }
}

// Nav scroll — transparent at top → black in hero → white after hero
const nav = document.getElementById('nav');
const scrollTrigger = document.querySelector('.hero') || document.querySelector('.page-hero');
function updateNav() {
  if (!nav || !scrollTrigger) return;
  const heroBottom = scrollTrigger.offsetHeight - 80;
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > heroBottom);
  nav.classList.toggle('solid', y > 0 && y <= heroBottom);
  nav.classList.toggle('lime-surface', !!document.querySelector('.page-hero--lime') && y <= heroBottom);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Scroll reveals
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => observer.observe(el));

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    nav.classList.toggle('menu-open', isOpen);
    mobileMenu.classList.toggle('white', nav.classList.contains('scrolled'));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}
