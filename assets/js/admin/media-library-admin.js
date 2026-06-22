// media-library-admin.js
import { db } from '../firebase-init.js';
import { collection, getDocs, deleteDoc, doc, query, orderBy }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, confirmDelete, deleteImageFromStorage } from './admin-app.js';

// Aggregates images from multiple collections
async function loadMedia() {
  const grid = document.getElementById('mediaGrid');
  const folder = document.getElementById('folderFilter').value;
  try {
    const allMedia = [];

    // Collect from galeri
    if (folder === 'all' || folder === 'gallery') {
      const snap = await getDocs(query(collection(db, 'galeri'), orderBy('createdAt', 'desc')));
      snap.docs.forEach(d => { const data = d.data(); if (data.imageUrl) allMedia.push({ id: d.id, collection: 'galeri', url: data.imageUrl, title: data.title || 'Galeri', category: 'gallery' }); });
    }
    // Collect from banners
    if (folder === 'all' || folder === 'banner') {
      const snap = await getDocs(query(collection(db, 'banners'), orderBy('order', 'asc')));
      snap.docs.forEach(d => { const data = d.data(); if (data.imageUrl) allMedia.push({ id: d.id, collection: 'banners', url: data.imageUrl, title: data.title || 'Banner', category: 'banner' }); });
    }
    // Collect from berita thumbnails
    if (folder === 'all' || folder === 'news') {
      const snap = await getDocs(query(collection(db, 'berita'), orderBy('createdAt', 'desc')));
      snap.docs.forEach(d => { const data = d.data(); if (data.thumbnail) allMedia.push({ id: d.id, collection: 'berita', url: data.thumbnail, title: data.title || 'Berita', category: 'news' }); });
    }
    // Collect from prestasi
    if (folder === 'all' || folder === 'achievements') {
      const snap = await getDocs(query(collection(db, 'prestasi'), orderBy('year', 'desc')));
      snap.docs.forEach(d => { const data = d.data(); if (data.photo) allMedia.push({ id: d.id, collection: 'prestasi', url: data.photo, title: data.studentName || 'Prestasi', category: 'achievements' }); });
    }

    if (!allMedia.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-folder-open"></i></div><div class="empty-state-title">Belum ada media</div></div></div>`;
      return;
    }

    grid.innerHTML = allMedia.map(m => `
      <div class="media-grid-item" title="${m.title}">
        <img src="${m.url}" alt="${m.title}" loading="lazy"/>
        <div class="media-grid-overlay">
          <div class="media-grid-title">${m.title}</div>
          <div style="display:flex;gap:6px;">
            <a href="${m.url}" target="_blank" class="action-btn" style="background:rgba(255,255,255,0.2);color:#fff;" title="Lihat"><i class="fas fa-external-link-alt"></i></a>
            <button class="action-btn delete" title="Hapus dari storage" onclick="delMedia('${m.id}','${m.collection}','${m.url}')"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>`).join('');
  } catch (err) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--admin-text-muted);">Gagal: ${err.message}</div>`;
  }
}

window.delMedia = async (id, col, url) => {
  const ok = await confirmDelete('Hapus media ini?', 'Foto akan dihapus dari database dan storage Firebase.');
  if (!ok) return;
  try {
    // Delete from storage (try, not required to succeed)
    if (url.startsWith('https://')) await deleteImageFromStorage(url);
    // For galeri, delete the doc
    if (col === 'galeri') await deleteDoc(doc(db, col, id));
    // For others, just note that thumbnail isn't removed from parent doc
    showToast('Media dihapus');
    await loadMedia();
  } catch (err) { showToast(err.message, 'error'); }
};

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('media');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Media Library');
  await initAdmin('media');
  document.getElementById('folderFilter').onchange = loadMedia;
  await loadMedia();
});
