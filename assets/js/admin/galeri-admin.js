// galeri-admin.js
import { db } from '../firebase-init.js';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp, where }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, confirmDelete, uploadImageWithProgress, deleteImageFromStorage } from './admin-app.js';

let allPhotos = [];
let selectedFiles = [];

async function loadGallery(cat = 'all') {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '<div class="skeleton" style="aspect-ratio:1;border-radius:10px;"></div>'.repeat(8);
  try {
    let q = query(collection(db, 'galeri'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    let docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Client-side filter to avoid composite index requirement
    if (cat !== 'all') {
      docs = docs.filter(d => d.category === cat);
    }
    
    allPhotos = docs;
    render();
  } catch (err) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--admin-text-muted);">Gagal: ${err.message}</div>`; }
}

function render() {
  const grid = document.getElementById('galleryGrid');
  if (!allPhotos.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-images"></i></div><div class="empty-state-title">Belum ada foto</div></div></div>`;
    return;
  }
  grid.innerHTML = allPhotos.map(g => `
    <div class="media-grid-item ${g.orientation || 'square'}" title="${g.title || ''}">
      <img src="${g.imageUrl}" alt="${g.title || ''}" loading="lazy"/>
      <div class="media-grid-overlay">
        <div class="media-grid-title">${g.title || g.category || ''}</div>
        <button class="action-btn delete" onclick="delPhoto('${g.id}', '${g.imageUrl}')" style="background:rgba(239,68,68,0.9);color:#fff;border:none;"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

window.delPhoto = async (id, url) => {
  const ok = await confirmDelete('Hapus foto ini?', 'Foto akan dihapus dari galeri dan storage.');
  if (!ok) return;
  try {
    await deleteDoc(doc(db, 'galeri', id));
    if (url) await deleteImageFromStorage(url);
    showToast('Foto dihapus');
    await loadGallery(document.getElementById('catFilter').value);
  } catch (err) { showToast(err.message, 'error'); }
};

// Batch upload
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('galeri');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Manajemen Galeri');
  await initAdmin('galeri');

  const uploadCard = document.getElementById('uploadCard');
  document.getElementById('btnUpload').addEventListener('click', () => {
    uploadCard.style.display = (uploadCard.style.display === 'none' || uploadCard.style.display === '') ? 'block' : 'none';
  });
  document.getElementById('cancelUpload').onclick = () => { uploadCard.style.display = 'none'; selectedFiles = []; document.getElementById('uploadPreviews').innerHTML = ''; };

  document.getElementById('batchFiles').onchange = e => {
    selectedFiles = Array.from(e.target.files);
    const prev = document.getElementById('uploadPreviews');
    prev.innerHTML = selectedFiles.map(f => {
      const url = URL.createObjectURL(f);
      return `<img src="${url}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin:4px;" alt="${f.name}"/>`;
    }).join('');
  };

  document.getElementById('doUpload').onclick = async () => {
    if (!selectedFiles.length) { showToast('Pilih foto terlebih dahulu', 'warning'); return; }
    const btn = document.getElementById('doUpload');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
    const progressBar = document.getElementById('uploadProgressBar');
    const progressText = document.getElementById('uploadProgressText');
    document.getElementById('uploadProgressWrap').style.display = '';

    const cat = document.getElementById('uploadCategory').value;
    const title = document.getElementById('uploadTitle').value.trim();
    const orientation = document.getElementById('uploadOrientation').value;
    let uploaded = 0;

    for (const file of selectedFiles) {
      try {
        const url = await uploadImageWithProgress(file, `gallery/${cat}`, pct => {
          const overall = ((uploaded / selectedFiles.length) + (pct / selectedFiles.length / 100)) * 100;
          progressBar.style.width = overall + '%';
          progressText.textContent = Math.round(overall) + '%';
        });
        await addDoc(collection(db, 'galeri'), {
          imageUrl: url,
          category: cat,
          orientation: orientation,
          title: title || file.name.replace(/\.[^/.]+$/, ''),
          createdAt: serverTimestamp()
        });
        uploaded++;
      } catch (err) { showToast(`Gagal upload ${file.name}: ${err.message}`, 'error'); }
    }

    showToast(`${uploaded}/${selectedFiles.length} foto berhasil diupload!`);
    selectedFiles = [];
    document.getElementById('uploadPreviews').innerHTML = '';
    document.getElementById('batchFiles').value = '';
    uploadCard.style.display = 'none';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-upload"></i> Upload Semua';
    await loadGallery();
  };

  document.getElementById('catFilter').onchange = e => loadGallery(e.target.value);
  await loadGallery();
});
