/* =============================================
   SILENT HILL — FAN WIKI  v2
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
      closeMenu();
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

function closeMenu() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', e => {
  if (!mainNav.contains(e.target)) closeMenu();
});

/* ─── STAT COUNTER ANIMATION ─────────────────── */
function animateCounter(el) {
  const text = el.textContent.trim();
  if (text === '∞' || isNaN(parseInt(text))) return;

  const target = parseInt(text);
  const duration = 1400;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  el.textContent = '0';
  requestAnimationFrame(step);
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

/* ─── HERO TITLE GLITCH TRIGGER ──────────────── */
// Extra: trigger glitch randomly every ~30s
const heroTitle = document.getElementById('hero-title');
if (heroTitle) {
  setInterval(() => {
    heroTitle.style.animation = 'none';
    heroTitle.offsetHeight; // reflow
    heroTitle.style.animation = 'glitch 0.45s ease';
    setTimeout(() => { heroTitle.style.animation = ''; }, 500);
  }, 28000 + Math.random() * 8000);
}

/* ─── SUBTLE CURSOR MIST ─────────────────────── */
let lastTrailX = 0, lastTrailY = 0;
const trailStyle = document.createElement('style');
trailStyle.textContent = `
  @keyframes mistDot {
    0%   { opacity: 0.45; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -90%) scale(3); }
  }
`;
document.head.appendChild(trailStyle);

document.addEventListener('mousemove', e => {
  if (Math.hypot(e.clientX - lastTrailX, e.clientY - lastTrailY) < 24) return;
  lastTrailX = e.clientX;
  lastTrailY = e.clientY;

  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed;
    left:${e.clientX}px;top:${e.clientY}px;
    width:5px;height:5px;
    background:rgba(139,58,42,0.35);
    border-radius:50%;
    pointer-events:none;
    z-index:9997;
    animation:mistDot 1.4s ease forwards;
  `;
  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 1400);
}, { passive: true });

/* ─── GALLERY LIGHTBOX (simple) ──────────────── */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.style.cssText = `
  display:none;position:fixed;inset:0;
  background:rgba(4,3,2,0.96);
  z-index:8000;cursor:pointer;
  align-items:center;justify-content:center;
  flex-direction:column;gap:1rem;
`;
lightbox.innerHTML = `
  <img id="lb-img" style="max-width:90vw;max-height:80vh;object-fit:contain;filter:grayscale(40%) brightness(0.85);" alt="">
  <div id="lb-cap" style="font-family:'Special Elite',monospace;font-size:0.7rem;letter-spacing:0.2em;color:rgba(138,125,104,0.7);text-transform:uppercase;"></div>
`;
document.body.appendChild(lightbox);

galleryItems.forEach(item => {
  const img = item.querySelector('img');
  const capEl = item.querySelector('.gallery-caption');
  if (!img) return;

  item.addEventListener('click', () => {
    document.getElementById('lb-img').src = img.src;
    document.getElementById('lb-img').alt = img.alt;
    document.getElementById('lb-cap').textContent = img.alt;
    lightbox.style.display = 'flex';
    setTimeout(() => lightbox.style.opacity = '1', 10);
  });
});

lightbox.style.transition = 'opacity 0.4s ease';
lightbox.style.opacity = '0';

lightbox.addEventListener('click', () => {
  lightbox.style.opacity = '0';
  setTimeout(() => { lightbox.style.display = 'none'; }, 400);
});

/* ─── EASTER EGG ─────────────────────────────── */
/*
  The easter egg is triggered by clicking the tiny
  pyramid icon in the parallax-break section 7 times.
  It's nearly invisible (opacity: 0.08) — only curious
  visitors hovering the bottom-right corner will find it.
  Signed: someteaze
*/

const pyramidTrigger = document.getElementById('pyramid-trigger');
const easterOverlay  = document.getElementById('easter-overlay');
const easterClose    = document.getElementById('easter-close');

let pyramidClickCount = 0;
const EASTER_THRESHOLD = 7;

if (pyramidTrigger && easterOverlay) {
  pyramidTrigger.addEventListener('click', () => {
    pyramidClickCount++;

    // Subtle feedback: slight glow increase on each click
    const progress = pyramidClickCount / EASTER_THRESHOLD;
    pyramidTrigger.style.opacity = String(0.08 + progress * 0.25);

    if (pyramidClickCount >= EASTER_THRESHOLD) {
      pyramidClickCount = 0;
      pyramidTrigger.style.opacity = '0.08';
      showEasterEgg();
    }
  });
}

function showEasterEgg() {
  easterOverlay.classList.add('active');
  // Brief screen flicker
  document.body.style.filter = 'brightness(1.3)';
  setTimeout(() => { document.body.style.filter = ''; }, 80);
  setTimeout(() => {
    document.body.style.filter = 'brightness(0.7)';
    setTimeout(() => { document.body.style.filter = ''; }, 80);
  }, 160);
}

if (easterClose) {
  easterClose.addEventListener('click', () => {
    easterOverlay.classList.remove('active');
  });
}

easterOverlay && easterOverlay.addEventListener('click', e => {
  if (e.target === easterOverlay) {
    easterOverlay.classList.remove('active');
  }
});

// Keyboard: ESC closes overlay
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    easterOverlay && easterOverlay.classList.remove('active');
    lightbox.style.opacity = '0';
    setTimeout(() => { lightbox.style.display = 'none'; }, 400);
  }
});

/* ─── CONSOLE EASTER EGG ─────────────────────── */
/*
  For the truly curious who open DevTools.
  someteaze leaves a mark.
*/
const consoleStyle = [
  'color: #c4553d',
  'font-family: monospace',
  'font-size: 13px',
  'line-height: 1.8',
].join(';');

console.log(
  '%c' +
  '\n▲ S I L E N T   H I L L   F A N   W I K I ▲\n' +
  '  built by someteaze\n' +
  '  you opened devtools. the fog watches you.\n',
  consoleStyle
);/* =============================================
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
