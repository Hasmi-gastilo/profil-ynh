// kontak.js
import { db } from './firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initApp } from './app.js';

async function loadKontak() {
  try {
    const snap = await getDoc(doc(db, 'kontak', 'info'));
    if (!snap.exists()) return;
    const d = snap.data();

    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    const setHref = (id, href, val) => {
      const el = document.getElementById(id);
      if (el && val) { el.href = href; el.textContent = val; }
    };

    set('contactAddress', d.address);
    // Fix Phone and Email
    setHref('contactPhone', `tel:${(d.phone || '').replace(/\D/g, '')}`, d.phone);
    setHref('contactEmail', `mailto:${d.email || ''}`, d.email);

    if (d.whatsapp) {
      let phone = d.whatsapp.replace(/\D/g, '');
      if (phone.startsWith('0')) phone = '62' + phone.substring(1);
      const waEl = document.getElementById('contactWa');
      if (waEl) { waEl.href = `https://wa.me/${phone}`; waEl.textContent = d.whatsapp; }
      const waBtn = document.getElementById('contactWaBtn');
      if (waBtn) { waBtn.href = `https://wa.me/${phone}`; }
    }

    // Fix Maps: jika input berupa <iframe> maka langsung render,
    // Jika berupa link/URL atau kosong, generate map dari alamat
    const wrapper = document.getElementById('mapsWrapper');
    if (wrapper) {
      let embedHtml = '';
      if (d.googleMapsEmbed && d.googleMapsEmbed.includes('<iframe')) {
        embedHtml = d.googleMapsEmbed;
      } else {
        const q = encodeURIComponent(d.address || 'LPI Nurul Huda Kapedi Sumenep');
        embedHtml = `<iframe src="https://maps.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="400" style="border:0;border-radius:12px;" allowfullscreen="" loading="lazy"></iframe>`;
      }

      // Jika yang dimasukkan admin adalah URL maps (https://...), tambahkan tombol buka maps
      if (d.googleMapsEmbed && d.googleMapsEmbed.startsWith('http') && !d.googleMapsEmbed.includes('<iframe')) {
        embedHtml += `<div style="text-align:center; margin-top: 16px;"><a href="${d.googleMapsEmbed}" target="_blank" class="btn btn-outline"><i class="fas fa-external-link-alt"></i> Buka di Google Maps</a></div>`;
      }

      wrapper.innerHTML = embedHtml;
    }
  } catch (err) { console.warn('Kontak load error:', err.message); }
}

async function init() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  await initApp();
  await loadKontak();
}

document.addEventListener('DOMContentLoaded', init);
