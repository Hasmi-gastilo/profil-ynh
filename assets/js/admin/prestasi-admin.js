// prestasi-admin.js
import { db } from '../firebase-init.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, confirmDelete, uploadImageWithProgress, formatDate } from './admin-app.js';
import { createImagePositionEditor, positionToCSS } from './image-position-editor.js';

let items = [];
let photoEditor = null;  // instance image position editor

async function load() {
  const tbody = document.getElementById('dataTable');
  try {
    const q = query(collection(db, 'prestasi'), orderBy('year', 'desc'));
    const snap = await getDocs(q);
    items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-trophy"></i></div><div class="empty-state-title">Belum ada data prestasi</div></div></td></tr>`;
      return;
    }
    tbody.innerHTML = items.map(p => `
      <tr>
        <td>${p.photo
          ? `<img class="table-img" src="${p.photo}" alt="${p.studentName}"
               style="border-radius:50%;object-fit:cover;object-position:${positionToCSS(p.photoPos)};"
               title="Zoom: ${p.photoPos?.scale ? Math.round(p.photoPos.scale*100)+'%' : '100%'}" />`
          : `<div class="table-img" style="display:flex;align-items:center;justify-content:center;background:var(--admin-bg);font-size:1.2rem;border-radius:50%;">🏆</div>`}
        </td>
        <td><div class="table-title">${p.title || '-'}</div></td>
        <td style="font-size:0.85rem;">${p.studentName || '-'}</td>
        <td><span class="badge badge-primary">${p.level || '-'}</span></td>
        <td style="font-size:0.85rem;">${p.year || '-'}</td>
        <td><div class="action-btns">
          <button class="action-btn edit" onclick="editItem('${p.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" onclick="delItem('${p.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
        </div></td>
      </tr>`).join('');
  } catch (err) { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--admin-text-muted);">Gagal memuat: ${err.message}</td></tr>`; }
}

function open(id = null) {
  const item = id ? items.find(i => i.id === id) : null;
  document.getElementById('modalTitle').textContent = item ? 'Edit Prestasi' : 'Tambah Prestasi';
  document.getElementById('itemId').value = id || '';
  document.getElementById('fTitle').value = item?.title || '';
  document.getElementById('fStudentName').value = item?.studentName || '';
  document.getElementById('fLevel').value = item?.level || 'kabupaten';
  document.getElementById('fYear').value = item?.year || new Date().getFullYear();
  document.getElementById('fDesc').value = item?.description || '';
  document.getElementById('fPhotoUrl').value = item?.photo || '';

  // Reset file input
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

function closeModal() { document.getElementById('dataModal').classList.remove('open'); }

window.editItem = (id) => open(id);
window.delItem = async (id) => {
  const ok = await confirmDelete('Hapus prestasi ini?', '');
  if (!ok) return;
  try { await deleteDoc(doc(db, 'prestasi', id)); showToast('Prestasi dihapus'); await load(); } catch (err) { showToast(err.message, 'error'); }
};

async function save() {
  const title = document.getElementById('fTitle').value.trim();
  const student = document.getElementById('fStudentName').value.trim();
  if (!title || !student) { showToast('Judul dan nama siswa wajib diisi', 'error'); return; }
  const btn = document.getElementById('saveItem');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  try {
    let photo = document.getElementById('fPhotoUrl').value;
    const f = document.getElementById('fPhoto').files[0];
    if (f) {
      document.getElementById('photoProgress').style.display = '';
      photo = await uploadImageWithProgress(f, 'achievements', pct => { document.getElementById('photoProgressBar').style.width = pct + '%'; });
    }

    // Ambil posisi dari editor
    const photoPos = photo && photoEditor ? photoEditor.getPosition() : null;

    const id = document.getElementById('itemId').value;
    const data = {
      title, studentName: student,
      level: document.getElementById('fLevel').value,
      year: document.getElementById('fYear').value,
      description: document.getElementById('fDesc').value.trim(),
      photo,
      photoPos,   // { x, y, scale }
      updatedAt: serverTimestamp()
    };
    if (id) { await updateDoc(doc(db, 'prestasi', id), data); showToast('Prestasi diperbarui'); }
    else { data.createdAt = serverTimestamp(); await addDoc(collection(db, 'prestasi'), data); showToast('Prestasi ditambahkan'); }
    closeModal(); await load();
  } catch (err) { showToast(err.message, 'error'); }
  finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Simpan'; }
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('prestasi');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Manajemen Prestasi');
  await initAdmin('prestasi');

  // Inisialisasi image position editor (tampilan bulat untuk foto profil prestasi)
  const editorContainer = document.getElementById('photoEditorContainer');
  if (editorContainer) {
    photoEditor = createImagePositionEditor(editorContainer, {
      aspectRatio: '1/1',
      shape: 'circle',
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
