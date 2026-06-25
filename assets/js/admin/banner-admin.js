// banner-admin.js
import { db } from '../firebase-init.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, confirmDelete, uploadImageWithProgress, deleteImageFromStorage } from './admin-app.js';

let banners = [];

// ── KOMPRES GAMBAR SEBELUM UPLOAD ──
// Otomatis resize ke max 1600px & kompres ke JPEG 85%
// Jauh lebih cepat dan hemat bandwidth
async function compressImage(file, maxWidth = 1600, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      // Scale down jika lebih besar dari maxWidth
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })),
        'image/jpeg',
        quality
      );
    };
    img.src = url;
  });
}

async function loadBanners() {
  const list = document.getElementById('bannerList');
  const count = document.getElementById('bannerCount');
  try {
    const q = query(collection(db, 'banners'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    banners = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    count.textContent = `${banners.length} banner`;
    renderBanners();
  } catch (err) {
    list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--admin-text-muted);">Gagal memuat banner: ${err.message}</div>`;
  }
}

function renderBanners() {
  const list = document.getElementById('bannerList');
  if (!banners.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon"><i class="fas fa-image"></i></div><div class="empty-state-title">Belum ada banner</div><div class="empty-state-desc">Tambahkan banner untuk ditampilkan di slider halaman utama.</div></div>`;
    return;
  }
  list.innerHTML = banners.map(b => `
    <div class="banner-card-item">
      <div class="banner-card-thumb">
        ${b.imageUrl
          ? `<img src="${b.imageUrl}" alt="${b.title}" loading="lazy"/>`
          : `<div class="banner-card-thumb-placeholder"><i class="fas fa-image"></i></div>`
        }
        <div class="banner-card-order">Urutan ${b.order || 1}</div>
      </div>
      <div class="banner-card-body">
        <div class="banner-card-info">
          <div class="banner-card-title">${b.title || '-'}</div>
          ${b.subtitle ? `<div class="banner-card-subtitle">${b.subtitle}</div>` : ''}
          <span class="status-badge ${b.active !== false ? 'status-active' : 'status-inactive'}" style="margin-top:8px;display:inline-flex;">
            ${b.active !== false ? '● Aktif' : '● Nonaktif'}
          </span>
        </div>
        <div class="banner-card-actions">
          <button class="action-btn edit" onclick="editBanner('${b.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" onclick="deleteBanner('${b.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}


function openModal(bannerId = null) {
  const banner = bannerId ? banners.find(b => b.id === bannerId) : null;
  document.getElementById('bannerModalTitle').textContent = banner ? 'Edit Banner' : 'Tambah Banner';
  document.getElementById('bannerId').value = bannerId || '';
  document.getElementById('bannerTitle').value = banner?.title || '';
  document.getElementById('bannerSubtitle').value = banner?.subtitle || '';
  document.getElementById('bannerBtnText').value = banner?.buttonText || '';
  document.getElementById('bannerBtnUrl').value = banner?.buttonUrl || '';
  document.getElementById('bannerOrder').value = banner?.order || banners.length + 1;
  document.getElementById('bannerActive').value = banner?.active !== false ? 'true' : 'false';
  document.getElementById('bannerTitleSize').value = banner?.titleSize || 'medium';
  document.getElementById('bannerSubtitleSize').value = banner?.subtitleSize || 'medium';
  document.getElementById('bannerImageUrl').value = banner?.imageUrl || '';
  const prev = document.getElementById('bannerPreviewImg');
  if (banner?.imageUrl) { prev.src = banner.imageUrl; prev.style.display = ''; } else { prev.style.display = 'none'; }
  document.getElementById('bannerProgress').style.display = 'none';
  document.getElementById('bannerModal').classList.add('open');
}


function closeModal() { document.getElementById('bannerModal').classList.remove('open'); }

window.editBanner = (id) => openModal(id);

window.deleteBanner = async (id) => {
  const ok = await confirmDelete('Hapus banner ini?', 'Banner akan dihapus dari slider homepage.');
  if (!ok) return;
  try {
    const banner = banners.find(b => b.id === id);
    await deleteDoc(doc(db, 'banners', id));
    if (banner?.imageUrl) await deleteImageFromStorage(banner.imageUrl);
    showToast('Banner berhasil dihapus');
    await loadBanners();
  } catch (err) { showToast('Gagal menghapus: ' + err.message, 'error'); }
};

async function saveBanner() {
  const id = document.getElementById('bannerId').value;
  const title = document.getElementById('bannerTitle').value.trim();
  if (!title) { showToast('Judul tidak boleh kosong', 'error'); return; }

  const btn = document.getElementById('saveBanner');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

  try {
    // Handle image upload dengan kompresi otomatis
    let imageUrl = document.getElementById('bannerImageUrl').value;
    const file = document.getElementById('bannerImage').files[0];
    if (file) {
      const progressEl = document.getElementById('bannerProgress');
      const progressBar = document.getElementById('bannerProgressBar');
      const progressLabel = document.getElementById('bannerProgressLabel');
      progressEl.style.display = '';
      progressLabel.textContent = 'Mengompres gambar...';
      progressBar.style.width = '10%';

      // Kompres gambar dulu (lebih kecil = lebih cepat upload)
      const compressed = await compressImage(file);
      const origSize = (file.size / 1024).toFixed(0);
      const newSize  = (compressed.size / 1024).toFixed(0);
      progressLabel.textContent = `Dikompres: ${origSize}KB → ${newSize}KB. Mengunggah...`;
      progressBar.style.width = '30%';

      imageUrl = await uploadImageWithProgress(compressed, 'banner', (pct) => {
        // Progress 30-100%
        progressBar.style.width = (30 + Math.round(pct * 0.7)) + '%';
      });
      progressLabel.textContent = 'Upload selesai!';
    }

    const data = {
      title,
      subtitle:     document.getElementById('bannerSubtitle').value.trim(),
      buttonText:   document.getElementById('bannerBtnText').value.trim(),
      buttonUrl:    document.getElementById('bannerBtnUrl').value.trim(),
      order:        parseInt(document.getElementById('bannerOrder').value) || 1,
      active:       document.getElementById('bannerActive').value === 'true',
      titleSize:    document.getElementById('bannerTitleSize').value || 'medium',
      subtitleSize: document.getElementById('bannerSubtitleSize').value || 'medium',
      imageUrl,
      updatedAt:    serverTimestamp(),
    };

    if (id) {
      await updateDoc(doc(db, 'banners', id), data);
      showToast('Banner berhasil diperbarui');
    } else {
      data.createdAt = serverTimestamp();
      await addDoc(collection(db, 'banners'), data);
      showToast('Banner berhasil ditambahkan');
    }
    closeModal();
    await loadBanners();
  } catch (err) {
    showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Simpan Banner';
  }
}


// Image preview
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('banner');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Banner Homepage');
  await initAdmin('banner');

  document.getElementById('btnAddBanner').addEventListener('click', () => openModal());
  document.getElementById('closeBannerModal').addEventListener('click', closeModal);
  document.getElementById('cancelBanner').addEventListener('click', closeModal);
  document.getElementById('saveBanner').addEventListener('click', saveBanner);
  document.getElementById('bannerModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

  document.getElementById('bannerImage').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const prev = document.getElementById('bannerPreviewImg');
        prev.src = ev.target.result;
        prev.style.display = '';
      };
      reader.readAsDataURL(file);
    }
  });

  await loadBanners();
});
