// PC Store — interactions (light theme, lightweight & GPU-friendly)

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Header scroll state (rAF-throttled) ---------- */
const header = document.querySelector('.header');
let scrolled = false;
let ticking = false;
function syncHeader() {
  const next = window.scrollY > 24;
  if (next !== scrolled) {
    scrolled = next;
    header.classList.toggle('scrolled', scrolled);
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(syncHeader); }
}, { passive: true });

/* ---------- Live "open now" status (header + per store) ---------- */
function parseHM(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}
function fmt(mins) {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}${m ? ':' + String(m).padStart(2, '0') : ''} ${ampm}`;
}
function computeStatus(openStr, closeStr) {
  const now = new Date();
  const isSunday = now.getDay() === 0; // closed Sundays
  const cur = now.getHours() * 60 + now.getMinutes();
  const open = parseHM(openStr);
  const close = parseHM(closeStr);
  if (!isSunday && cur >= open && cur < close) {
    return { open: true, text: `Open now · closes ${fmt(close)}` };
  }
  if (!isSunday && cur < open) {
    return { open: false, text: `Opens ${fmt(open)}` };
  }
  return { open: false, text: isSunday ? 'Closed Sundays' : `Opens ${fmt(open)} tomorrow` };
}

// Header pill (uses the flagship Blue Area hours)
const statusPill = document.getElementById('statusPill');
const statusText = document.getElementById('statusText');
if (statusPill && statusText) {
  const s = computeStatus('10:30', '20:30');
  statusText.textContent = s.text;
  statusPill.classList.add(s.open ? 'open' : 'closed');
}

// Per-store badges
document.querySelectorAll('.store-card').forEach((card) => {
  const badge = card.querySelector('[data-store-status]');
  if (!badge) return;
  const s = computeStatus(card.dataset.open, card.dataset.close);
  badge.textContent = s.open ? 'Open now' : 'Closed';
  badge.classList.add(s.open ? 'open' : 'closed');
});

/* ---------- Hero figure: soft pointer sheen (premium micro-detail) ---------- */
const heroFigure = document.getElementById('heroFigure');
if (heroFigure && !prefersReduced && matchMedia('(pointer:fine)').matches) {
  let raf;
  heroFigure.addEventListener('pointermove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const r = heroFigure.getBoundingClientRect();
      heroFigure.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      heroFigure.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      raf = null;
    });
  });
}

/* ---------- Category index: hover/focus preview ---------- */
const rows = document.querySelectorAll('.index-row');
const previewImg = document.getElementById('indexPreview');
const previewBadge = document.getElementById('previewBadge');
let previewTimer;
function activateRow(row) {
  if (row.classList.contains('is-active')) return;
  rows.forEach((r) => r.classList.remove('is-active'));
  row.classList.add('is-active');
  const src = row.dataset.img;
  const name = row.querySelector('.row-name')?.textContent ?? '';
  if (!previewImg) return;
  if (prefersReduced) { previewImg.src = src; if (previewBadge) previewBadge.textContent = name; return; }
  clearTimeout(previewTimer);
  previewImg.classList.add('swapping');
  const next = new Image();
  next.decoding = 'async';
  next.src = src;
  const apply = () => {
    previewImg.src = src;
    if (previewBadge) previewBadge.textContent = name;
    requestAnimationFrame(() => previewImg.classList.remove('swapping'));
  };
  next.complete ? (previewTimer = setTimeout(apply, 110)) : (next.onload = () => (previewTimer = setTimeout(apply, 60)));
}
rows.forEach((row) => {
  row.addEventListener('mouseenter', () => activateRow(row));
  row.addEventListener('focusin', () => activateRow(row));
});

/* ---------- PC Configurator (signature interactive element) ---------- */
const BUILDS = {
  starter: {
    price: 95000,
    specs: { gpu: 'RTX 4060 8GB', cpu: 'Ryzen 5 7600', ram: '16GB DDR5', storage: '1TB NVMe' },
    meters: { gaming: 72, creation: 48, multitask: 55 },
    note: 'Smooth 1080p gaming at high refresh rates, with headroom for everyday creative work.',
  },
  performance: {
    price: 185000,
    specs: { gpu: 'RTX 4070 Ti 12GB', cpu: 'Ryzen 7 7800X3D', ram: '32GB DDR5', storage: '2TB NVMe' },
    meters: { gaming: 92, creation: 78, multitask: 80 },
    note: 'Maxed-out 1440p gaming and confident streaming, editing and multitasking.',
  },
  creator: {
    price: 320000,
    specs: { gpu: 'RTX 4080 Super 16GB', cpu: 'Ryzen 9 7950X', ram: '64GB DDR5', storage: '4TB NVMe' },
    meters: { gaming: 99, creation: 97, multitask: 96 },
    note: 'Built for 4K editing, 3D rendering and heavy multitasking without compromise.',
  },
};

const tiers = document.querySelectorAll('.tier');
const priceEl = document.getElementById('configPrice');
const noteEl = document.getElementById('configNote');
const specVals = document.querySelectorAll('.spec-val');
const meterFills = document.querySelectorAll('.meter-fill');

let priceRaf;
let priceFallback;
function animatePrice(to) {
  if (!priceEl) return;
  const from = Number(priceEl.textContent.replace(/[^\d]/g, '')) || 0;
  cancelAnimationFrame(priceRaf);
  clearTimeout(priceFallback);
  if (prefersReduced || from === to) { priceEl.textContent = to.toLocaleString('en-US'); return; }
  const start = performance.now();
  const dur = 500;
  function tick(t) {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    priceEl.textContent = Math.round(from + (to - from) * eased).toLocaleString('en-US');
    if (p < 1) priceRaf = requestAnimationFrame(tick);
  }
  priceRaf = requestAnimationFrame(tick);
  // guarantee the final value even if rAF is throttled (e.g. background tab)
  priceFallback = setTimeout(() => { priceEl.textContent = to.toLocaleString('en-US'); }, dur + 80);
}

function setMeters(meters) {
  meterFills.forEach((fill) => {
    const key = fill.dataset.meter;
    fill.style.width = `${meters[key] ?? 0}%`;
  });
}

function selectTier(name) {
  const build = BUILDS[name];
  if (!build) return;

  tiers.forEach((t) => {
    const active = t.dataset.tier === name;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
  });

  animatePrice(build.price);
  if (noteEl) noteEl.textContent = build.note;

  specVals.forEach((el) => {
    const key = el.dataset.spec;
    const val = build.specs[key];
    if (val == null || el.textContent === val) return;
    if (prefersReduced) { el.textContent = val; return; }
    el.classList.add('flip');
    setTimeout(() => {
      el.textContent = val;
      el.classList.remove('flip');
    }, 160);
  });

  setMeters(build.meters);
}

tiers.forEach((t) => t.addEventListener('click', () => selectTier(t.dataset.tier)));

// initialise meters once the section enters view
const configSection = document.getElementById('configure');
if (configSection) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        setMeters(BUILDS.starter.meters);
        cio.disconnect();
      }
    });
  }, { threshold: 0.3 });
  cio.observe(configSection);
}

/* ---------- Scroll reveal ---------- */
const revealTargets = document.querySelectorAll(
  '.block-head, .index-list, .index-preview, .config, .product-card, .trust-item, .store-card, .cta-inner, .spec-strip'
);
if (prefersReduced) {
  revealTargets.forEach((el) => el.classList.add('visible'));
} else {
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.classList.contains('product-card') || el.classList.contains('trust-item')) {
      el.style.transitionDelay = `${(i % 4) * 0.07}s`;
    }
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach((el) => io.observe(el));
}

/* ---------- Add to cart ---------- */
const cartCount = document.getElementById('cartCount');
let cart = 0;
document.querySelectorAll('.add-cart').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (btn.dataset.busy) return;
    btn.dataset.busy = '1';
    btn.classList.add('added');
    const original = btn.innerHTML;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>';
    cart += 1;
    if (cartCount) { cartCount.textContent = String(cart); cartCount.classList.add('show'); }
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = original;
      delete btn.dataset.busy;
    }, 1300);
  });
});
