// faq.js
import { db } from './firebase-init.js';
import { collection, getDocs, query, orderBy, doc, getDoc }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initApp } from './app.js';

let allFaqs = [];

async function loadFaq() {
  try {
    const q = query(collection(db, 'faq'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    allFaqs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderFaq(allFaqs);
  } catch (err) {
    console.warn('FAQ load error:', err.message);
    document.getElementById('faqContainer').innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">Gagal memuat FAQ.</p>';
  }
}

function renderFaq(faqs) {
  const container = document.getElementById('faqContainer');
  const empty = document.getElementById('emptyFaq');
  if (!faqs.length) {
    container.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';
  container.innerHTML = faqs.map(f => `
    <div class="faq-item" data-faq>
      <div class="faq-question" tabindex="0" role="button" aria-expanded="false">
        <span>${f.question}</span>
        <span class="faq-icon"><i class="fas fa-chevron-down"></i></span>
      </div>
      <div class="faq-answer">
        <div class="faq-answer-inner">${f.answer}</div>
      </div>
    </div>
  `).join('');

  // Accordion
  container.querySelectorAll('[data-faq]').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      container.querySelectorAll('[data-faq]').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-question').setAttribute('aria-expanded', 'false'); });
      if (!isOpen) { item.classList.add('open'); question.setAttribute('aria-expanded', 'true'); }
    });
    question.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); question.click(); } });
  });
}

async function loadWhatsApp() {
  try {
    const snap = await getDoc(doc(db, 'kontak', 'info'));
    if (snap.exists() && snap.data().whatsapp) {
      const phone = snap.data().whatsapp.replace(/\D/g, '');
      document.getElementById('faqWaBtn').href = `https://wa.me/${phone}?text=Assalamu%27alaikum%2C%20saya%20ingin%20bertanya...`;
    }
  } catch {}
}

async function init() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  await initApp();

  document.getElementById('faqSearch')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = allFaqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    renderFaq(filtered);
  });

  await Promise.allSettled([loadFaq(), loadWhatsApp()]);
}

document.addEventListener('DOMContentLoaded', init);
