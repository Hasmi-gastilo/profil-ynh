// api/rag.js — Dual-Core Retrieval-Augmented Generation (RAG) Engine
// Yayasan Pendidikan Islam Nurul Huda Kapedi

const fs = require('fs');
const path = require('path');

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/profil-nh/databases/(default)/documents';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit

let cachedKnowledgeBase = null;
let lastCacheSync = 0;

// Load static base knowledge
function loadStaticKnowledge() {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'knowledge-base.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[RAG] Warning loading knowledge-base.json:', err.message);
  }
  return { institution: {}, documents: [] };
}

// Strip HTML tags for clean plain text
function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper to safely parse Firestore values
function parseFirestoreDoc(fields) {
  if (!fields) return {};
  const result = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== undefined) result[key] = val.stringValue;
    else if (val.integerValue !== undefined) result[key] = parseInt(val.integerValue, 10);
    else if (val.doubleValue !== undefined) result[key] = parseFloat(val.doubleValue);
    else if (val.booleanValue !== undefined) result[key] = val.booleanValue;
    else if (val.timestampValue !== undefined) result[key] = val.timestampValue;
  }
  return result;
}

// Fetch dynamic updates from Firebase Firestore public collections
async function syncFromFirebase(baseKnowledge) {
  const docs = [...baseKnowledge.documents];

  try {
    const beritaRes = await fetch(`${FIRESTORE_BASE}/berita`, { signal: AbortSignal.timeout(3500) });
    if (beritaRes.ok) {
      const data = await beritaRes.json();
      if (Array.isArray(data.documents)) {
        for (const item of data.documents) {
          const parsed = parseFirestoreDoc(item.fields);
          if (parsed.status === 'published' && parsed.title) {
            docs.push({
              id: `berita-${item.name.split('/').pop()}`,
              category: 'berita',
              title: `Berita: ${parsed.title}`,
              keywords: ['berita', 'kegiatan', 'kabar', ...(parsed.title.toLowerCase().split(/\s+/))],
              content: `Berita LPI Nurul Huda: ${parsed.title}. Penulis: ${parsed.author || 'Admin'}. Ringkasan: ${parsed.excerpt || stripHtml(parsed.content)}`
            });
          }
        }
      }
    }
  } catch (e) {}

  try {
    const prestasiRes = await fetch(`${FIRESTORE_BASE}/prestasi`, { signal: AbortSignal.timeout(3500) });
    if (prestasiRes.ok) {
      const data = await prestasiRes.json();
      if (Array.isArray(data.documents)) {
        for (const item of data.documents) {
          const parsed = parseFirestoreDoc(item.fields);
          if (parsed.title) {
            docs.push({
              id: `prestasi-${item.name.split('/').pop()}`,
              category: 'prestasi',
              title: `Prestasi: ${parsed.title}`,
              keywords: ['prestasi', 'juara', 'lomba', parsed.year || '', parsed.level || ''],
              content: `Prestasi: ${parsed.title}. Siswa: ${parsed.studentName || '-'}. Tingkat: ${parsed.level || '-'}. Tahun: ${parsed.year || '-'}. Keterangan: ${parsed.description || ''}`
            });
          }
        }
      }
    }
  } catch (e) {}

  try {
    const faqRes = await fetch(`${FIRESTORE_BASE}/faq`, { signal: AbortSignal.timeout(3500) });
    if (faqRes.ok) {
      const data = await faqRes.json();
      if (Array.isArray(data.documents)) {
        for (const item of data.documents) {
          const parsed = parseFirestoreDoc(item.fields);
          if (parsed.question && parsed.answer) {
            docs.push({
              id: `faq-${item.name.split('/').pop()}`,
              category: 'faq',
              title: `FAQ: ${parsed.question}`,
              keywords: ['faq', 'tanya', ...(parsed.question.toLowerCase().split(/\s+/))],
              content: `Pertanyaan: ${parsed.question}\nJawaban: ${stripHtml(parsed.answer)}`
            });
          }
        }
      }
    }
  } catch (e) {}

  return {
    ...baseKnowledge,
    documents: docs
  };
}

// Get or refresh Knowledge Base with caching
async function getKnowledgeBase() {
  const now = Date.now();
  if (cachedKnowledgeBase && (now - lastCacheSync < CACHE_TTL_MS)) {
    return cachedKnowledgeBase;
  }

  const base = loadStaticKnowledge();
  try {
    cachedKnowledgeBase = await syncFromFirebase(base);
  } catch (err) {
    cachedKnowledgeBase = base;
  }
  lastCacheSync = now;
  return cachedKnowledgeBase;
}

// Indonesian Stop Words
const STOP_WORDS = new Set([
  'yang', 'di', 'ke', 'dari', 'ini', 'itu', 'untuk', 'pada', 'adalah', 'dan', 'atau',
  'dengan', 'oleh', 'karena', 'maka', 'dalam', 'tentang', 'bisa', 'dapat', 'saya',
  'kami', 'anda', 'mereka', 'dia', 'kita', 'apa', 'apakah', 'siapa', 'bagaimana',
  'kapan', 'dimana', 'kenapa', 'mengapa', 'berapa', 'tolong', 'mohon', 'halo', 'hai'
]);

function tokenize(text) {
  if (!text) return [];
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

// Classify query intent: INSTITUTIONAL, HYBRID, or GENERAL_KNOWLEDGE
function detectIntent(rawQuery) {
  const q = rawQuery.toLowerCase();

  const institutionalTerms = [
    'nurul huda', 'kapedi', 'lpi', 'bluto', 'sasar', 'minhaji',
    'ppdb', 'spmb', 'pendaftaran siswa', 'daftar siswa', 'daftar santri',
    'sdi nurul huda', 'smpi nurul huda', 'smk nurul huda', 'tk islam', 'paud nurul huda',
    'agribisnis ternak', 'zakiya', 'isyatul', 'awg', 'waterflow',
    'biaya pendaftaran', 'syarat pendaftaran', 'jadwal pendaftaran'
  ];

  const hasInstitutionalTerm = institutionalTerms.some(term => q.includes(term));

  if (hasInstitutionalTerm) {
    return 'INSTITUTIONAL';
  }

  // General school queries (could be institutional if in context)
  if (/\b(sekolah ini|yayasan ini|disini|di sini|kantor sekretariat|kontak wa|alamat sekolah)\b/i.test(q)) {
    return 'INSTITUTIONAL';
  }

  // Check if purely general knowledge
  const generalTopicTerms = [
    'apa itu', 'jelaskan', 'bagaimana cara', 'tips', 'sejarah dunia', 'hukum islam',
    'rukun', 'shalat', 'sholat', 'puasa', 'zakat', 'wudhu', 'hadits', 'al-qur\'an',
    'tahfidz', 'belajar', 'teknologi', 'coding', 'pemrograman', 'ai', 'artificial intelligence',
    'fotosintesis', 'sains', 'matematika', 'fisika', 'kimia', 'esai', 'karya ilmiah'
  ];

  if (generalTopicTerms.some(term => q.includes(term))) {
    return 'GENERAL_KNOWLEDGE';
  }

  return 'HYBRID';
}

// Retrieve relevant documents using lexical & semantic keyword matching (RAG Retriever)
async function retrieveRelevantChunks(query, topK = 4) {
  const kb = await getKnowledgeBase();
  const queryTokens = tokenize(query);
  const rawQuery = query.toLowerCase().trim();
  const intent = detectIntent(rawQuery);

  if (queryTokens.length === 0) {
    return {
      chunks: kb.documents.slice(0, 3),
      intent: 'GENERAL_KNOWLEDGE',
      maxScore: 0,
      institution: kb.institution
    };
  }

  const scoredDocs = kb.documents.map(doc => {
    let score = 0;
    const docTokens = new Set([
      ...tokenize(doc.title),
      ...tokenize(doc.content),
      ...(doc.keywords || []).map(k => k.toLowerCase())
    ]);

    // Exact phrase match in content or title
    if (doc.title.toLowerCase().includes(rawQuery)) score += 15;
    if (doc.content.toLowerCase().includes(rawQuery)) score += 10;

    // Token overlap scoring
    for (const token of queryTokens) {
      if (doc.title.toLowerCase().includes(token)) score += 6;
      if (doc.keywords && doc.keywords.some(k => k.toLowerCase().includes(token))) score += 5;
      if (docTokens.has(token)) score += 3;
      else if (doc.content.toLowerCase().includes(token)) score += 1.5;
    }

    // Category boost
    if (/\b(ppdb|spmb|pendaftaran siswa|pendaftaran murid|daftar santri)\b/i.test(rawQuery) ||
        (/\b(biaya|spp|tarif|uang masuk|formulir|brosur|syarat|persyaratan)\b/i.test(rawQuery) &&
         /\b(sekolah|pendidikan|masuk|sdi|smpi|smk|tk|paud|santri|murid|siswa|daftar)\b/i.test(rawQuery) &&
         !/\b(helikopter|pesawat|mobil|motor|hotel|sewa|kapal|golf)\b/i.test(rawQuery))) {
      if (doc.category === 'ppdb') score += 14;
    }
    if (/\b(unit pendidikan|jenjang pendidikan|tingkat pendidikan|jurusan|kejuruan|agribisnis)\b/i.test(rawQuery)) {
      if (doc.category === 'unit') score += 14;
      else if (doc.category === 'ppdb') score += 6;
    }
    if (/\b(visi|misi|tujuan|sejarah|berdiri|pendiri|pimpinan|ketua yayasan|kepala)\b/i.test(rawQuery)) {
      if (doc.category === 'visi-misi' || doc.category === 'profil') score += 14;
    }
    if (/\b(kontak|alamat|lokasi|nomor wa|nomor telepon|email resmi|google maps|peta)\b/i.test(rawQuery)) {
      if (doc.category === 'kontak') score += 14;
    }
    if (/\b(prestasi|juara|lomba|penghargaan|esai|unisma|awg|waterflow)\b/i.test(rawQuery)) {
      if (doc.category === 'prestasi') score += 14;
    }
    if (/\b(fasilitas|gedung|lab|laboratorium|masjid|asrama|mondok|pondok|pesantren|perpustakaan)\b/i.test(rawQuery)) {
      if (doc.category === 'fasilitas' || doc.category === 'faq') score += 12;
    }
    if (/\b(ekskul|ekstrakurikuler|kegiatan|pramuka|hadrah|banjari|tahfidz)\b/i.test(rawQuery)) {
      if (doc.category === 'kegiatan') score += 12;
    }
    if (/\b(kurikulum|merdeka|metode belajar|filosofi|karakter)\b/i.test(rawQuery)) {
      if (doc.category === 'kurikulum' || doc.category === 'program') score += 12;
    }

    return { ...doc, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);
  const topChunks = scoredDocs.slice(0, topK);

  return {
    chunks: topChunks,
    maxScore: topChunks[0]?.score || 0,
    intent: intent,
    institution: kb.institution
  };
}

// Build RAG System Prompt with Dual-Core Intelligence
function buildSystemPrompt(chunks, institution) {
  const contextText = chunks.map((c, i) => `[ARSIP RESMI ${i + 1}: ${c.title}]\n${c.content}`).join('\n\n');

  return `Anda adalah "Asisten AI Cerdas LPI Nurul Huda Kapedi" — sebuah asisten digital serbaguna, berwawasan luas, cerdas, dan bijak dari Yayasan Pendidikan Islam Nurul Huda Kapedi (Sumenep, Madura).

DUAL-CORE INTELLIGENCE (DUA PILAR UTAMA ANDA):
1. PILAR 1: PENGETAHUAN MENDALAM TENTANG LPI NURUL HUDA KAPEDI:
   - Anda menguasai seluruh seluk-beluk lembaga: sejarah berdiri (1998 / resmi 2013), pimpinan (K. Minhaji), visi-misi, unit pendidikan (PAUD, TK Islam, SDI, SMPI, SMK Nurul Huda Sasar program Agribisnis Ternak), prestasi nasional santri (Zakiya Amilatul Jannah Juara 1 & Isyatul Munawwaroh Juara Harapan 1 di UNISMA Malang lewat inovasi AWG & WATERFLOW), PPDB, biaya, fasilitas, asrama, dan kontak resmi.
   - Ketika pengguna bertanya tentang LPI Nurul Huda, PRIORITASKAN dan DASARKAN jawaban Anda pada DATA SUMBER RESMI di bawah. Jangan pernah mengarang hal yang tidak ada dalam arsip resmi sekolah.

2. PILAR 2: PENGETAHUAN UMUM YANG LUAS & TEMAN DISKUSI CERDAS:
   - Anda BUKAN sekadar chatbot website yang kaku! Anda adalah asisten digital berwawasan luas yang mampu berdiskusi, membimbing, dan menjawab berbagai topik umum:
     * Pendidikan, metode belajar efektif, teknik menghafal Al-Qur'an (Tahfidz), tips menulis esai juara, pemilihan jurusan.
     * Keislaman (akidah, syariah, fiqh sholat, adab penuntut ilmu, akhlak, tarikh Islam) dengan pemahaman wasathiyah (moderat) khas pesantren.
     * Teknologi, Coding (HTML, JS, Python), Kecerdasan Buatan (AI), Internet of Things (IoT), dan Robotika.
     * Sains umum, biologi, lingkungan, fisika, matematika, dan wawasan sosial-budaya.
   - Terbuka untuk berdiskusi, bertukar pikiran, membedah ide, dan membantu pengguna memahami hal-hal baru secara runtut dan masuk akal.

PEDOMAN GAYA & KUALITAS JAWABAN:
- Bahasa Indonesia yang natural, cerdas, mengalir, santun, dan hangat (gunakan sapaan seperti "Bapak/Ibu/Kakak" atau sejenisnya).
- Jawab salam ("Assalamu'alaikum") dengan salam yang sempurna dan hangat.
- ATURAN EMOJI (KETAT): JANGAN gunakan emoji benda (seperti masjid, sekolah, gedung, buku, piala, telepon, clipboard). HANYA gunakan emoji emotikon/ekspresi wajah ramah (seperti 😊, 🙏, 👋, 🙂) secara wajar.
- AKURASI & MEMBEDAKAN SUMBER:
  * Bedakan dengan jelas mana informasi resmi LPI Nurul Huda, dan mana penjelasan pengetahuan umum / saran akademis.
  * Jika informasi spesifik lembaga memang tidak tersedia di arsip, akui dengan jujur dan sarankan berkonsultasi ke WhatsApp sekretariat di ${institution.whatsapp || '+6281554008683'}.
  * Pertahankan konteks dari riwayat percakapan sebelumnya agar diskusi berlangsung koheren.

DATA ARSIP RESMI LEMBAGA:
${contextText}
`;
}

// Built-in Smart Engine for Broad Knowledge & Institutional Guidance (Offline Fallback)
function smartFallbackAnswer(query, chunks, institution) {
  const raw = query.toLowerCase().trim();

  // 1. Pure Greeting
  const withoutGreeting = raw.replace(/^(assalamu'?alaikum(\s+warahmatullahi\s+wabarakatuh|\s+wr\s+wb)?|halo|hai|selamat\s+(pagi|siang|sore|malam)|assalamualaikum|permisi)[!.,\s]*/i, '').trim();
  if (withoutGreeting.length === 0) {
    return `Wa'alaikumussalam Warahmatullahi Wabarakatuh. Selamat datang di layanan asisten AI Yayasan Pendidikan Islam Nurul Huda Kapedi. Senang sekali dapat berjumpa dengan Anda hari ini. 😊\n\nSaya adalah asisten digital serbaguna yang siap membantu Anda dalam dua hal utama:\n1. Informasi lengkap seputar LPI Nurul Huda Kapedi (profil, PPDB, unit PAUD/TK/SDI/SMPI/SMK, prestasi, fasilitas, dan kontak).\n2. Diskusi dan wawasan umum seputar pendidikan, teknologi, keislaman, sains, tips belajar, maupun penulisan esai.\n\nAda topik atau informasi apa yang ingin kita bahas bersama hari ini? 🙏`;
  }

  // 2. Keislaman Umum (Rukun Iman, Rukun Islam, Sholat, Wudhu, Adab)
  if (/\b(rukun iman)\b/i.test(raw)) {
    return `Dalam ajaran Islam, **Rukun Iman** ada 6 (enam) perkara yang wajib diyakini dengan sepenuh hati: 😊\n\n1. **Iman kepada Allah SWT**: Meyakini keberadaan, keesaan, dan sifat-sifat kesempurnaan Allah.\n2. **Iman kepada Malaikat-Malaikat Allah**: Meyakini keberadaan malaikat sebagai makhluk taat yang diciptakan dari cahaya.\n3. **Iman kepada Kitab-Kitab Allah**: Meyakini kitab suci yang diturunkan kepada para Rasul (Taurat, Zabur, Injil, dan Al-Qur'an sebagai penyempurna).\n4. **Iman kepada Rasul-Rasul Allah**: Meyakini para utusan Allah yang membawa petunjuk bagi umat manusia.\n5. **Iman kepada Hari Akhir (Hari Kiamat)**: Meyakini adanya kehidupan setelah kematian, hari pembalasan, surga, dan neraka.\n6. **Iman kepada Qada dan Qadar**: Meyakini bahwa segala ketentuan baik maupun buruk telah ditetapkan oleh takdir dan kebijaksanaan Allah SWT.\n\nDi LPI Nurul Huda, penanaman akidah ini menjadi fondasi utama dalam pembentukan karakter santri sejak usia dini. Semoga bermanfaat! 🙏😊`;
  }

  if (/\b(rukun islam)\b/i.test(raw)) {
    return `**Rukun Islam** terdiri dari 5 (lima) pilar utama yang menjadi pondasi amal ibadah seorang Muslim: 😊\n\n1. **Mengucapkan Dua Kalimat Syahadat**: Bersaksi bahwa tiada Tuhan selain Allah dan Nabi Muhammad adalah utusan Allah.\n2. **Mendirikan Sholat**: Melaksanakan sholat fardhu lima waktu sehari semalam.\n3. **Menunaikan Zakat**: Mengeluarkan sebagian harta yang telah mencapai nisab dan haul untuk mereka yang berhak (mustahiq).\n4. **Berpuasa di Bulan Ramadhan**: Menahan diri dari makan, minum, dan hawa nafsu sejak terbit fajar hingga terbenam matahari.\n5. **Menunaikan Ibadah Haji**: Melaksanakan ibadah haji ke Baitullah bagi yang mampu secara fisik, mental, dan finansial.\n\nSemoga kita senantiasa dimudahkan untuk menyempurnakan rukun-rukun ini dalam kehidupan sehari-hari. 🙏`;
  }

  if (/\b(rukun sholat|rukun shalat|tata cara sholat)\b/i.test(raw)) {
    return `Berdasarkan kajian fiqh, **Rukun Sholat** terbagi menjadi rukun qauliyah (ucapan), fi'liyah (gerakan), dan qalbiyah (hati). Terdapat 13 rukun utama: 😊\n\n1. Niat dalam hati saat takbiratul ihram\n2. Berdiri bagi yang mampu\n3. Takbiratul ihram (mengucapkan Allahu Akbar)\n4. Membaca Surat Al-Fatihah pada setiap rakaat\n5. Ruku' dengan thuma'ninah (tenang sejenak)\n6. I'tidal (bangkit dari ruku') dengan thuma'ninah\n7. Sujud dua kali dengan thuma'ninah\n8. Duduk di antara dua sujud dengan thuma'ninah\n9. Duduk tasyahud akhir\n10. Membaca tasyahud akhir\n11. Membaca shalawat kepada Nabi Muhammad SAW pada tasyahud akhir\n12. Mengucapkan salam yang pertama\n13. Tertib (melakukan semua rukun secara berurutan)\n\nDi lingkungan pesantren kami, pembiasaan sholat berjamaah beserta pendalaman fiqh sholat dipraktikkan langsung setiap hari. 🙏😊`;
  }

  if (/\b(adab menuntut ilmu|adab belajar|menghormati guru)\b/i.test(raw)) {
    return `Dalam kitab-kitab klasik seperti *Ta'limul Muta'allim*, terdapat adab-adab mulia dalam menuntut ilmu: 😊\n\n1. **Meluruskan Niat**: Niat ikhlas karena Allah, menghilangkan kebodohan diri, dan melestarikan syiar agama, bukan untuk mencari popularitas atau kesombongan.\n2. **Menghormati Guru (Ustadz/Kiai)**: Menjaga sopan santun dalam berbicara, tidak mendahului perkataan guru, serta mendoakan kebaikan bagi beliau.\n3. **Bersungguh-sungguh & Sabar**: Ilmu tidak diperoleh dengan tubuh yang santai; dibutuhkan kesabaran dalam menghadapi proses belajar.\n4. **Menjaga Akhlak & Menjauhi Maksiat**: Ilmu adalah cahaya, dan cahaya Allah tidak akan masuk ke hati yang dipenuhi maksiat.\n5. **Mengamalkan & Berbagi Ilmu**: Mengamalkan apa yang dipelajari agar ilmu tersebut membawa berkah bagi masyarakat.\n\nNilai-nilai inilah yang menjadi ruh pendidikan di Yayasan Nurul Huda Kapedi. 🙏`;
  }

  // 3. Sains, Teknologi & Kecerdasan Buatan (AI, Robotik, AWG)
  if (/\b(apa itu ai|artificial intelligence|kecerdasan buatan|cara kerja ai)\b/i.test(raw)) {
    return `**Artificial Intelligence (AI)** atau Kecerdasan Buatan adalah cabang ilmu komputer yang berfokus pada pengembangan sistem yang mampu melakukan tugas-tugas yang biasanya membutuhkan kecerdasan manusia. 😊\n\n**Bagaimana AI Bekerja?**\n- **Data Training**: AI dilatih menggunakan data dalam jumlah besar (teks, gambar, angka).\n- **Algoritma & Machine Learning**: Pola-pola dalam data dipelajari untuk membuat prediksi atau keputusan.\n- **Neural Networks**: Model matematika yang terinspirasi dari jaringan saraf otak manusia untuk memproses informasi kompleks.\n\n**Contoh Penerapan:**\nAsisten virtual, sistem penerjemah otomatis, analisis medis, hingga teknologi pertanian presisi dan robotika.\n\nDi LPI Nurul Huda, kami mendorong santri untuk tidak hanya menjadi pengguna pasif teknologi, melainkan menjadi *creator* yang memahami literasi digital dan komputasi sejak usia muda. Ada aspek AI tertentu yang ingin Anda diskusikan? 🙏😊`;
  }

  if (/\b(awg|atmospheric water generator|waterflow|inovasi santri)\b/i.test(raw)) {
    return `Inovasi **AWG (Atmospheric Water Generator)** dan **WATERFLOW** adalah bukti nyata kecerdasan santri SMK Nurul Huda Sasar yang berhasil menorehkan prestasi Juara Nasional di Universitas Islam Malang (UNISMA): 😊\n\n1. **AWG (Atmospheric Water Generator) oleh Zakiya Amilatul Jannah (Juara 1 Nasional)**:\n   Teknologi yang menyerap uap air di udara lembab lalu mengembunkannya menjadi air minum higienis dengan tenaga surya. Solusi ini digagas untuk mengatasi kelangkaan air bersih di pelosok pedesaan Madura.\n\n2. **WATERFLOW oleh Isyatul Munawwaroh (Juara Harapan 1 Nasional)**:\n   Konsep penampungan air pintar (*smart reservoir*) yang mengadaptasi kearifan lokal masyarakat Madura, dipadukan dengan platform filantropi digital untuk mendistribusikan air secara adil.\n\nKarya ini membuktikan bahwa santri berwawasan teknologi mampu memberikan kontribusi nyata bagi persoalan masyarakat. 🙏😊`;
  }

  if (/\b(cara menulis esai|tips esai|struktur esai|karya tulis ilmiah)\b/i.test(raw)) {
    return `Menulis esai kompetisi yang berkualitas memerlukan struktur yang logis dan penyampaian yang tajam: 😊\n\n1. **Judul yang Menarik & Solutif**: Buat judul yang memadukan isu utama dan tawaran solusi (contoh judul siswi kami: *"Santri Digital untuk Madura Sehat: Inovasi AWG"*).\n2. **Pendahuluan**: Awali dengan latar belakang masalah nyata (didukung data valid), urgensi masalah, dan *thesis statement* solusi Anda.\n3. **Pembahasan / Isi**: Uraikan gagasan inovatif Anda secara bertahap (cara kerja, keunggulan, implementasi praktis, dan dampak sosialnya).\n4. **Penutup / Kesimpulan**: Ringkas poin penting dan berikan rekomendasi tindak lanjut yang visioner.\n5. **Daftar Pustaka**: Cantumkan rujukan ilmiah yang kredibel.\n\nApakah Anda sedang mempersiapkan sebuah esai? Saya siap membantu mendiskusikan atau menelaah kerangka ide Anda! 🙏😊`;
  }

  if (/\b(tips belajar|cara menghafal al-qur'an|tahfidz|metode belajar)\b/i.test(raw)) {
    return `Berikut beberapa tips belajar dan metode menghafal Al-Qur'an (Tahfidz) yang efektif dan berkah: 😊\n\n**Untuk Belajar Umum:**\n- **Teknik Pomodoro**: Belajar fokus 25 menit, lalu istirahat 5 menit untuk menjaga konsentrasi optimal.\n- **Feynman Technique**: Jelaskan materi yang baru dipelajari dengan bahasa sederhana seolah mengajarkannya kepada orang lain.\n\n**Untuk Menghafal Al-Qur'an (Tahfidz):**\n- **Sabaq & Sabqi**: Setoran hafalan baru (*sabaq*) dan mengulang hafalan kemarin (*sabqi*) secara disiplin.\n- **Manzil / Muroja'ah**: Mengulang hafalan lama secara teratur agar tetap mutqin (melekat kuat).\n- **Gunakan Satu Mushaf Standar**: Membantu memori visual mengingat letak ayat pada halaman.\n- **Pahami Makna Ayat**: Mengetahui terjemah dan alur kisah membuat hafalan jauh lebih kokoh.\n\nSemoga Allah memudahkan setiap langkah Bapak/Ibu/Kakak dalam menuntut ilmu! 🙏😊`;
  }

  // 4. PPDB & Biaya Pendaftaran Sekolah
  const isPpdbQuery = /\b(ppdb|spmb|pendaftaran siswa|pendaftaran murid|pendaftaran santri|daftar siswa|daftar murid|daftar santri|syarat masuk|persyaratan masuk)\b/i.test(raw) ||
    (/\b(biaya|spp|tarif|uang masuk|syarat pendaftaran|persyaratan pendaftaran|berkas pendaftaran|jadwal pendaftaran|formulir pendaftaran|brosur pendaftaran)\b/i.test(raw) &&
     /\b(sekolah|pendidikan|masuk|sdi|smpi|smk|tk|paud|santri|murid|siswa|ajaran baru|ppdb|spmb|daftar)\b/i.test(raw) &&
     !/\b(sewa|helikopter|pesawat|mobil|motor|hotel|lapangan golf|nuklir|kapal)\b/i.test(raw)) ||
    (/\b(syarat|persyaratan|formulir|brosur|jadwal)\b/i.test(raw) && /\b(ppdb|spmb|pendaftaran|daftar baru)\b/i.test(raw));

  if (isPpdbQuery) {
    return `Terima kasih atas minat Bapak/Ibu/Kakak untuk bergabung dengan keluarga besar LPI Nurul Huda Kapedi. 😊\n\nBerikut kami sampaikan rincian resmi terkait Penerimaan Peserta Didik Baru (PPDB / SPMB):\n\n**1. Jadwal & Waktu Pendaftaran**\n- Pendaftaran dibuka setiap tahun ajaran baru, dengan gelombang resmi berlangsung mulai **01 Mei hingga 31 Juni**.\n- Pelayanan pendaftaran dibuka setiap hari kerja pukul **07.00 – 14.00 WIB** bertempat di kantor sekretariat masing-masing jenjang pendidikan di Dusun Sasar, Desa Kapedi, Bluto, Sumenep.\n\n**2. Persyaratan Berkas per Jenjang**\n- **SDI Nurul Huda**: Fotokopi Akta Kelahiran, Fotokopi Kartu Keluarga (KK), Pas foto 3x4 (3 lembar), dan mengisi formulir pendaftaran.\n- **SMPI Nurul Huda**: Fotokopi Ijazah / Surat Keterangan Lulus (2 lembar), Fotokopi KK & Akta Kelahiran, Pas foto 3x4 (3 lembar), dan mengisi formulir pendaftaran.\n- **SMK Nurul Huda Sasar (Agribisnis Ternak)**: Fotokopi Ijazah / SKL (2 lembar), Fotokopi KK & Akta Kelahiran, Pas foto 3x4 (3 lembar), dan mengisi formulir pendaftaran.\n\n**3. Biaya Pendidikan & Keringanan**\nBiaya pendaftaran dan pendidikan dirancang sangat terjangkau bagi masyarakat. Yayasan juga menyediakan program beasiswa prestasi, beasiswa tahfidz Al-Qur'an, serta keringanan bagi anak yatim dan keluarga prasejahtera.\n\n**4. Kontak Layanan Panitia PPDB**\nUntuk informasi formulir, unduhan brosur, atau rincian biaya, Bapak/Ibu dapat langsung menghubungi panitia kami:\n- **Bapak Abu Rizal**: +62 815-5400-8683\n- **Bapak Ach Roni**: +62 857-4866-3415\n\nBapak/Ibu juga dapat melihat menu [PPDB](ppdb.html) di website ini untuk mengunduh brosur resmi. Semoga putra-putri Bapak/Ibu dapat berkembang optimal bersama kami. 🙏😊`;
  }

  // 5. Unit Pendidikan & Jurusan
  const isUnitQuery = /\b(unit pendidikan|jenjang pendidikan|tingkat pendidikan|ada unit apa|sekolah apa saja|ada sekolah apa|daftar sekolah|jurusan apa|program keahlian)\b/i.test(raw) ||
    (/\b(smk|sdi|smpi|paud|tk)\b/i.test(raw) && !/\b(daftar|biaya|syarat|persyaratan|ppdb|spmb)\b/i.test(raw));

  if (isUnitQuery) {
    return `Dengan senang hati kami jelaskan unit-unit pendidikan yang dikelola oleh Yayasan Nurul Huda Kapedi. 😊\n\nLembaga kami menaungi 5 jenjang pendidikan formal yang terintegrasi dan berkesinambungan:\n\n1. **PAUD Nurul Huda**: Pendidikan usia dini yang berfokus pada stimulasi tumbuh kembang anak secara menyeluruh berlandaskan nilai-nilai islami.\n2. **TK Islam Nurul Huda**: Pembelajaran taman kanak-kanak berbasis fitrah yang menyenangkan, membiasakan adab mulia, hafalan surat pendek, serta doa harian.\n3. **SDI Nurul Huda (Sekolah Dasar Islam)**: Memadukan kurikulum nasional dengan kurikulum kepesantrenan, pembiasaan sholat dhuha dan dzuhur berjamaah, tahfidz Juz 30, serta pengenalan dasar teknologi komputer.\n4. **SMPI Nurul Huda Kapedi (Sekolah Menengah Pertama Islam)**: Menitikberatkan pada pembinaan karakter remaja, pendalaman sains terpadu, tahfidz Al-Qur'an, penguasaan bahasa asing dasar, dan kepemimpinan.\n5. **SMK Nurul Huda Sasar**: Sekolah kejuruan berbasis keterampilan terapan dengan program keahlian unggulan **Agribisnis Ternak**, yang diperkuat inovasi teknologi digital, robotik, dan pembekalan wirausaha mandiri.\n\nSeluruh unit berada dalam satu lingkungan yang harmonis, membimbing siswa menjadi generasi yang cerdas dan berakhlakul karimah. Apakah ada jenjang tertentu yang ingin Bapak/Ibu ketahui lebih mendalam? 🙏`;
  }

  // 6. Cek fasilitas / layanan luar lingkup
  if (/\b(helikopter|pesawat|kapal|sewa mobil|sewa motor|sewa gedung|hotel|lapangan golf|kolam renang|bioskop|mall)\b/i.test(raw)) {
    return `Terima kasih banyak atas pertanyaan yang Bapak/Ibu/Kakak sampaikan. 😊\n\nMohon maaf sebesar-besarnya, fasilitas atau layanan tersebut **tidak tersedia** di LPI Nurul Huda Kapedi. Lembaga kami adalah yayasan pendidikan Islam yang berfokus menyelenggarakan jenjang PAUD, TK, SDI, SMPI, dan SMK (Agribisnis Ternak) berbasis nilai kepesantrenan dan IPTEK.\n\nJika Bapak/Ibu membutuhkan informasi seputar program pendidikan atau ingin berdiskusi mengenai topik lain, kami siap melayani dengan senang hati. 🙏😊`;
  }

  // 7. Prestasi
  if (/\b(prestasi|juara|lomba|esai|penghargaan|unisma|pemenang)\b/i.test(raw)) {
    return `Alhamdulillah, siswa dan santri LPI Nurul Huda Kapedi senantiasa didorong untuk berprestasi dan telah menorehkan berbagai capaian membanggakan, antara lain: 😊\n\n**1. Prestasi Tingkat Nasional (MAFIA FEST di Universitas Islam Malang / UNISMA)**\n- **Zakiya Amilatul Jannah** (Siswi SMK Nurul Huda Sasar): Meraih **Juara 1 Tingkat Nasional** dalam Lomba Menulis Esai melalui karya inovasi berjudul *"Santri Digital untuk Madura Sehat: Inovasi Atmospheric Water Generator (AWG)"*.\n- **Isyatul Munawwaroh** (Siswi SMK Nurul Huda Sasar): Meraih **Juara Harapan 1 Tingkat Nasional** melalui karya esai inovatif *"WATERFLOW: Smart Reservoir Berbasis Local Wisdom"*.\n\n**2. Ajang Perlombaan & Persahabatan Regional Se-Madura**\n- Meraih predikat sebagai **Juara Lembaga Favorit** se-Madura.\n- **Juara 1 Olimpiade PAI**: diraih oleh Syifa Fauziah (dan Juara 3 oleh Arifatul Maulida).\n- **Juara 2 Tartilul Qur'an**: diraih oleh Lu'luatul Mahbubah.\n- **Juara 1 Shalawat Dibaiyah**: diraih oleh Thoriqil Mustaqim.\n- **Juara 2 Kaligrafi**: diraih oleh Aisyahtul Munawaroh.\n- **Juara 1 Mewarnai**: diraih oleh Tiara Syarifah Putri.\n\nPrestasi ini membuktikan bahwa pendidikan di lembaga kami memadukan kemampuan akademis, kreativitas sains modern, dan ketakwaan religius secara seimbang. Semoga memotivasi putra-putri kita semua. 🙏😊`;
  }

  // 8. Visi, Misi, Sejarah & Pimpinan
  if (/\b(visi|misi|tujuan|sejarah|berdiri|pendiri|pimpinan|ketua yayasan|kepala|tahun)\b/i.test(raw)) {
    return `Dengan senang hati kami sampaikan profil dan orientasi Yayasan Pendidikan Islam Nurul Huda Kapedi: 😊\n\n**Sejarah & Pimpinan**\nLembaga kami didirikan sejak tahun **1998** dan diresmikan secara hukum yayasan pada tahun **2013** di bawah kepemimpinan **K. Minhaji**. Berlokasi di Dusun Sasar, Desa Kapedi, Kecamatan Bluto, Kabupaten Sumenep, yayasan hadir untuk menjawab kebutuhan masyarakat akan pendidikan berkualitas yang berakar pada nilai-nilai kepesantrenan.\n\n**Visi Lembaga**\n"Menjadi lembaga pendidikan Islam terpadu yang unggul dalam mencetak generasi bertakwa, berakhlak mulia, menguasai IPTEK, dan berdaya saing di era digital."\n\n**Misi Utama**\n1. Mengintegrasikan kurikulum formal sekolah dengan nilai-nilai keagamaan khas pesantren untuk membentuk akhlakul karimah.\n2. Mengembangkan potensi siswa di bidang teknologi informasi, inovasi digital, serta robotik sejak usia muda.\n3. Menyelenggarakan pelatihan vokasional berbasis praktik yang relevan dengan kebutuhan industri modern.\n4. Mendorong kreativitas siswa agar mampu menjadi kreator dan pencipta karya yang produktif dan bermanfaat.\n\nKami senantiasa berupaya memberikan pengasuhan terbaik bagi seluruh peserta didik. Jika ada hal lain yang ingin Bapak/Ibu ketahui, kami siap membantu. 🙏`;
  }

  // 9. Fasilitas & Asrama
  if (/\b(fasilitas|asrama|mondok|pondok|pesantren|lab|komputer|masjid|perpustakaan)\b/i.test(raw)) {
    return `Untuk menunjang kenyamanan dan efektivitas proses belajar mengajar, LPI Nurul Huda Kapedi menyediakan fasilitas terpadu, antara lain: 😊\n\n- **Masjid dan Musholla**: Sarana ibadah yang representatif untuk pembiasaan sholat berjamaah, kajian keislaman, dan pembinaan rohani harian.\n- **Laboratorium Komputer**: Dilengkapi perangkat komputer dan akses internet untuk pembelajaran literasi digital, desain, dan robotik.\n- **Perpustakaan**: Menyediakan beragam buku teks pelajaran umum, referensi keagamaan Islam, dan ensiklopedia ilmu pengetahuan.\n- **Sarana Olahraga**: Lapangan multifungsi untuk kegiatan olahraga, bela diri, dan upacara.\n- **Asrama / Pondok Pesantren**: Bagi santri yang memilih bermukim (mondok), tersedia asrama dengan bimbingan dan pendampingan ustadz/ustadzah selama 24 jam. (Catatan: Siswa diperbolehkan memilih antara reguler pulang-pergi maupun mukim di asrama).\n- **Sarana Praktik Vokasional**: Lahan dan unit praktik khusus untuk siswa SMK dalam pendalaman agribisnis dan teknologi terapan.\n\nBapak/Ibu dipersilakan untuk berkunjung langsung melihat fasilitas kami pada jam kerja. Kami akan menyambut dengan tangan terbuka. 🙏😊`;
  }

  // 10. Kontak & Alamat
  if (/\b(kontak|alamat|lokasi|nomor|telepon|wa|whatsapp|email|instagram|youtube|maps|dimana)\b/i.test(raw)) {
    return `Dengan senang hati kami sampaikan informasi alamat dan saluran komunikasi resmi LPI Nurul Huda Kapedi: 😊\n\n- **Alamat Kantor**: Jl. Utara Masjid Sumber, Dusun Sasar, Desa Kapedi, Kecamatan Bluto, Kabupaten Sumenep, Madura, Jawa Timur 69461.\n- **WhatsApp / Telepon Layanan**: [${institution.whatsapp || '+6281554008683'}](https://wa.me/6281554008683) (Respon cepat pada jam kerja).\n- **Email Resmi**: ${institution.email || 'ppnurulhudakapedi@gmail.com'}\n- **Instagram**: [@osdaka_ynh](https://www.instagram.com/osdaka_ynh)\n- **YouTube**: [PP Nurul Huda Kapedi](https://youtube.com/@ppnurulhudakapedi)\n- **Lokasi Google Maps**: [Buka Penunjuk Arah Google Maps](https://maps.app.goo.gl/vWHgCBXxvxwLxXwU8)\n\nKantor kami buka melayani tamu setiap hari kerja (Senin s.d. Sabtu) pukul **07.00 – 14.00 WIB**. Kami nantikan kunjungan Bapak/Ibu/Kakak. 🙏😊`;
  }

  // 11. Jika ada chunk relevan dengan skor tinggi dari arsip lembaga
  if (chunks.length > 0 && chunks[0].score >= 8) {
    return `Terima kasih atas pertanyaannya. Berdasarkan informasi resmi lembaga terkait **${chunks[0].title}**, berikut penjelasannya: 😊\n\n${chunks[0].content}\n\nApabila Bapak/Ibu/Kakak membutuhkan informasi yang lebih spesifik mengenai hal ini, silakan menghubungi layanan informasi kami melalui WhatsApp di [${institution.whatsapp || '+6281554008683'}](https://wa.me/6281554008683). Kami siap melayani Anda dengan sepenuh hati. 🙏`;
  }

  // 12. Diskusi terbuka & sopan untuk pertanyaan yang belum teridentifikasi
  return `Terima kasih banyak atas pertanyaan yang Bapak/Ibu/Kakak sampaikan. 😊\n\nSebagai asisten yang siap berdiskusi, kami berusaha memberikan jawaban yang paling akurat. Namun, untuk pertanyaan spesifik ini, kami ingin memastikan terlebih dahulu:\n\n1. Jika pertanyaan ini berkaitan dengan **kebijakan atau data khusus LPI Nurul Huda Kapedi**, mohon maaf saat ini belum tercantum secara lengkap dalam arsip publik kami. Bapak/Ibu dapat berkonsultasi langsung dengan petugas kami via WhatsApp di [${institution.whatsapp || '+6281554008683'}](https://wa.me/6281554008683).\n2. Jika pertanyaan ini berkaitan dengan **topik pengetahuan umum, sains, atau pendidikan**, mohon perjelas kembali pertanyaannya agar kami dapat memberikan uraian yang mendalam dan tepat sasaran.\n\nKami siap melayani dan bertukar pikiran dengan Bapak/Ibu! 🙏😊`;
}

module.exports = {
  retrieveRelevantChunks,
  buildSystemPrompt,
  smartFallbackAnswer,
  getKnowledgeBase,
  detectIntent
};
