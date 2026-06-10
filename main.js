// Custom cursor — desktop mouse only; expand on clickable elements
const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (canUseCustomCursor) {
  const cursor = document.getElementById('cursor');
  if (cursor) {
    const LIME = { r: 188, g: 232, b: 88 };
    const BLACK = { r: 10, g: 10, b: 10 };

    function parseRgb(color) {
      const match = color?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return null;
      return { r: +match[1], g: +match[2], b: +match[3] };
    }

    function isLimeColor(color) {
      const rgb = parseRgb(color);
      if (!rgb) return false;
      return rgb.r === LIME.r && rgb.g === LIME.g && rgb.b === LIME.b;
    }

    function isDarkColor(color) {
      const rgb = parseRgb(color);
      if (!rgb) return false;
      return rgb.r === BLACK.r && rgb.g === BLACK.g && rgb.b === BLACK.b;
    }

    function surfaceType(el) {
      while (el && el !== document.documentElement) {
        if (el.classList?.contains('lime-surface')) return 'lime';
        if (el.classList?.contains('dark-surface')) return 'dark';
        const bg = getComputedStyle(el).backgroundColor;
        if (isLimeColor(bg)) return 'lime';
        if (isDarkColor(bg)) return 'dark';
        el = el.parentElement;
      }
      return 'light';
    }

    const interactiveSelector = 'a, button, input, select, textarea, label[for], [role="button"]';

    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target) return;
      const surface = surfaceType(target);
      cursor.classList.toggle('on-lime', surface === 'lime');
      cursor.classList.toggle('on-dark', surface === 'dark');
      cursor.classList.toggle('expand', !!target.closest(interactiveSelector));
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

// Language toggle + i18n
const LANG_KEY = 'bwa-lang';
const langButtons = document.querySelectorAll('.lang-btn');

function applyTranslations(lang) {
  const dict = window.BWA_I18N?.[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = dict[el.getAttribute('data-i18n')];
    if (val != null) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const val = dict[el.getAttribute('data-i18n-html')];
    if (val != null) el.innerHTML = val;
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const val = dict[el.getAttribute('data-i18n-aria-label')];
    if (val != null) el.setAttribute('aria-label', val);
  });

  const titleKey = document.body.dataset.i18nTitle;
  if (titleKey && dict[titleKey]) document.title = dict[titleKey];
}

function setLanguage(lang) {
  document.documentElement.lang = lang;
  langButtons.forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  localStorage.setItem(LANG_KEY, lang);
  applyTranslations(lang);
}

const savedLang = localStorage.getItem(LANG_KEY) || 'en';
if (['en', 'ro', 'ru'].includes(savedLang)) setLanguage(savedLang);

langButtons.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

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
