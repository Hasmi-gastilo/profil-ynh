// ============================================================
// app.js — Shared Public Site Logic
// Navbar, Footer injection, Dark Mode, Scroll Animations,
// WhatsApp Float, Toast Notifications, Firestore settings loader
// ============================================================

import { db } from './firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ── DARK MODE ──────────────────────────────────────────────
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
let darkMode = prefersDark.matches;

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const icon = document.querySelector('#darkToggle i');
  if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
}

export function initDarkMode() {
  applyTheme(darkMode);
  const btn = document.getElementById('darkToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      darkMode = !darkMode;
      applyTheme(darkMode);
    });
  }
  prefersDark.addEventListener('change', e => {
    darkMode = e.matches;
    applyTheme(darkMode);
  });
}

// ── NAVBAR ─────────────────────────────────────────────────
export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const isHeroPage = document.querySelector('.hero') !== null;

  function updateNavbar() {
    if (isHeroPage) {
      if (window.scrollY > 60) {
        navbar.classList.remove('navbar-transparent');
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('navbar-scrolled');
      }
    } else {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('navbar-scrolled');
    }
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // Active link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace(/^\//, ''))) {
      link.classList.add('active');
    }
    // Home special case
    if ((href === 'index.html' || href === '/') &&
        (currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('/'))) {
      link.classList.add('active');
    }
  });

  // Mobile toggle
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    // Close on link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
      });
    });
  }
}

// ── SCROLL ANIMATIONS ──────────────────────────────────────
export function initScrollAnimations() {
  const selectors = '.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale';
  const elements = document.querySelectorAll(selectors);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Tambah sedikit delay agar animasi terasa lebih natural
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ── COUNTER ANIMATION ──────────────────────────────────────
export function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const startVal = 0;
  const suffix = el.dataset.suffix || '';

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString('id-ID') + (progress >= 1 ? suffix : '');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ── TOAST NOTIFICATIONS ────────────────────────────────────
let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 3500) {
  const container = getToastContainer();
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-text">${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = '300ms';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── LOAD SITE SETTINGS FROM FIRESTORE ─────────────────────
export async function loadSiteSettings() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (snap.exists()) {
      const data = snap.data();
      // Update page title
      if (data.siteTitle) document.title = data.siteTitle;
      // Update logo
      if (data.logoUrl) {
        document.querySelectorAll('.navbar-logo, .footer-logo').forEach(img => {
          img.src = data.logoUrl;
        });
      }
      // Update footer
      const footerCopy = document.querySelector('.footer-copy');
      if (footerCopy && data.copyright) footerCopy.innerHTML = data.copyright;
      // Theme color meta
      if (data.themeColor) {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', data.themeColor);
      }
      return data;
    }
  } catch (err) {
    console.warn('Could not load site settings:', err.message);
  }
  return {};
}

// ── LOAD SOCIAL LINKS ──────────────────────────────────────
export async function loadSocialLinks() {
  try {
    // Social links disimpan di kontak/info (sama dengan data kontak)
    const snap = await getDoc(doc(db, 'kontak', 'info'));
    if (snap.exists()) {
      const data = snap.data();
      const map = {
        facebook:  '.social-facebook',
        instagram: '.social-instagram',
        tiktok:    '.social-tiktok',
        youtube:   '.social-youtube',
        twitter:   '.social-twitter',
      };
      Object.entries(map).forEach(([key, sel]) => {
        if (data[key]) {
          document.querySelectorAll(sel).forEach(el => {
            el.href = data[key];
            el.style.display = '';
          });
        }
      });
      return data;
    }
  } catch (err) {
    console.warn('Could not load social links:', err.message);
  }
  return {};
}

// ── LOAD CONTACT INFO ──────────────────────────────────────
export async function loadContact() {
  try {
    const snap = await getDoc(doc(db, 'kontak', 'info'));
    if (snap.exists()) {
      const data = snap.data();
      // WhatsApp float button
      const wa = document.querySelector('.wa-float');
      if (wa && data.whatsapp) {
        const phone = data.whatsapp.replace(/\D/g, '');
        wa.href = `https://wa.me/${phone}?text=Assalamu'alaikum%2C%20saya%20ingin%20bertanya...`;
        wa.style.display = '';
      }
      return data;
    }
  } catch (err) {
    console.warn('Could not load contact:', err.message);
  }
  return {};
}

// ── FORMAT DATE (Indonesian) ───────────────────────────────
export function formatDate(date, opts = {}) {
  if (!date) return '';
  let d = date;
  if (date?.toDate) d = date.toDate(); // Firestore Timestamp
  if (typeof date === 'string') d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts,
  });
}

// ── SLUGIFY ────────────────────────────────────────────────
export function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ── TRUNCATE ───────────────────────────────────────────────
export function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + '...' : str;
}

// ── SKELETON LOADER ────────────────────────────────────────
export function createSkeleton(count = 3, html = '') {
  return Array(count).fill(html || `
    <div class="card">
      <div class="skeleton" style="height:180px;"></div>
      <div class="card-body">
        <div class="skeleton" style="height:16px;margin-bottom:8px;width:60%;"></div>
        <div class="skeleton" style="height:20px;margin-bottom:8px;"></div>
        <div class="skeleton" style="height:14px;width:80%;"></div>
      </div>
    </div>
  `).join('');
}

// ── INITIALIZE APP ─────────────────────────────────────────
export async function initApp() {
  initDarkMode();
  initNavbar();
  initScrollAnimations();
  initCounters();
  await Promise.allSettled([loadSiteSettings(), loadContact(), loadSocialLinks()]);
}
