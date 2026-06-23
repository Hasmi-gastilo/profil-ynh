// berita.js — Handles both berita.html (list) and berita-detail.html (single)
import { db } from './firebase-init.js';
import { collection, getDocs, getDoc, query, orderBy, limit, where, doc, startAfter }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initApp, formatDate, truncate } from './app.js';

const PAGE_SIZE = 9;
let lastDoc = null;
let currentCat = 'all';
let searchQuery = '';
let allArticles = [];

// ── NEWS LIST PAGE ─────────────────────────────────────────
async function initListPage() {
  await loadCategories();
  await loadNews(true);
  await loadLatestNewsSidebar();

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  const doSearch = () => {
    searchQuery = searchInput?.value.toLowerCase().trim() || '';
    renderFiltered();
  };

  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  document.getElementById('loadMoreBtn')?.addEventListener('click', () => loadNews(false));
}

async function loadCategories() {
  try {
    const q = query(collection(db, 'berita'));
    const snap = await getDocs(q);
    const cats = new Set();
    snap.docs.forEach(d => { 
      const data = d.data();
      if (data.status === 'published' && data.category) cats.add(data.category); 
    });

    const filter = document.getElementById('categoryFilter');
    if (!filter) return;
    
    // Clear existing (except 'Semua')
    filter.innerHTML = '<button class="news-widget-tag active" data-cat="all">Semua</button>';
    
    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'news-widget-tag';
      btn.dataset.cat = cat;
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        currentCat = cat;
        document.querySelectorAll('#categoryFilter .news-widget-tag').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFiltered();
      });
      filter.appendChild(btn);
    });

    filter.querySelector('[data-cat="all"]')?.addEventListener('click', (e) => {
      currentCat = 'all';
      document.querySelectorAll('#categoryFilter .news-widget-tag').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderFiltered();
    });
  } catch (err) { console.warn('Categories load error:', err.message); }
}

async function loadNews(reset = true) {
  if (reset) { allArticles = []; lastDoc = null; }
  try {
    let q = query(collection(db, 'berita'), orderBy('publishDate', 'desc'), limit(PAGE_SIZE + 5)); // Fetch extra in case of unpublished
    if (lastDoc) q = query(collection(db, 'berita'), orderBy('publishDate', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE + 5));
    const snap = await getDocs(q);
    
    // Filter client-side
    let docs = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(a => a.status === 'published');
    
    // Jika lebih dari PAGE_SIZE, potong
    if (docs.length > PAGE_SIZE) docs = docs.slice(0, PAGE_SIZE);

    lastDoc = snap.docs[snap.docs.length - 1] || null;
    allArticles = reset ? docs : [...allArticles, ...docs];
    document.getElementById('loadMoreWrap').style.display = snap.docs.length >= PAGE_SIZE ? '' : 'none';
    renderFiltered();
  } catch (err) {
    console.warn('News load error:', err.message);
    document.getElementById('newsGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Gagal memuat berita.</div>`;
  }
}

function renderFiltered() {
  const grid = document.getElementById('newsGrid');
  const empty = document.getElementById('emptyNews');
  if (!grid) return;

  let filtered = allArticles;
  if (currentCat !== 'all') filtered = filtered.filter(a => a.category === currentCat);
  if (searchQuery) filtered = filtered.filter(a =>
    a.title?.toLowerCase().includes(searchQuery) ||
    a.excerpt?.toLowerCase().includes(searchQuery) ||
    a.content?.toLowerCase().includes(searchQuery)
  );

  if (!filtered.length) {
    grid.innerHTML = '';
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  const isRecent = (dateStr) => {
    if (!dateStr) return false;
    const diffTime = Math.abs(new Date() - new Date(dateStr));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  grid.innerHTML = filtered.map((a, i) => {
    // Selang-seling warna header (hijau gelap/primer atau orange/accent)
    const isAccent = i % 2 !== 0 ? 'accent' : '';
    const isNew = isRecent(a.publishDate) ? `<div class="news-badge-new">BARU</div>` : '';
    
    return `
    <a href="berita-detail.html?slug=${a.slug || a.id}" class="news-page-card" style="text-decoration:none;">
      <div class="news-page-card-header ${isAccent}">
        <i class="fas fa-newspaper"></i> ${a.category || 'Berita Umum'}
      </div>
      <div class="news-page-card-img-wrap">
        ${isNew}
        <img class="news-page-card-img" src="${a.thumbnail || 'https://via.placeholder.com/400x225?text=No+Image'}" alt="${a.title}" loading="lazy" />
      </div>
      <div class="news-page-card-body">
        <h3 class="news-page-card-title">${a.title}</h3>
        <p class="news-page-card-excerpt">${truncate(a.excerpt || (a.content || '').replace(/<[^>]+>/g, ''), 120)}</p>
        <div class="news-page-card-footer">
          <span><i class="fas fa-calendar-alt"></i> ${formatDate(a.publishDate)}</span>
          <span class="news-page-card-read">Baca <i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </a>
  `}).join('');
}

async function loadLatestNewsSidebar() {
  const list = document.getElementById('latestNewsList');
  if (!list) return;

  try {
    const q = query(collection(db, 'berita'), orderBy('publishDate', 'desc'), limit(10));
    const snap = await getDocs(q);
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(a => a.status === 'published').slice(0, 5);
    
    if (!docs.length) {
      list.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:12px;">Belum ada berita.</div>';
      return;
    }

    list.innerHTML = docs.map(a => `
      <a href="berita-detail.html?slug=${a.slug || a.id}" class="news-widget-item">
        <img class="news-widget-thumb" src="${a.thumbnail || 'https://via.placeholder.com/64x52?text=NH'}" alt="${a.title}" loading="lazy" />
        <div class="news-widget-item-body">
          <div class="news-widget-item-title">${a.title}</div>
          <div class="news-widget-item-date"><i class="fas fa-calendar-alt" style="margin-right:4px;"></i>${formatDate(a.publishDate)}</div>
        </div>
      </a>
    `).join('');
  } catch(err) {
    list.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem;">Gagal memuat berita terkini.</div>';
  }
}

// ── DETAIL PAGE ────────────────────────────────────────────
async function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) { window.location.href = 'berita.html'; return; }

  try {
    // Try to find by slug first
    let articleData = null;
    const q = query(collection(db, 'berita'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      articleData = { id: snap.docs[0].id, ...snap.docs[0].data() };
    } else {
      // Fallback: try as document ID
      const docSnap = await getDoc(doc(db, 'berita', slug));
      if (docSnap.exists()) articleData = { id: docSnap.id, ...docSnap.data() };
    }

    if (!articleData) {
      document.getElementById('articleBody').innerHTML = '<p>Artikel tidak ditemukan.</p>';
      return;
    }

    renderDetail(articleData);
    loadRelated(articleData.category, articleData.id);
  } catch (err) {
    console.warn('Detail load error:', err.message);
    document.getElementById('articleBody').innerHTML = '<p>Gagal memuat artikel.</p>';
  }
}

function renderDetail(a) {
  document.title = `${a.title} — LPI Nurul Huda Kapedi`;
  const titleEl = document.getElementById('articleTitle');
  if (titleEl) titleEl.textContent = `${a.title} — LPI Nurul Huda Kapedi`;

  // Hero image
  const hero = document.getElementById('articleHero');
  if (hero && a.thumbnail) {
    hero.innerHTML = `<img src="${a.thumbnail}" alt="${a.title}" style="width:100%;max-height:480px;object-fit:cover;display:block;" />`;
  } else if (hero) {
    hero.innerHTML = `<div style="height:120px;background:linear-gradient(135deg,var(--primary-dark),var(--primary));"></div>`;
  }

  // Header
  const header = document.getElementById('articleHeader');
  if (header) header.innerHTML = `
    <span class="card-label card-label-primary" style="margin-bottom:16px;display:inline-flex;">${a.category || 'Berita'}</span>
    <h1 style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:800;line-height:1.25;margin-bottom:16px;">${a.title}</h1>
    <div style="display:flex;gap:20px;flex-wrap:wrap;color:var(--text-muted);font-size:0.85rem;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid var(--border-light);">
      <span><i class="fas fa-user" style="margin-right:6px;color:var(--primary);"></i>${a.author || 'Admin'}</span>
      <span><i class="fas fa-calendar" style="margin-right:6px;color:var(--primary);"></i>${formatDate(a.publishDate)}</span>
      ${a.tags?.length ? `<span><i class="fas fa-tags" style="margin-right:6px;color:var(--primary);"></i>${a.tags.join(', ')}</span>` : ''}
    </div>
  `;

  // Breadcrumb
  const bc = document.getElementById('breadcrumbTitle');
  if (bc) bc.textContent = truncate(a.title, 40);

  // Body
  const body = document.getElementById('articleBody');
  if (body) body.innerHTML = a.content || '<p>Konten tidak tersedia.</p>';

  // Tags
  if (a.tags?.length) {
    const tagsEl = document.getElementById('articleTags');
    const tagList = document.getElementById('tagList');
    if (tagsEl) tagsEl.style.display = '';
    if (tagList) tagList.innerHTML = a.tags.map(t => `<span class="badge badge-primary">${t}</span>`).join('');
  }

  // Share buttons
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(a.title);
  document.getElementById('shareWa')?.setAttribute('href', `https://wa.me/?text=${title}%20${url}`);
  document.getElementById('shareFb')?.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${url}`);
  document.getElementById('copyLink')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    document.getElementById('copyLink').innerHTML = '<i class="fas fa-check"></i> Tersalin!';
    setTimeout(() => { document.getElementById('copyLink').innerHTML = '<i class="fas fa-link"></i> Salin Link'; }, 2000);
  });
}

async function loadRelated(category, excludeId) {
  const grid = document.getElementById('relatedNews');
  if (!grid) return;
  try {
    const q = query(collection(db, 'berita'), limit(20)); // Limit a bit larger
    const snap = await getDocs(q);
    const items = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(d => d.status === 'published' && d.category === category && d.id !== excludeId)
      .slice(0, 3);
    if (!items.length) { grid.parentElement.style.display = 'none'; return; }
    grid.innerHTML = items.map(a => `
      <a href="berita-detail.html?slug=${a.slug || a.id}" class="card" style="display:block;text-decoration:none;">
        <img class="card-img" src="${a.thumbnail || 'https://via.placeholder.com/400x225?text=No+Image'}" alt="${a.title}" loading="lazy"/>
        <div class="card-body">
          <span class="card-label card-label-primary">${a.category || 'Berita'}</span>
          <div class="card-title">${a.title}</div>
          <div class="card-meta"><span class="card-meta-item"><i class="fas fa-calendar"></i> ${formatDate(a.publishDate)}</span></div>
        </div>
      </a>
    `).join('');
  } catch (err) { grid.parentElement.style.display = 'none'; }
}

// ── INIT ───────────────────────────────────────────────────
async function init() {
  const yr = document.getElementById('currentYear');
  if (yr) yr.textContent = new Date().getFullYear();
  await initApp();
  // Determine which page we're on
  if (document.getElementById('newsGrid') && document.getElementById('searchInput')) {
    await initListPage();
  } else if (document.getElementById('articleBody')) {
    await initDetailPage();
  }
}

document.addEventListener('DOMContentLoaded', init);
