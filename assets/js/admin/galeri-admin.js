// galeri-admin.js
import { db } from '../firebase-init.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, confirmDelete, uploadImageWithProgress, deleteImageFromStorage } from './admin-app.js';
import { createImagePositionEditor, positionToCSS } from './image-position-editor.js';

let allPhotos = [];
let selectedFiles = [];
let singlePhotoEditor = null;   // editor untuk upload baru
let editPhotoEditor   = null;   // editor untuk edit foto existing

// ── LOAD & RENDER ──────────────────────────────────────
async function loadGallery(cat = 'all') {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '<div class="skeleton" style="aspect-ratio:1;border-radius:10px;"></div>'.repeat(8);
  try {
    const q = query(collection(db, 'galeri'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    let docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (cat !== 'all') docs = docs.filter(d => d.category === cat);
    allPhotos = docs;
    render();
  } catch (err) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--admin-text-muted);">Gagal: ${err.message}</div>`;
  }
}

function render() {
  const grid = document.getElementById('galleryGrid');
  if (!allPhotos.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-images"></i></div><div class="empty-state-title">Belum ada foto</div></div></div>`;
    return;
  }
  grid.innerHTML = allPhotos.map(g => `
    <div class="media-grid-item ${g.orientation || 'square'}" title="${g.title || ''}">
      <img src="${g.imageUrl}" alt="${g.title || ''}" loading="lazy"
           style="object-position:${positionToCSS(g.photoPos)};"/>
      <div class="media-grid-overlay">
        <div class="media-grid-title">${g.title || g.category || ''}</div>
        <div style="display:flex;gap:6px;">
          <button class="action-btn" onclick="editPhoto('${g.id}')"
                  style="background:rgba(27,79,138,0.9);color:#fff;border:none;" title="Edit posisi foto">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="delPhoto('${g.id}', '${g.imageUrl}')"
                  style="background:rgba(239,68,68,0.9);color:#fff;border:none;" title="Hapus foto">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>`).join('');
}

// ── HAPUS ──────────────────────────────────────────────
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

// ── EDIT FOTO ──────────────────────────────────────────
window.editPhoto = (id) => {
  const photo = allPhotos.find(g => g.id === id);
  if (!photo) return;

  // Isi form
  document.getElementById('editId').value       = id;
  document.getElementById('editTitle').value    = photo.title || '';
  document.getElementById('editCategory').value = photo.category || 'kegiatan';
  document.getElementById('editOrientation').value = photo.orientation || 'square';

  // Load foto ke editor dengan posisi tersimpan
  if (editPhotoEditor) {
    editPhotoEditor.loadImage(photo.imageUrl, photo.photoPos || null);
  }

  document.getElementById('editModal').classList.add('open');
};

function closeEditModal() {
  document.getElementById('editModal').classList.remove('open');
  if (editPhotoEditor) editPhotoEditor.hide();
}

async function saveEdit() {
  const id = document.getElementById('editId').value;
  if (!id) return;

  const btn = document.getElementById('saveEdit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

  try {
    // Ambil posisi terbaru dari editor
    const photoPos = editPhotoEditor ? editPhotoEditor.getPosition() : null;

    await updateDoc(doc(db, 'galeri', id), {
      title:       document.getElementById('editTitle').value.trim(),
      category:    document.getElementById('editCategory').value,
      orientation: document.getElementById('editOrientation').value,
      photoPos,      // { x, y, scale } — diterapkan sebagai object-position di website
      updatedAt:   serverTimestamp(),
    });

    showToast('✅ Foto berhasil diperbarui!');
    closeEditModal();
    await loadGallery(document.getElementById('catFilter').value);
  } catch (err) {
    showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
  }
}

// ── BATCH UPLOAD dengan position editor ───────────────
let batchPositions = [];
let activeFileIdx = 0;

function buildBatchPreviews() {
  const prev = document.getElementById('uploadPreviews');
  prev.innerHTML = selectedFiles.map((f, i) => {
    const url = URL.createObjectURL(f);
    return `
      <div class="ipe-batch-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" id="batchThumb${i}"
           onclick="selectBatchFile(${i})" title="${f.name}">
        <img src="${url}" alt="${f.name}" />
        <div class="ipe-batch-num">${i + 1}</div>
      </div>`;
  }).join('');
}

window.selectBatchFile = (idx) => {
  if (singlePhotoEditor && selectedFiles.length > 0) {
    batchPositions[activeFileIdx] = singlePhotoEditor.getPosition();
  }
  activeFileIdx = idx;
  document.querySelectorAll('.ipe-batch-thumb').forEach(el => el.classList.remove('active'));
  document.getElementById(`batchThumb${idx}`)?.classList.add('active');
  const url = URL.createObjectURL(selectedFiles[idx]);
  if (singlePhotoEditor) singlePhotoEditor.loadImage(url, batchPositions[idx] || null);
  const lbl = document.getElementById('currentFileLabel');
  if (lbl) { lbl.textContent = `File ${idx + 1}/${selectedFiles.length}: ${selectedFiles[idx].name}`; lbl.style.display = ''; }
};

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('galeri');
  document.getElementById('adminTopbarSlot').innerHTML  = renderTopbar('Manajemen Galeri');
  await initAdmin('galeri');

  // Editor untuk UPLOAD baru
  const uploadEditorContainer = document.getElementById('galeriEditorContainer');
  if (uploadEditorContainer) {
    singlePhotoEditor = createImagePositionEditor(uploadEditorContainer, { aspectRatio: '4/3', shape: 'square' });
  }

  // Editor untuk EDIT foto existing
  const editEditorContainer = document.getElementById('editEditorContainer');
  if (editEditorContainer) {
    editPhotoEditor = createImagePositionEditor(editEditorContainer, { aspectRatio: '4/3', shape: 'square' });
  }

  // Upload card toggle
  const uploadCard = document.getElementById('uploadCard');
  document.getElementById('btnUpload').addEventListener('click', () => {
    const isHidden = uploadCard.style.display === 'none' || uploadCard.style.display === '';
    uploadCard.style.display = isHidden ? 'block' : 'none';
  });

  document.getElementById('cancelUpload').onclick = () => {
    uploadCard.style.display = 'none';
    selectedFiles = [];
    batchPositions = [];
    document.getElementById('uploadPreviews').innerHTML = '';
    if (singlePhotoEditor) singlePhotoEditor.hide();
    const lbl = document.getElementById('currentFileLabel');
    if (lbl) lbl.style.display = 'none';
  };

  // Pilih file
  document.getElementById('batchFiles').onchange = e => {
    selectedFiles = Array.from(e.target.files);
    batchPositions = selectedFiles.map(() => ({ x: 50, y: 50, scale: 1 }));
    activeFileIdx = 0;
    buildBatchPreviews();
    if (selectedFiles.length > 0) {
      const url = URL.createObjectURL(selectedFiles[0]);
      if (singlePhotoEditor) singlePhotoEditor.loadImage(url, null);
      const lbl = document.getElementById('currentFileLabel');
      if (lbl) { lbl.textContent = `File 1/${selectedFiles.length}: ${selectedFiles[0].name}`; lbl.style.display = ''; }
    }
  };

  // Upload semua
  document.getElementById('doUpload').onclick = async () => {
    if (!selectedFiles.length) { showToast('Pilih foto terlebih dahulu', 'warning'); return; }
    if (singlePhotoEditor) batchPositions[activeFileIdx] = singlePhotoEditor.getPosition();

    const btn = document.getElementById('doUpload');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
    const progressBar  = document.getElementById('uploadProgressBar');
    const progressText = document.getElementById('uploadProgressText');
    document.getElementById('uploadProgressWrap').style.display = '';

    const cat         = document.getElementById('uploadCategory').value;
    const title       = document.getElementById('uploadTitle').value.trim();
    const orientation = document.getElementById('uploadOrientation').value;
    let uploaded = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        const url = await uploadImageWithProgress(file, `gallery/${cat}`, pct => {
          const overall = ((i / selectedFiles.length) + (pct / selectedFiles.length / 100)) * 100;
          progressBar.style.width = overall + '%';
          progressText.textContent = Math.round(overall) + '%';
        });
        await addDoc(collection(db, 'galeri'), {
          imageUrl: url,
          category: cat,
          orientation,
          title: title || file.name.replace(/\.[^/.]+$/, ''),
          photoPos: batchPositions[i] || { x: 50, y: 50, scale: 1 },
          createdAt: serverTimestamp()
        });
        uploaded++;
      } catch (err) { showToast(`Gagal upload ${file.name}: ${err.message}`, 'error'); }
    }

    showToast(`${uploaded}/${selectedFiles.length} foto berhasil diupload!`);
    selectedFiles = [];
    batchPositions = [];
    document.getElementById('uploadPreviews').innerHTML = '';
    document.getElementById('batchFiles').value = '';
    if (singlePhotoEditor) singlePhotoEditor.hide();
    const lbl = document.getElementById('currentFileLabel');
    if (lbl) lbl.style.display = 'none';
    uploadCard.style.display = 'none';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-upload"></i> Upload Semua';
    await loadGallery();
  };

  // Edit modal events
  document.getElementById('closeEditModal').onclick  = closeEditModal;
  document.getElementById('cancelEditModal').onclick = closeEditModal;
  document.getElementById('saveEdit').onclick        = saveEdit;
  document.getElementById('editModal').onclick = e => { if (e.target === e.currentTarget) closeEditModal(); };

  // Filter kategori
  document.getElementById('catFilter').onchange = e => loadGallery(e.target.value);
  await loadGallery();
});
