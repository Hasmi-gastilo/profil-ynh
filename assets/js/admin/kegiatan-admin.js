// kegiatan-admin.js
import { db } from '../firebase-init.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, confirmDelete, uploadImageWithProgress, formatDate } from './admin-app.js';
import { createImagePositionEditor, positionToCSS } from './image-position-editor.js';

let items = [];
let photoEditor = null;

async function load() {
  const tbody = document.getElementById('dataTable');
  try {
    const q = query(collection(db, 'kegiatan'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-calendar"></i></div><div class="empty-state-title">Belum ada kegiatan</div></div></td></tr>`;
      return;
    }
    tbody.innerHTML = items.map(k => {
      const statusMap   = { upcoming: 'status-pending', ongoing: 'status-active', done: 'status-inactive' };
      const statusLabel = { upcoming: 'Akan Datang', ongoing: 'Berlangsung', done: 'Selesai' };
      return `<tr>
        <td>${k.photo
          ? `<img class="table-img" src="${k.photo}" alt="${k.title}"
               style="object-fit:cover;object-position:${positionToCSS(k.photoPos)};border-radius:8px;" loading="lazy"/>`
          : `<div class="table-img" style="display:flex;align-items:center;justify-content:center;background:var(--admin-bg);font-size:1.5rem;">📅</div>`}
        </td>
        <td><div class="table-title">${k.title || '-'}</div>${k.description ? `<div style="font-size:0.75rem;color:var(--admin-text-muted);margin-top:2px;">${k.description.substring(0, 60)}...</div>` : ''}</td>
        <td style="font-size:0.82rem;white-space:nowrap;">${k.date ? new Date(k.date).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'}) : '-'}</td>
        <td><span class="status-badge ${statusMap[k.status] || ''}">${statusLabel[k.status] || k.status || '-'}</span></td>
        <td><div class="action-btns">
          <button class="action-btn edit" onclick="editItem('${k.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" onclick="delItem('${k.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
        </div></td>
      </tr>`;
    }).join('');
  } catch (err) { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;">Gagal: ${err.message}</td></tr>`; }
}

function open(id = null) {
  const item = id ? items.find(i => i.id === id) : null;
  document.getElementById('modalTitle').textContent = item ? 'Edit Kegiatan' : 'Tambah Kegiatan';
  document.getElementById('itemId').value = id || '';
  document.getElementById('fTitle').value = item?.title || '';
  document.getElementById('fDesc').value = item?.description || '';
  document.getElementById('fDate').value = item?.date || '';
  document.getElementById('fStatus').value = item?.status || 'upcoming';
  document.getElementById('fPhotoUrl').value = item?.photo || '';
  document.getElementById('fPhoto').value = '';

  // Load image ke editor
  if (photoEditor) {
    if (item?.photo) {
      photoEditor.loadImage(item.photo, item.photoPos || null);
    } else {
      photoEditor.hide();
    }
  }

  document.getElementById('dataModal').classList.add('open');
}

const closeModal = () => document.getElementById('dataModal').classList.remove('open');
window.editItem = open;
window.delItem = async (id) => {
  if (!await confirmDelete('Hapus kegiatan?', '')) return;
  try { await deleteDoc(doc(db, 'kegiatan', id)); showToast('Kegiatan dihapus'); await load(); } catch (err) { showToast(err.message, 'error'); }
};

async function save() {
  const title = document.getElementById('fTitle').value.trim();
  if (!title) { showToast('Judul wajib diisi', 'error'); return; }
  const btn = document.getElementById('saveItem');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  try {
    let photo = document.getElementById('fPhotoUrl').value;
    const f = document.getElementById('fPhoto').files[0];
    if (f) {
      document.getElementById('photoProgress').style.display = '';
      photo = await uploadImageWithProgress(f, 'kegiatan', pct => { document.getElementById('photoProgressBar').style.width = pct + '%'; });
    }

    // Ambil posisi dari editor
    const photoPos = photo && photoEditor ? photoEditor.getPosition() : null;

    const id = document.getElementById('itemId').value;
    const data = {
      title,
      description: document.getElementById('fDesc').value.trim(),
      date: document.getElementById('fDate').value,
      status: document.getElementById('fStatus').value,
      photo,
      photoPos,   // { x, y, scale }
      updatedAt: serverTimestamp()
    };
    if (id) { await updateDoc(doc(db, 'kegiatan', id), data); showToast('Kegiatan diperbarui'); }
    else { data.createdAt = serverTimestamp(); await addDoc(collection(db, 'kegiatan'), data); showToast('Kegiatan ditambahkan'); }
    closeModal(); await load();
  } catch (err) { showToast(err.message, 'error'); }
  finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Simpan'; }
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('kegiatan');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Manajemen Kegiatan');
  await initAdmin('kegiatan');

  // Inisialisasi image position editor (landscape 16:9 untuk kegiatan)
  const editorContainer = document.getElementById('photoEditorContainer');
  if (editorContainer) {
    photoEditor = createImagePositionEditor(editorContainer, {
      aspectRatio: '16/9',
      shape: 'square',
    });
  }

  document.getElementById('btnAdd').onclick = () => open();
  document.getElementById('closeModal').onclick = closeModal;
  document.getElementById('cancelModal').onclick = closeModal;
  document.getElementById('saveItem').onclick = save;
  document.getElementById('dataModal').onclick = e => { if (e.target === e.currentTarget) closeModal(); };

  // Saat file dipilih → tampilkan di editor
  document.getElementById('fPhoto').onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (photoEditor) photoEditor.loadImage(ev.target.result);
    };
    reader.readAsDataURL(f);
  };

  await load();
});
