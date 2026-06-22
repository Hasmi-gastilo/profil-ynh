// faq-admin.js
import { db } from '../firebase-init.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, confirmDelete } from './admin-app.js';

let items = [];

async function load() {
  const list = document.getElementById('faqList');
  try {
    const q = query(collection(db, 'faq'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!items.length) {
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon"><i class="fas fa-question-circle"></i></div><div class="empty-state-title">Belum ada FAQ</div></div>`;
      return;
    }
    list.innerHTML = items.map(f => `
      <div style="display:flex;gap:16px;padding:16px;background:var(--admin-bg);border-radius:12px;border:1px solid var(--admin-border);">
        <div style="width:28px;height:28px;background:var(--admin-primary);color:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.8rem;flex-shrink:0;">${f.order || '?'}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">${f.question}</div>
          <div style="font-size:0.8rem;color:var(--admin-text-muted);">${f.answer?.substring(0, 100)}...</div>
        </div>
        <div class="action-btns">
          <button class="action-btn edit" onclick="editFaq('${f.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" onclick="delFaq('${f.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
        </div>
      </div>`).join('');
  } catch (err) { list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--admin-text-muted);">Gagal: ${err.message}</div>`; }
}

function open(id = null) {
  const item = id ? items.find(i => i.id === id) : null;
  document.getElementById('modalTitle').textContent = item ? 'Edit FAQ' : 'Tambah FAQ';
  document.getElementById('faqId').value = id || '';
  document.getElementById('fQuestion').value = item?.question || '';
  document.getElementById('fAnswer').value = item?.answer || '';
  document.getElementById('fOrder').value = item?.order || items.length + 1;
  document.getElementById('faqModal').classList.add('open');
}

const closeModal = () => document.getElementById('faqModal').classList.remove('open');
window.editFaq = open;
window.delFaq = async (id) => {
  if (!await confirmDelete('Hapus FAQ ini?','')) return;
  try { await deleteDoc(doc(db,'faq',id)); showToast('FAQ dihapus'); await load(); } catch(err) { showToast(err.message,'error'); }
};

async function save() {
  const q = document.getElementById('fQuestion').value.trim();
  const a = document.getElementById('fAnswer').value.trim();
  if (!q || !a) { showToast('Pertanyaan dan jawaban wajib diisi','error'); return; }
  const btn = document.getElementById('saveFaq'); btn.disabled = true;
  try {
    const id = document.getElementById('faqId').value;
    const data = { question:q, answer:a, order:parseInt(document.getElementById('fOrder').value)||1, updatedAt:serverTimestamp() };
    if (id) { await updateDoc(doc(db,'faq',id),data); showToast('FAQ diperbarui'); }
    else { data.createdAt=serverTimestamp(); await addDoc(collection(db,'faq'),data); showToast('FAQ ditambahkan'); }
    closeModal(); await load();
  } catch(err) { showToast(err.message,'error'); }
  finally { btn.disabled=false; }
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('faq');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Manajemen FAQ');
  await initAdmin('faq');
  document.getElementById('btnAdd').onclick = () => open();
  document.getElementById('closeModal').onclick = closeModal;
  document.getElementById('cancelModal').onclick = closeModal;
  document.getElementById('saveFaq').onclick = save;
  document.getElementById('faqModal').onclick = e => { if (e.target===e.currentTarget) closeModal(); };
  await load();
});
