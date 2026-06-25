// ============================================================
// home.js — Home Page Logic
// Hero Slider, News, Achievements, Gallery Preview, FAQ Preview
// ============================================================

import { db } from './firebase-init.js';
import {
  collection, getDocs, query, orderBy, limit, where
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initApp, formatDate, truncate } from './app.js';
import { positionToCSS } from './admin/image-position-editor.js';


// ── HERO SLIDER ────────────────────────────────────────────
let currentSlide = 0;
let slides = [];
let autoPlayTimer = null;

// Mapping ukuran font dari setting admin
const TITLE_SIZES = {
  small:  'clamp(1.4rem, 3vw, 2.2rem)',
  medium: 'clamp(2rem, 4.5vw, 3.2rem)',
  large:  'clamp(2.5rem, 5.5vw, 4rem)',
  xlarge: 'clamp(3rem, 7vw, 5.5rem)',
};
const SUBTITLE_SIZES = {
  small:  'clamp(0.8rem, 1.2vw, 0.95rem)',
  medium: 'clamp(0.95rem, 1.5vw, 1.15rem)',
  large:  'clamp(1.1rem, 2vw, 1.4rem)',
};

function renderSlides(banners) {
  const slidesEl = document.getElementById('heroSlides');
  const dotsEl = document.getElementById('heroDots');
  if (!slidesEl || !dotsEl) return;

  if (!banners.length) {
    // Tidak ada banner — tampilkan konten default dengan fade-in smooth
    const content = document.getElementById('defaultSlideContent');
    if (content) {
      content.innerHTML = `
        <div class="hero-badge"> Yayasan Pendidikan Islam</div>
        <h1 class="hero-title">Mencetak Generasi <span>Islam Unggul</span></h1>
        <p class="hero-subtitle">Berilmu, Beriman, dan Berakhlak Mulia untuk membangun peradaban bangsa yang bermartabat.</p>
        <div class="hero-actions">
          <a href="profil.html" class="btn btn-accent btn-lg"><i class="fas fa-info-circle"></i> Profil Sekolah</a>
          <a href="ppdb.html" class="btn btn-outline btn-lg"><i class="fas fa-edit"></i> Daftar PPDB</a>
        </div>`;
      // Fade-in smooth setelah konten diisi
      requestAnimationFrame(() => { content.style.opacity = '1'; });
    }
    startAutoPlay();
    return;
  }

  // Ada banner dari Firestore — hapus default slide, tampilkan banner
  const def = document.getElementById('defaultSlide');
  if (def) def.remove();

  slides = banners;
  slidesEl.innerHTML = '';
  dotsEl.innerHTML = '';

  banners.forEach((b, i) => {
    const titleFs    = TITLE_SIZES[b.titleSize]    || TITLE_SIZES.medium;
    const subtitleFs = SUBTITLE_SIZES[b.subtitleSize] || SUBTITLE_SIZES.medium;

    // Slide
    const slide = document.createElement('div');
    slide.className = `hero-slide${i === 0 ? ' active' : ''}`;
    slide.innerHTML = `
      ${b.imageUrl ? `<img class="hero-slide-bg" src="${b.imageUrl}" alt="${b.title}" loading="${i === 0 ? 'eager' : 'lazy'}" />` : ''}
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-text">
            <div class="hero-badge"> ${b.badge || 'Yayasan Pendidikan Islam'}</div>
            <h1 class="hero-title" style="font-size:${titleFs};">${b.title || ''}</h1>
            <p class="hero-subtitle" style="font-size:${subtitleFs};">${b.subtitle || ''}</p>
            <div class="hero-actions">
              ${b.buttonUrl ? `<a href="${b.buttonUrl}" class="btn btn-accent btn-lg"><i class="fas fa-arrow-right"></i> ${b.buttonText || 'Selengkapnya'}</a>` : ''}
              <a href="ppdb.html" class="btn btn-outline btn-lg"><i class="fas fa-edit"></i> Daftar PPDB</a>
            </div>
          </div>
        </div>
      </div>
    `;
    slidesEl.appendChild(slide);

    // Dot
    const dot = document.createElement('button');
    dot.className = `hero-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(dot);
  });

  currentSlide = 0;
  startAutoPlay();
}


function goToSlide(index) {
  const allSlides = document.querySelectorAll('.hero-slide');
  const allDots   = document.querySelectorAll('.hero-dot');
  if (!allSlides.length) return;

  // Crossfade: slide lama tetap, slide baru muncul di atas
  allSlides[currentSlide]?.classList.remove('active');
  allDots[currentSlide]?.classList.remove('active');

  currentSlide = (index + allSlides.length) % allSlides.length;

  allSlides[currentSlide]?.classList.add('active');
  allDots[currentSlide]?.classList.add('active');
}


function nextSlide() {
  const count = document.querySelectorAll('.hero-slide').length;
  goToSlide((currentSlide + 1) % count);
}

function prevSlide() {
  const count = document.querySelectorAll('.hero-slide').length;
  goToSlide((currentSlide - 1 + count) % count);
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayTimer = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
  if (autoPlayTimer) clearInterval(autoPlayTimer);
}

// ── LOAD BANNERS ───────────────────────────────────────────
async function loadBanners() {
  try {
    // Ambil semua banner urut berdasarkan order, filter active di client
    // (menghindari kebutuhan composite index di Firestore)
    const q = query(
      collection(db, 'banners'),
      orderBy('order', 'asc')
    );
    const snap = await getDocs(q);
    const banners = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(b => b.active !== false); // filter: active = true atau tidak diset
    renderSlides(banners);
  } catch (err) {
    console.warn('Could not load banners:', err.message);
    startAutoPlay();
  }
}


// ── LOAD PRINCIPAL MESSAGE ─────────────────────────────────
async function loadPrincipal() {
  try {
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap = await getDoc(doc(db, 'profil', 'sekolah'));
    if (!snap.exists()) return;
    const d = snap.data();

    const quote = document.getElementById('principalQuote');
    const name  = document.getElementById('principalName');
    const role  = document.getElementById('principalRole');
    const imgWrap = document.getElementById('principalImgWrap');

    if (d.principalMessage && quote) quote.textContent = d.principalMessage;
    if (d.principalName && name)  name.textContent  = d.principalName;
    if (d.principalRole && role)  role.textContent  = d.principalRole;

    if (d.principalPhoto && imgWrap) {
      imgWrap.outerHTML = `<img class="principal-img" src="${d.principalPhoto}" alt="${d.principalName || 'Kepala Sekolah'}" id="principalImg" />`;
    }
  } catch (err) {
    console.warn('Could not load principal info:', err.message);
  }
}

// ── LOAD NEWS ──────────────────────────────────────────────
async function loadNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;

  // Ubah class container menjadi news-layout
  grid.className = 'news-layout';

  try {
    const q = query(
      collection(db, 'berita'),
      orderBy('publishDate', 'desc'),
      limit(12)
    );
    const snap = await getDocs(q);
    const articles = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(a => a.status === 'published')
      .slice(0, 6);

    if (!articles.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">
        <i class="fas fa-newspaper" style="font-size:2rem;margin-bottom:12px;display:block;opacity:0.3;"></i>
        Belum ada berita tersedia.
      </div>`;
      return;
    }

    // Kiri: 3 artikel bernomor
    const mainArticles = articles.slice(0, 3);
    // Kanan sidebar: semua artikel (maks 5 untuk sidebar)
    const sidebarArticles = articles.slice(0, 5);

    const PLACEHOLDER = 'https://via.placeholder.com/200x130?text=No+Image';
    const PLACEHOLDER_SB = 'https://via.placeholder.com/56x44?text=NH';

    const numLabels = ['01', '02', '03'];

    const mainHTML = `
      <div class="news-article-list">
        ${mainArticles.map((a, i) => {
          const objPos = positionToCSS(a.photoPos);
          return `
          <a href="berita-detail.html?slug=${a.slug || a.id}" class="news-article-item">
            <span class="news-article-num">${numLabels[i]}</span>
            <img class="news-article-thumb"
                 src="${a.thumbnail || PLACEHOLDER}"
                 alt="${a.title}" loading="lazy"
                 style="object-position:${objPos};"
                 onerror="this.src='${PLACEHOLDER}'" />
            <div class="news-article-body">
              <span class="news-article-category">${a.category || 'Berita Umum'}</span>
              <h3 class="news-article-title">${a.title}</h3>
              <p class="news-article-excerpt">${truncate(a.excerpt || a.content?.replace(/<[^>]+>/g, '') || '', 120)}</p>
              <span class="news-article-date">
                <i class="fas fa-calendar-alt"></i>
                ${formatDate(a.publishDate)}
              </span>
            </div>
          </a>
        `; }).join('')}
      </div>
    `;

    const sidebarHTML = `
      <aside class="news-sidebar">
        <div class="news-sidebar-header">
          <div class="news-sidebar-icon"><i class="fas fa-fire-alt"></i></div>
          <div class="news-sidebar-title">Berita Terkini</div>
        </div>
        <div class="news-sidebar-list">
          ${sidebarArticles.map(a => {
            const objPos = positionToCSS(a.photoPos);
            return `
            <a href="berita-detail.html?slug=${a.slug || a.id}" class="news-sidebar-item">
              <img class="news-sidebar-thumb"
                   src="${a.thumbnail || PLACEHOLDER_SB}"
                   alt="${a.title}" loading="lazy"
                   style="object-position:${objPos};"
                   onerror="this.src='${PLACEHOLDER_SB}'" />
              <div class="news-sidebar-body">
                <div class="news-sidebar-item-title">${a.title}</div>
                <div class="news-sidebar-item-date">
                  <i class="fas fa-calendar-alt" style="margin-right:3px;"></i>${formatDate(a.publishDate)}
                </div>
              </div>
            </a>
          `; }).join('')}
        </div>
        <div class="news-sidebar-footer">
          <a href="berita.html">Lihat Semua Berita <i class="fas fa-arrow-right"></i></a>
        </div>
      </aside>
    `;

    grid.innerHTML = mainHTML + sidebarHTML;

  } catch (err) {
    console.warn('Could not load news:', err.message);
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Gagal memuat berita.</div>`;
  }
}


// ── LOAD PRESTASI ──────────────────────────────────────────
async function loadPrestasi() {
  const grid = document.getElementById('prestasiGrid');
  if (!grid) return;

  try {
    // Gunakan orderBy year desc seperti di prestasi.js, dengan fallback jika index belum ada
    let items = [];
    try {
      const q = query(collection(db, 'prestasi'), orderBy('year', 'desc'), limit(4));
      const snap = await getDocs(q);
      items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (indexErr) {
      // Fallback: ambil tanpa orderBy jika index belum dibuat
      console.warn('Firestore index belum ada, fallback tanpa orderBy:', indexErr.message);
      const q2 = query(collection(db, 'prestasi'), limit(20));
      const snap2 = await getDocs(q2);
      items = snap2.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.year || 0) - (a.year || 0))
        .slice(0, 4);
    }

    if (!items.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">
        <i class="fas fa-trophy" style="font-size:2rem;display:block;margin-bottom:12px;opacity:0.3;"></i>
        Belum ada data prestasi.
      </div>`;
      return;
    }

    const levelColors = {
      'internasional': '#7C3AED',
      'nasional': '#DC2626',
      'provinsi': '#D97706',
      'kabupaten': '#1B4F8A',
      'kecamatan': '#16A34A',
    };

    grid.innerHTML = items.map(p => {
      const level = (p.level || '').toLowerCase();
      const color = levelColors[level] || '#1B4F8A';
      return `
        <div class="achievement-card fade-in">
          ${p.photo
            ? `<img class="achievement-medal" src="${p.photo}" alt="${p.studentName || 'Prestasi'}" loading="lazy" />`
            : `<div class="achievement-medal-placeholder">🏆</div>`
          }
          <div class="achievement-title">${p.title || 'Prestasi'}</div>
          <div class="achievement-name">${p.studentName || ''}</div>
          <span class="achievement-badge" style="background:${color}15;color:${color};">
            ${p.level || ''} &bull; ${p.year || ''}
          </span>
        </div>
      `;
    }).join('');

    // Trigger fade-in animation
    grid.querySelectorAll('.fade-in').forEach(el => setTimeout(() => el.classList.add('visible'), 50));

  } catch (err) {
    console.warn('Could not load achievements:', err.message);
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">
      <i class="fas fa-exclamation-circle" style="font-size:2rem;display:block;margin-bottom:12px;opacity:0.3;"></i>
      Gagal memuat data prestasi.
    </div>`;
  }
}

// ── LOAD GALLERY PREVIEW ───────────────────────────────────
async function loadGalleryPreview() {
  const gallery = document.getElementById('homeGallery');
  if (!gallery) return;

  try {
    const q = query(collection(db, 'galeri'), orderBy('createdAt', 'desc'), limit(8));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (!items.length) {
      gallery.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Belum ada foto di galeri.</div>`;
      return;
    }

    gallery.innerHTML = items.map(g => `
      <a href="galeri.html" class="gallery-item">
        <img src="${g.imageUrl}" alt="${g.title || 'Galeri'}" loading="lazy" />
        <div class="gallery-item-overlay">
          <span class="gallery-item-title">${g.title || ''}</span>
        </div>
      </a>
    `).join('');
  } catch (err) {
    console.warn('Could not load gallery:', err.message);
    gallery.innerHTML = '';
  }
}

// ── LOAD FAQ PREVIEW ───────────────────────────────────────
async function loadFaqPreview() {
  const container = document.getElementById('homeFaq');
  if (!container) return;

  try {
    const q = query(collection(db, 'faq'), orderBy('order', 'asc'), limit(3));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (!items.length) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = items.map(f => `
      <div class="faq-item" data-faq>
        <div class="faq-question" tabindex="0">
          <span>${f.question}</span>
          <span class="faq-icon"><i class="fas fa-chevron-down"></i></span>
        </div>
        <div class="faq-answer">
          <div class="faq-answer-inner">${f.answer}</div>
        </div>
      </div>
    `).join('');

    // Accordion
    container.querySelectorAll('[data-faq]').forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        container.querySelectorAll('[data-faq]').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
      question.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); question.click(); }
      });
    });
  } catch (err) {
    console.warn('Could not load FAQ preview:', err.message);
    container.innerHTML = '';
  }
}

// ── LOAD PPDB INFO ─────────────────────────────────────────
async function loadPpdbInfo() {
  try {
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap = await getDoc(doc(db, 'ppdb', 'info'));
    if (!snap.exists()) return;
    const d = snap.data();
    const title = document.getElementById('ppdbTitle');
    const desc  = document.getElementById('ppdbDesc');
    if (d.bannerTitle && title) title.textContent = d.bannerTitle;
    if (d.bannerDesc  && desc)  desc.textContent  = d.bannerDesc;
  } catch (err) {
    console.warn('Could not load PPDB info:', err.message);
  }
}

// ── LOAD CONTACT FOR FOOTER ────────────────────────────────
async function loadFooterContact() {
  try {
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap = await getDoc(doc(db, 'kontak', 'info'));
    if (!snap.exists()) return;
    const d = snap.data();

    if (d.address) {
      document.getElementById('footerAddress')?.querySelector('span')?.replaceWith(
        Object.assign(document.createElement('span'), { textContent: d.address })
      );
    }
    if (d.phone) {
      document.getElementById('footerPhone')?.querySelector('span')?.replaceWith(
        Object.assign(document.createElement('span'), { textContent: d.phone })
      );
    }
    if (d.email) {
      document.getElementById('footerEmail')?.querySelector('span')?.replaceWith(
        Object.assign(document.createElement('span'), { textContent: d.email })
      );
    }
    if (d.whatsapp) {
      document.getElementById('footerWhatsapp')?.querySelector('span')?.replaceWith(
        Object.assign(document.createElement('span'), { textContent: d.whatsapp })
      );
    }
  } catch (err) {
    console.warn('Could not load footer contact:', err.message);
  }
}

// ── INIT ───────────────────────────────────────────────────
async function init() {
  // Year in footer
  const yr = document.getElementById('currentYear');
  if (yr) yr.textContent = new Date().getFullYear();

  // Hero controls
  document.getElementById('heroPrev')?.addEventListener('click', () => {
    stopAutoPlay(); prevSlide(); startAutoPlay();
  });
  document.getElementById('heroNext')?.addEventListener('click', () => {
    stopAutoPlay(); nextSlide(); startAutoPlay();
  });

  // Touch swipe
  const hero = document.getElementById('hero');
  if (hero) {
    let touchStartX = 0;
    hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { stopAutoPlay(); diff > 0 ? nextSlide() : prevSlide(); startAutoPlay(); }
    }, { passive: true });
  }

  // Init shared app features (dark mode, navbar, scroll anims, etc.)
  await initApp();

  // Load all sections in parallel
  await Promise.allSettled([
    loadBanners(),
    loadPrincipal(),
    loadNews(),
    loadPrestasi(),
    loadGalleryPreview(),
    loadFaqPreview(),
    loadPpdbInfo(),
    loadFooterContact(),
  ]);
}

document.addEventListener('DOMContentLoaded', init);
