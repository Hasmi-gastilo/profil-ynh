// dashboard.js
import { db } from '../firebase-init.js';
import { collection, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, formatDate } from './admin-app.js';

async function loadStats() {
  const cols = ['berita', 'galeri', 'prestasi', 'kegiatan'];
  const ids  = ['statBerita', 'statGaleri', 'statPrestasi', 'statKegiatan'];
  await Promise.allSettled(cols.map(async (col, i) => {
    try {
      const snap = await getDocs(collection(db, col));
      document.getElementById(ids[i]).textContent = snap.size;
    } catch { document.getElementById(ids[i]).textContent = '0'; }
  }));
}

async function loadRecentPosts() {
  const tbody = document.getElementById('recentPostsTable');
  try {
    const q = query(collection(db, 'berita'), orderBy('createdAt', 'desc'), limit(5));
    const snap = await getDocs(q);
    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--admin-text-muted);">Belum ada berita.</td></tr>`;
      return;
    }
    tbody.innerHTML = snap.docs.map(d => {
      const data = d.data();
      return `
        <tr>
          <td><div class="table-title">${data.title || '-'}</div></td>
          <td><span class="badge badge-primary">${data.category || '-'}</span></td>
          <td><span class="status-badge ${data.status === 'published' ? 'status-published' : 'status-draft'}">${data.status === 'published' ? 'Diterbitkan' : 'Draft'}</span></td>
          <td style="white-space:nowrap;font-size:0.8rem;">${formatDate(data.createdAt)}</td>
        </tr>`;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--admin-text-muted);">Gagal memuat data.</td></tr>`;
  }
}

async function init() {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('dashboard');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Dashboard');
  await initAdmin('dashboard');
  await Promise.allSettled([loadStats(), loadRecentPosts()]);
}

document.addEventListener('DOMContentLoaded', init);
