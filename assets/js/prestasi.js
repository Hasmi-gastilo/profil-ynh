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
    const levelLabel = (p.level || '').toUpperCase();
    const levelIcons = {
      'internasional': '<i class="fas fa-globe"></i>',
      'nasional':      '<i class="fas fa-flag"></i>',
      'provinsi':      '<i class="fas fa-map-marker-alt"></i>',
      'kabupaten':     '<i class="fas fa-city"></i>',
      'kecamatan':     '<i class="fas fa-home"></i>',
    };
    const icon = levelIcons[level] || '<i class="fas fa-trophy"></i>';

    // Terapkan zoom & posisi foto persis seperti editor admin
    let photoStyle = 'width:100%;height:100%;object-fit:cover;display:block;';
    if (p.photo && p.photoPos) {
      const x = p.photoPos.x ?? 50;
      const y = p.photoPos.y ?? 50;
      const s = p.photoPos.scale ?? 1;
      photoStyle = `position:absolute;left:${x}%;top:${y}%;width:auto;height:auto;min-width:100%;min-height:100%;max-width:none;transform:translate(-50%,-50%) scale(${s});`;
    }

    return `
      <div class="achievement-card fade-in">
        <div class="achievement-header">
          <div class="achievement-icon-box">${icon}</div>
          <span class="achievement-badge" style="background:${color}18;color:${color};">
            ${levelLabel}${p.year ? ' &bull; ' + p.year : ''}
          </span>
        </div>
        <div class="achievement-title">${p.title}</div>
        <div class="achievement-name">Oleh: ${p.studentName || '-'}</div>
        ${p.description ? `<p class="achievement-desc">${p.description}</p>` : ''}
        ${p.photo ? `<div class="achievement-photo-wrap"><img class="achievement-photo" src="${p.photo}" alt="${p.studentName || 'Prestasi'}" loading="lazy" style="${photoStyle}" /></div>` : ''}
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
