/* =============================================
   SILENT HILL — FAN WIKI
   main.js
   ============================================= */

'use strict';

/* ─── SCROLL REVEAL ──────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── SMOOTH SCROLL ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu if open
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ─── STICKY NAV ─────────────────────────────── */
const mainNav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── MOBILE HAMBURGER ───────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close on outside click
document.addEventListener('click', e => {
  if (!mainNav.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ─── HERO TITLE GLITCH on hover ─────────────── */
// handled by CSS keyframe animation

/* ─── RADIO STATIC on game card hover ────────── */
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    // Brief flicker effect via class toggle
    card.style.transition = 'none';
    requestAnimationFrame(() => {
      card.style.transition = '';
    });
  });
});

/* ─── STAT COUNTER ANIMATION ─────────────────── */
function animateCounter(el) {
  const text = el.textContent.trim();
  if (text === '∞' || isNaN(parseInt(text))) return;

  const target = parseInt(text);
  const duration = 1200;
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

/* ─── CURSOR TRAIL (subtle fog particles) ────── */
let lastX = 0, lastY = 0;
let trailTimeout;

document.addEventListener('mousemove', e => {
  if (Math.abs(e.clientX - lastX) < 20 && Math.abs(e.clientY - lastY) < 20) return;
  lastX = e.clientX;
  lastY = e.clientY;

  clearTimeout(trailTimeout);
  trailTimeout = setTimeout(() => {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 4px;
      height: 4px;
      background: rgba(139,58,42,0.4);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      animation: fogDot 1.2s ease forwards;
    `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 1200);
  }, 30);
});

// Inject keyframe for fog dots
const style = document.createElement('style');
style.textContent = `
  @keyframes fogDot {
    0%   { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -80%) scale(2.5); }
  }
`;
document.head.appendChild(style);
