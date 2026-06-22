// prestasi.js
import { db } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initApp } from './app.js';

let allPrestasi = [];
let currentLevel = 'all';

const levelColors = {
  internasional: '#7C3AED', nasional: '#DC2626', provinsi: '#D97706', kabupaten: '#1B4F8A', kecamatan: '#16A34A'
};

async function loadPrestasi() {
  try {
    const q = query(collection(db, 'prestasi'), orderBy('year', 'desc'));
    const snap = await getDocs(q);
    allPrestasi = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderPrestasi();
  } catch (err) {
    console.warn('Prestasi load error:', err.message);
    document.getElementById('prestasiGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Gagal memuat data.</div>`;
  }
}

function renderPrestasi() {
  const grid = document.getElementById('prestasiGrid');
  const empty = document.getElementById('emptyPrestasi');
  const filtered = currentLevel === 'all' ? allPrestasi : allPrestasi.filter(p => p.level?.toLowerCase() === currentLevel);
  if (!filtered.length) {
    grid.innerHTML = '';
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = filtered.map(p => {
    const level = (p.level || '').toLowerCase();
    const color = levelColors[level] || '#1B4F8A';
    return `
      <div class="achievement-card fade-in">
        ${p.photo ? `<img class="achievement-medal" src="${p.photo}" alt="${p.studentName}" loading="lazy"/>` : `<div class="achievement-medal-placeholder">🏆</div>`}
        <div class="achievement-title">${p.title}</div>
        <div class="achievement-name">${p.studentName || ''}</div>
        ${p.description ? `<p style="font-size:0.78rem;color:var(--text-muted);margin:6px 0;line-height:1.5;">${p.description}</p>` : ''}
        <span class="achievement-badge" style="background:${color}15;color:${color};">
          ${p.level || ''} &bull; ${p.year || ''}
        </span>
      </div>`;
  }).join('');
  document.querySelectorAll('.fade-in').forEach(el => setTimeout(() => el.classList.add('visible'), 50));
}

async function init() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  await initApp();

  document.querySelectorAll('#levelFilter .gallery-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLevel = btn.dataset.level;
      document.querySelectorAll('#levelFilter .gallery-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPrestasi();
    });
  });

  await loadPrestasi();
}

document.addEventListener('DOMContentLoaded', init);
