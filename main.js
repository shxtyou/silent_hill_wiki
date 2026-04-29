/* =============================================
   SILENT HILL — FAN WIKI (UPGRADED)
   main.js
   ============================================= */

'use strict';

/* ─── LOADER ─────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2000);
});

/* ─── SCROLL REVEAL ──────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── SMOOTH SCROLL ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ─── STICKY NAV ─────────────────────────────── */
const mainNav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── MOBILE HAMBURGER ───────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', e => {
  if (!mainNav.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ─── HERO TITLE GLITCH on hover ─────────────── */
// handled by CSS

/* ─── STAT COUNTER ANIMATION ─────────────────── */
function animateCounter(el) {
  const text = el.textContent.trim();
  if (text === '∞' || isNaN(parseInt(text))) return;
  const target = parseInt(text);
  const duration = 1400;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;
  el.textContent = '0';
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

/* ─── CURSOR TRAIL (fog particles) ───────────── */
let lastX = 0, lastY = 0;

document.addEventListener('mousemove', e => {
  if (Math.abs(e.clientX - lastX) < 18 && Math.abs(e.clientY - lastY) < 18) return;
  lastX = e.clientX;
  lastY = e.clientY;

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    width: 4px; height: 4px;
    background: rgba(139,58,42,0.35);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    animation: fogDot 1.4s ease forwards;
  `;
  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 1400);
});

// Inject fog dot keyframe
const trailStyle = document.createElement('style');
trailStyle.textContent = `
  @keyframes fogDot {
    0%   { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -90%) scale(3); }
  }
`;
document.head.appendChild(trailStyle);

/* ─── KONAMI CODE → EASTER EGG ───────────────── */
// ↑ ↑ ↓ ↓ ← → ← → B A — then enter
const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];
let konamiPos = 0;

document.addEventListener('keydown', e => {
  if (e.key === KONAMI[konamiPos]) {
    konamiPos++;
    if (konamiPos === KONAMI.length) {
      showEasterEgg();
      konamiPos = 0;
    }
  } else {
    konamiPos = 0;
  }
});

// Also: click footer logo 5 times fast
let footerClicks = 0;
let footerTimer;
const footerLogo = document.querySelector('.footer-logo');
if (footerLogo) {
  footerLogo.style.cursor = 'pointer';
  footerLogo.addEventListener('click', () => {
    footerClicks++;
    clearTimeout(footerTimer);
    footerTimer = setTimeout(() => { footerClicks = 0; }, 1200);
    if (footerClicks >= 5) {
      showEasterEgg();
      footerClicks = 0;
    }
  });
}

function showEasterEgg() {
  const egg = document.getElementById('easter-egg');
  if (egg) {
    egg.classList.add('egg-visible');
    // siren sound simulation via short title flash
    const orig = document.title;
    let flashes = 0;
    const flash = setInterval(() => {
      document.title = flashes % 2 === 0 ? '⚠ someteaze ⚠' : orig;
      flashes++;
      if (flashes > 8) { clearInterval(flash); document.title = orig; }
    }, 300);
  }
}

/* ─── ACTIVE NAV LINK HIGHLIGHT ──────────────── */
const sections = document.querySelectorAll('[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--rust-light)'
          : '';
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ─── PARALLAX HERO FOG ──────────────────────── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const fogLayers = document.querySelectorAll('.fog-layer');
  fogLayers.forEach((el, i) => {
    el.style.transform = `translateY(${scrollY * (0.15 + i * 0.08)}px)`;
  });
}, { passive: true });

/* ─── GAME CARD FLICKER on hover ─────────────── */
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
    requestAnimationFrame(() => { card.style.transition = ''; });
  });
});

/* ─── KEYBOARD NAVIGATION for gallery ────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const egg = document.getElementById('easter-egg');
    if (egg && egg.classList.contains('egg-visible')) {
      egg.classList.remove('egg-visible');
    }
  }
});
