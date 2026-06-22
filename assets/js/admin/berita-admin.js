// berita-admin.js — Handles both berita.html (list) and berita-form.html (editor)
import { db } from '../firebase-init.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, orderBy, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, confirmDelete, uploadImageWithProgress, slugify, formatDate } from './admin-app.js';

// ── LIST PAGE ──────────────────────────────────────────────
async function initListPage() {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('berita');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Manajemen Berita');
  await initAdmin('berita');
  await loadBeritaList();

  document.getElementById('searchBerita').addEventListener('input', filterTable);
  document.getElementById('filterStatus').addEventListener('change', filterTable);
}

let allBerita = [];

async function loadBeritaList() {
  const tbody = document.getElementById('beritaTable');
  try {
    const q = query(collection(db, 'berita'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    allBerita = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderTable(allBerita);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--admin-text-muted);">Gagal memuat: ${err.message}</td></tr>`;
  }
}

function renderTable(items) {
  const tbody = document.getElementById('beritaTable');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-newspaper"></i></div><div class="empty-state-title">Belum ada berita</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(a => `
    <tr>
      <td><img class="table-img" src="${a.thumbnail || 'https://via.placeholder.com/48?text=NH'}" alt="${a.title}" loading="lazy"/></td>
      <td><div class="table-title">${a.title || '-'}</div></td>
      <td><span class="badge badge-primary">${a.category || '-'}</span></td>
      <td style="font-size:0.82rem;">${a.author || '-'}</td>
      <td><span class="status-badge ${a.status === 'published' ? 'status-published' : 'status-draft'}">${a.status === 'published' ? 'Diterbitkan' : 'Draft'}</span></td>
      <td style="font-size:0.78rem;white-space:nowrap;">${formatDate(a.createdAt)}</td>
      <td>
        <div class="action-btns">
          <a href="berita-form.html?id=${a.id}" class="action-btn edit" title="Edit"><i class="fas fa-edit"></i></a>
          <a href="../berita-detail.html?slug=${a.slug || a.id}" target="_blank" class="action-btn view" title="Lihat"><i class="fas fa-eye"></i></a>
          <button class="action-btn delete" onclick="deleteBerita('${a.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function filterTable() {
  const search = document.getElementById('searchBerita').value.toLowerCase();
  const status = document.getElementById('filterStatus').value;
  let filtered = allBerita;
  if (search) filtered = filtered.filter(a => a.title?.toLowerCase().includes(search) || a.author?.toLowerCase().includes(search));
  if (status !== 'all') filtered = filtered.filter(a => a.status === status);
  renderTable(filtered);
}

window.deleteBerita = async (id) => {
  const ok = await confirmDelete('Hapus artikel ini?', 'Artikel akan dihapus secara permanen.');
  if (!ok) return;
  try {
    await deleteDoc(doc(db, 'berita', id));
    showToast('Artikel berhasil dihapus');
    await loadBeritaList();
  } catch (err) { showToast('Gagal menghapus: ' + err.message, 'error'); }
};

// ── FORM PAGE ──────────────────────────────────────────────
let quill = null;

async function initFormPage() {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('berita');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Editor Berita');
  await initAdmin('berita');

  // Init Quill
  quill = new Quill('#quillEditor', {
    theme: 'snow',
    modules: { toolbar: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ align: [] }],
      ['clean']
    ]}
  });

  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('beritaTanggal').value = today;

  // Auto slug
  document.getElementById('beritaJudul').addEventListener('input', e => {
    const slug = slugify(e.target.value);
    document.getElementById('beritaSlug').value = slug;
    document.getElementById('slugPreview').textContent = slug;
  });

  // Edit slug toggle
  document.getElementById('editSlug').addEventListener('click', () => {
    const input = document.getElementById('beritaSlug');
    input.readOnly = !input.readOnly;
    input.style.background = input.readOnly ? 'var(--admin-bg)' : '';
    document.getElementById('editSlug').textContent = input.readOnly ? 'Edit' : 'Kunci';
  });

  // Thumbnail
  document.getElementById('thumbnailFile').addEventListener('change', e => {
    const f = e.target.files[0];
    if (f) { const r = new FileReader(); r.onload = ev => { const p = document.getElementById('thumbnailPreview'); p.src = ev.target.result; p.style.display = ''; }; r.readAsDataURL(f); }
  });

  // Buttons
  document.getElementById('saveDraft').addEventListener('click', () => saveBerita('draft'));
  document.getElementById('publishBtn').addEventListener('click', () => saveBerita('published'));

  // Load existing article if editing
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');
  if (editId) await loadArticleForEdit(editId);
}

async function loadArticleForEdit(id) {
  try {
    const snap = await getDoc(doc(db, 'berita', id));
    if (!snap.exists()) { showToast('Artikel tidak ditemukan', 'error'); return; }
    const d = snap.data();

    document.getElementById('formPageTitle').textContent = 'Edit Berita';
    document.getElementById('formTitle').textContent = 'Edit Berita';
    document.getElementById('beritaJudul').value = d.title || '';
    document.getElementById('beritaSlug').value = d.slug || '';
    document.getElementById('slugPreview').textContent = d.slug || '';
    document.getElementById('beritaExcerpt').value = d.excerpt || '';
    document.getElementById('beritaKategori').value = d.category || '';
    document.getElementById('beritaPenulis').value = d.author || '';
    document.getElementById('beritaTags').value = (d.tags || []).join(', ');
    document.getElementById('beritaStatus').value = d.status || 'draft';
    document.getElementById('thumbnailUrl').value = d.thumbnail || '';

    if (d.publishDate?.toDate) {
      document.getElementById('beritaTanggal').value = d.publishDate.toDate().toISOString().split('T')[0];
    }
    if (d.thumbnail) {
      const p = document.getElementById('thumbnailPreview');
      p.src = d.thumbnail; p.style.display = '';
    }
    if (quill && d.content) quill.root.innerHTML = d.content;

    // Store id for update
    document.getElementById('saveDraft').dataset.editId = id;
    document.getElementById('publishBtn').dataset.editId = id;
  } catch (err) { showToast('Gagal memuat artikel: ' + err.message, 'error'); }
}

async function saveBerita(status) {
  const title = document.getElementById('beritaJudul').value.trim();
  if (!title) { showToast('Judul tidak boleh kosong', 'error'); return; }

  const btn = status === 'published' ? document.getElementById('publishBtn') : document.getElementById('saveDraft');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

  try {
    let thumbnail = document.getElementById('thumbnailUrl').value;
    const thumbFile = document.getElementById('thumbnailFile').files[0];
    if (thumbFile) {
      document.getElementById('thumbProgress').style.display = '';
      thumbnail = await uploadImageWithProgress(thumbFile, 'news', pct => {
        document.getElementById('thumbProgressBar').style.width = pct + '%';
      });
    }

    const tags = document.getElementById('beritaTags').value.split(',').map(t => t.trim()).filter(Boolean);
    const pubDate = document.getElementById('beritaTanggal').value;

    const data = {
      title,
      slug: document.getElementById('beritaSlug').value.trim() || slugify(title),
      excerpt: document.getElementById('beritaExcerpt').value.trim(),
      content: quill?.root.innerHTML || '',
      category: document.getElementById('beritaKategori').value.trim(),
      author: document.getElementById('beritaPenulis').value.trim(),
      tags,
      status,
      thumbnail,
      publishDate: pubDate ? new Date(pubDate) : new Date(),
      updatedAt: serverTimestamp(),
    };

    const editId = btn.dataset.editId;
    if (editId) {
      await updateDoc(doc(db, 'berita', editId), data);
      showToast('Artikel berhasil diperbarui!');
    } else {
      data.createdAt = serverTimestamp();
      const ref = await addDoc(collection(db, 'berita'), data);
      // Update edit buttons with new id
      document.getElementById('saveDraft').dataset.editId = ref.id;
      document.getElementById('publishBtn').dataset.editId = ref.id;
      showToast(status === 'published' ? 'Artikel berhasil diterbitkan!' : 'Draft disimpan!');
    }
  } catch (err) {
    showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = status === 'published' ? '<i class="fas fa-paper-plane"></i> Terbitkan' : '<i class="fas fa-file"></i> Simpan Draft';
  }
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('beritaTable')) {
    initListPage();
  } else if (document.getElementById('quillEditor')) {
    initFormPage();
  }
});
