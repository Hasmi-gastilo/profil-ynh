// galeri.js
import { db } from './firebase-init.js';
import { collection, getDocs, query, orderBy, where, limit, startAfter }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initApp } from './app.js';

const PAGE = 24;
let allPhotos = [];
let currentCat = 'all';
let lastSnap = null;

async function loadGallery(reset = true) {
  if (reset) { allPhotos = []; lastSnap = null; }
  try {
    const q = query(collection(db, 'galeri'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (currentCat !== 'all') {
      items = items.filter(d => d.category === currentCat);
    }

    // Client side pagination
    const startIndex = lastSnap ? allPhotos.length : 0;
    const pageItems = items.slice(startIndex, startIndex + PAGE);
    
    lastSnap = pageItems.length > 0 ? true : null; // just a boolean to track if there's more
    allPhotos = reset ? pageItems : [...allPhotos, ...pageItems];
    document.getElementById('loadMoreWrap').style.display = (startIndex + PAGE) < items.length ? '' : 'none';
    render();
  } catch (err) {
    console.warn('Gallery load error:', err.message);
    document.getElementById('galleryGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Gagal memuat galeri.</div>`;
  }
}

function render() {
  const grid = document.getElementById('galleryGrid');
  const empty = document.getElementById('emptyGallery');
  if (!allPhotos.length) { grid.innerHTML = ''; empty.style.display = ''; return; }
  empty.style.display = 'none';
  grid.innerHTML = allPhotos.map((g, i) => `
    <div class="gallery-item fade-in ${g.orientation || 'square'}" data-index="${i}" tabindex="0" role="button" aria-label="Lihat foto ${g.title || ''}">
      <img src="${g.imageUrl}" alt="${g.title || 'Galeri'}" loading="lazy" />
      <div class="gallery-item-overlay"><span class="gallery-item-title">${g.title || ''}</span></div>
    </div>
  `).join('');
  grid.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.addEventListener('click', () => openLightbox(i));
    el.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(i); });
    setTimeout(() => el.classList.add('visible'), i * 30);
  });
}

function openLightbox(index) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (!lb || !img) return;
  lb.classList.add('open');
  img.src = allPhotos[index].imageUrl;
  img.alt = allPhotos[index].title || '';
  if (cap) cap.textContent = allPhotos[index].title || '';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

async function init() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  await initApp();

  document.querySelectorAll('#galeryFilter .gallery-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCat = btn.dataset.cat;
      document.querySelectorAll('#galeryFilter .gallery-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadGallery(true);
    });
  });

  document.getElementById('loadMoreBtn')?.addEventListener('click', () => loadGallery(false));
  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  await loadGallery(true);
}

document.addEventListener('DOMContentLoaded', init);
