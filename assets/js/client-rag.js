// ============================================================
// assets/js/client-rag.js — Client-Side Smart RAG Engine
// Yayasan Pendidikan Islam Nurul Huda Kapedi
// Runs seamlessly on static hosting (GitHub Pages) & offline
// Dual-Core Knowledge: Institutional Data & Broad General Knowledge
// ============================================================

export const CLIENT_KB = {
  institution: {
    name: "Yayasan Pendidikan Islam Nurul Huda Kapedi",
    shortName: "LPI Nurul Huda Kapedi",
    tagline: "Mencetak Generasi Islam yang Berilmu, Beriman, Berakhlak Mulia, dan Berdaya Saing Global",
    foundationYear: "1998",
    legalYear: "2013",
    founderLeader: "K. Minhaji",
    address: "Jl. Utara Masjid Sumber, Dusun Sasar, Desa Kapedi, Kecamatan Bluto, Kabupaten Sumenep, Madura, Jawa Timur 69461",
    phone: "+6281554008683",
    whatsapp: "+6281554008683",
    email: "ppnurulhudakapedi@gmail.com",
    instagram: "https://www.instagram.com/osdaka_ynh",
    tiktok: "https://www.tiktok.com/@ppnurulhudakapedi",
    youtube: "https://youtube.com/@ppnurulhudakapedi",
    maps: "https://maps.app.goo.gl/vWHgCBXxvxwLxXwU8"
  },
  documents: [
    {
      id: "profil-umum",
      category: "profil",
      title: "Profil Umum LPI Nurul Huda Kapedi",
      keywords: ["profil", "tentang", "yayasan", "lpi", "nurul huda", "kapedi", "bluto", "sumenep", "madura", "sekolah"],
      content: "Yayasan Pendidikan Islam Nurul Huda Kapedi (LPI Nurul Huda) adalah lembaga pendidikan Islam yang berlokasi di Dusun Sasar, Desa Kapedi, Kecamatan Bluto, Kabupaten Sumenep, Madura, Jawa Timur. Berdiri sejak tahun 1998 dan diresmikan sebagai yayasan pada tahun 2013 di bawah kepemimpinan Bapak Minhaji (K. Minhaji). Lembaga ini memadukan pendidikan formal berbasis kurikulum nasional dan teknologi dengan nilai-nilai luhur agama Islam khas pesantren untuk mencetak generasi berakhlak mulia, cerdas secara akademik, dan siap menghadapi era digital."
    },
    {
      id: "visi-misi-tujuan",
      category: "visi-misi",
      title: "Visi, Misi, dan Tujuan LPI Nurul Huda Kapedi",
      keywords: ["visi", "misi", "tujuan", "cita-cita", "target", "orientasi", "arah"],
      content: "Visi LPI Nurul Huda: Menjadi lembaga pendidikan Islam terpadu yang unggul dalam mencetak generasi bertakwa, berakhlak mulia, menguasai IPTEK, dan berdaya saing di era digital.\n\nMisi:\n1. Mengintegrasikan kurikulum formal sekolah dengan nilai-nilai keagamaan khas pesantren untuk membentuk akhlakul karimah.\n2. Mengembangkan potensi siswa di bidang teknologi informasi, inovasi digital, serta robotik sejak usia muda.\n3. Menyelenggarakan pelatihan vokasional berbasis praktik (khususnya tingkat SMK) agar lulusan memiliki keahlian yang relevan dengan industri modern.\n4. Mendorong kreativitas siswa agar mampu bertransformasi dari sekadar pengguna teknologi menjadi pencipta karya yang produktif.\n\nTujuan:\n1. Melahirkan lulusan yang taat beragama, berwawasan luas, dan siap kerja atau berwirausaha sesuai keahliannya.\n2. Menyediakan sarana belajar berbasis teknologi yang adaptif terhadap tantangan zaman modern.\n3. Membantu masyarakat sekitar di wilayah Bluto dan Sumenep dalam mendapatkan akses pendidikan berkualitas dengan biaya terjangkau."
    },
    {
      id: "nilai-dan-program-unggulan",
      category: "program",
      title: "Nilai-Nilai dan Program Unggulan LPI Nurul Huda",
      keywords: ["program", "unggulan", "nilai", "robotik", "teknologi", "vokasional", "kreatif", "pesantren"],
      content: "Nilai-Nilai Utama:\n- Berpikir Kreatif & Inovatif: Melatih siswa adaptif menghadapi perkembangan era teknologi.\n- Nilai Produktif: Menanamkan pola pikir bahwa aktivitas digital siswa harus mampu menghasilkan karya atau manfaat nyata.\n- Karakter Akhlakul Karimah: Mengawinkan keahlian IPTEK dengan benteng nilai keagamaan Islam khas pesantren.\n\nProgram Unggulan:\n1. Inovasi Teknologi & Robotik: Mengembangkan bakat teknologi siswa melalui pembuatan robot dan penanaman computational thinking sejak dini.\n2. Kreativitas & Literasi Digital: Mendorong siswa menjadi content creator atau pembuat solusi digital produktif.\n3. Keterampilan Vokasional: Mempersiapkan siswa siap kerja lewat keahlian praktis sesuai kebutuhan dunia usaha dan dunia industri (DUDI)."
    },
    {
      id: "unit-pendidikan",
      category: "unit",
      title: "Unit-Unit Pendidikan di Bawah Yayasan Nurul Huda Kapedi",
      keywords: ["unit", "jenjang", "paud", "tk", "sdi", "smpi", "smk", "sekolah", "sd", "smp", "kejuruan", "jurusan", "agribisnis ternak"],
      content: "Yayasan Nurul Huda Kapedi mengelola 5 jenjang pendidikan formal yang terintegrasi dan berkesinambungan:\n1. PAUD Nurul Huda: Pendidikan Anak Usia Dini untuk tumbuh kembang optimal sejak dini.\n2. TK Islam Nurul Huda: Taman Kanak-Kanak berbasis nilai-nilai Islam dengan pembelajaran yang menyenangkan dan penanaman adab serta doa harian.\n3. SDI Nurul Huda (Sekolah Dasar Islam): Kurikulum nasional dipadukan kurikulum keislaman, tahfidz Al-Qur'an (Juz 30), pembiasaan sholat dhuha & dzuhur berjamaah, serta pengenalan dasar sains dan komputer.\n4. SMPI Nurul Huda Kapedi (Sekolah Menengah Pertama Islam): Fokus pada pembinaan akhlak masa remaja, penguasaan sains terpadu, tahfidz, bahasa asing dasar, dan kepemimpinan.\n5. SMK Nurul Huda Sasar: Sekolah Menengah Kejuruan siap kerja dan wirausaha dengan Program Keahlian unggulan Agribisnis Ternak, integrasi sains terapan, serta inovasi teknologi ramah lingkungan."
    },
    {
      id: "ppdb-info",
      category: "ppdb",
      title: "Informasi PPDB (Penerimaan Peserta Didik Baru / SPMB)",
      keywords: ["ppdb", "spmb", "daftar", "pendaftaran", "syarat", "biaya", "jadwal", "gelombang", "brosur", "formulir", "kontak ppdb", "masuk"],
      content: "PPDB LPI Nurul Huda Kapedi:\n- Jadwal Gelombang Pendaftaran: 01 Mei – 31 Juni setiap tahun ajaran baru.\n- Waktu Pelayanan: Setiap hari kerja (Senin s.d. Sabtu) pukul 07.00 – 14.00 WIB.\n- Lokasi Pendaftaran: Kantor Sekretariat Panitia PPDB di Dusun Sasar, Desa Kapedi, Bluto, Sumenep.\n- Syarat Berkas SDI: Formulir pendaftaran, Fotokopi Akta Kelahiran, Fotokopi Kartu Keluarga (KK), Pas foto 3x4 (3 lembar).\n- Syarat Berkas SMPI & SMK: Formulir pendaftaran, Fotokopi Ijazah / SKL (2 lembar), Fotokopi KK & Akta Kelahiran, Pas foto 3x4 (3 lembar).\n- Biaya & Beasiswa: Biaya pendaftaran dan pendidikan sangat terjangkau. Tersedia beasiswa prestasi, beasiswa tahfidz Al-Qur'an, serta bantuan keringanan bagi anak yatim dan keluarga prasejahtera.\n- Kontak Panitia PPDB: Bapak Abu Rizal (+62 815-5400-8683) & Bapak Ach Roni (+62 857-4866-3415)."
    },
    {
      id: "prestasi-siswa",
      category: "prestasi",
      title: "Prestasi Santri dan Siswa LPI Nurul Huda",
      keywords: ["prestasi", "juara", "lomba", "esai", "nasional", "unisma", "awg", "waterflow", "zakiya", "isyatul", "madura"],
      content: "Prestasi Membanggakan LPI Nurul Huda:\n1. Tingkat Nasional di Universitas Islam Malang (UNISMA) - MAFIA FEST:\n   - Zakiya Amilatul Jannah (Siswi SMK Nurul Huda Sasar): Juara 1 Tingkat Nasional Lomba Menulis Esai dengan karya inovasi 'Santri Digital untuk Madura Sehat: Inovasi Atmospheric Water Generator (AWG)'.\n   - Isyatul Munawwaroh (Siswi SMK Nurul Huda Sasar): Juara Harapan 1 Tingkat Nasional dengan karya inovasi 'WATERFLOW: Smart Reservoir Berbasis Local Wisdom'.\n2. Tingkat Regional Se-Madura:\n   - Meraih Juara Lembaga Favorit se-Madura.\n   - Juara 1 Olimpiade PAI: Syifa Fauziah (Juara 3: Arifatul Maulida).\n   - Juara 2 Tartilul Qur'an: Lu'luatul Mahbubah.\n   - Juara 1 Shalawat Dibaiyah: Thoriqil Mustaqim.\n   - Juara 2 Kaligrafi: Aisyahtul Munawaroh.\n   - Juara 1 Mewarnai: Tiara Syarifah Putri."
    },
    {
      id: "fasilitas-dan-asrama",
      category: "fasilitas",
      title: "Fasilitas Belajar dan Asrama Pesantren",
      keywords: ["fasilitas", "asrama", "pondok", "pesantren", "lab", "komputer", "masjid", "musholla", "perpustakaan", "lapangan", "mukim"],
      content: "Fasilitas di LPI Nurul Huda Kapedi meliputi:\n- Masjid dan Musholla sebagai pusat ibadah dan pembinaan rohani harian.\n- Laboratorium Komputer dengan akses internet untuk pembelajaran IT dan robotik.\n- Perpustakaan dengan koleksi buku pelajaran dan keislaman.\n- Sarana Olahraga multifungsi untuk kegiatan jasmani dan ekstrakurikuler.\n- Sarana Praktik Vokasional: Lahan peternakan terpadu untuk siswa SMK Agribisnis Ternak.\n- Asrama Pesantren: Tersedia asrama bagi siswa yang ingin mondok (mukim) dengan pembinaan 24 jam oleh ustadz/ustadzah. Siswa juga diperbolehkan pulang-pergi (reguler) jika berdomisili dekat."
    },
    {
      id: "kontak-dan-lokasi",
      category: "kontak",
      title: "Kontak Resmi, Alamat, dan Media Sosial",
      keywords: ["kontak", "alamat", "lokasi", "telepon", "whatsapp", "wa", "email", "instagram", "youtube", "tiktok", "maps", "kantor"],
      content: "Saluran Informasi Resmi LPI Nurul Huda Kapedi:\n- Alamat: Jl. Utara Masjid Sumber, Dusun Sasar, Desa Kapedi, Kecamatan Bluto, Kabupaten Sumenep, Madura, Jawa Timur 69461.\n- Layanan WhatsApp: +62 815-5400-8683 (Respon cepat pada jam kerja).\n- Email: ppnurulhudakapedi@gmail.com\n- Instagram: @osdaka_ynh\n- TikTok: @ppnurulhudakapedi\n- YouTube: PP Nurul Huda Kapedi\n- Google Maps: https://maps.app.goo.gl/vWHgCBXxvxwLxXwU8\n- Jam Operasional Kantor: Senin – Sabtu, pukul 07.00 – 14.00 WIB."
    }
  ]
};

// Search chunks matching query
export function clientRetrieveChunks(query) {
  const raw = query.toLowerCase();
  const tokens = raw.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);

  const scored = CLIENT_KB.documents.map(doc => {
    let score = 0;
    for (const kw of doc.keywords) {
      if (raw.includes(kw)) score += 5;
    }
    for (const t of tokens) {
      if (doc.title.toLowerCase().includes(t)) score += 4;
      if (doc.content.toLowerCase().includes(t)) score += 1;
    }

    if (/\b(ppdb|daftar|syarat|biaya|masuk|spmb)\b/i.test(raw) && doc.category === 'ppdb') score += 15;
    if (/\b(unit|jenjang|sekolah|smk|sdi|smpi|tk|paud|jurusan)\b/i.test(raw) && doc.category === 'unit') score += 15;
    if (/\b(prestasi|juara|lomba|penghargaan)\b/i.test(raw) && doc.category === 'prestasi') score += 15;
    if (/\b(visi|misi|sejarah|berdiri|pimpinan)\b/i.test(raw) && (doc.category === 'visi-misi' || doc.category === 'profil')) score += 15;
    if (/\b(kontak|alamat|wa|whatsapp|lokasi|nomor)\b/i.test(raw) && doc.category === 'kontak') score += 15;
    if (/\b(fasilitas|asrama|pondok|lab|komputer)\b/i.test(raw) && doc.category === 'fasilitas') score += 15;

    return { ...doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

// Client-Side Smart Reasoning Answer Generator
export function generateClientRAGResponse(query, history = []) {
  const raw = query.toLowerCase().trim();
  const institution = CLIENT_KB.institution;

  // 1. Sapaan Murni (Assalamu'alaikum, Halo, Hai, dsb.)
  const withoutGreeting = raw.replace(/^(assalamu'?alaikum(\s+warahmatullahi\s+wabarakatuh|\s+wr\s+wb)?|halo|hai|selamat\s+(pagi|siang|sore|malam)|assalamualaikum|permisi)[!.,\s]*/i, '').trim();
  if (withoutGreeting.length === 0) {
    return {
      reply: `Wa'alaikumussalam Warahmatullahi Wabarakatuh. Selamat datang di layanan asisten AI Yayasan Pendidikan Islam Nurul Huda Kapedi. Senang sekali dapat berjumpa dengan Anda hari ini. 😊\n\nSaya adalah asisten digital serbaguna yang siap membantu Anda dalam dua hal utama:\n1. Informasi lengkap seputar LPI Nurul Huda Kapedi (profil, PPDB, unit PAUD/TK/SDI/SMPI/SMK, prestasi, fasilitas, dan kontak).\n2. Diskusi dan wawasan umum seputar pendidikan, teknologi, keislaman, sains, tips belajar, maupun penulisan esai.\n\nAda topik atau informasi apa yang ingin kita bahas bersama hari ini? 🙏`,
      sources: ['Profil Resmi Lembaga']
    };
  }

  // 2. Pertanyaan Sopan Santun (Terima kasih, dsb.)
  if (/\b(terima kasih|makasih|matur nuwun|syukron|jazakallah|thanks)\b/i.test(raw)) {
    return {
      reply: `Sama-sama, senang sekali bisa membantu Bapak/Ibu/Kakak! Semoga informasi yang disampaikan bermanfaat dan membawa keberkahan. 😊\n\nJika masih ada hal lain seputar sekolah, PPDB, atau topik lainnya yang ingin ditanyakan, jangan ragu untuk menyapa saya kembali ya. Selamat beraktivitas! 🙏`,
      sources: ['Layanan Informasi Ramah']
    };
  }

  // 3. Pertanyaan Identitas Asisten (Siapa kamu, bisa apa, bantu apa)
  if (/\b(kamu siapa|siapa kamu|siapa anda|anda siapa|bisa apa|bantu apa|perkenalkan diri|siapa namamu|tentang kamu)\b/i.test(raw)) {
    return {
      reply: `Ahlan wa sahlan! Saya adalah **Asisten AI Resmi LPI Nurul Huda Kapedi**, asisten digital cerdas dan ramah yang siap melayani Anda. 😊\n\nSaya memiliki dua kemampuan utama:\n1. **Pusat Informasi Resmi Lembaga**: Menjawab segala hal mengenai LPI Nurul Huda Kapedi (profil, visi-misi, pimpinan, sejarah, unit PAUD/TK/SDI/SMPI/SMK, PPDB & biaya, prestasi, fasilitas, asrama, dan kontak sekretariat).\n2. **Teman Diskusi Berwawasan Luas**: Membantu menjelaskan topik seputar pendidikan, keislaman (rukun iman, fiqh ibadah, adab), sains & teknologi (Kecerdasan Buatan/AI, coding, robotika), tips belajar efektif, hingga panduan menulis esai kompetisi.\n\nSilakan sampaikan pertanyaan atau topik yang ingin Anda diskusikan, saya akan bantu dengan senang hati! 🙏😊`,
      sources: ['Asisten AI Resmi LPI Nurul Huda']
    };
  }

  // 4. Pertanyaan Singkat Reflektif ("Kenapa", "Mengapa", "Maksudnya") yang berdiri sendiri
  if (/^(kenapa|mengapa|kenapa ya|mengapa ya|kenapa gitu|kok gitu|maksudnya|kenapa kok)[?!.\s]*$/i.test(raw)) {
    return {
      reply: `Mohon maaf jika penjelasan sebelumnya dirasa kurang jelas atau menimbulkan tanda tanya. 🙏😊\n\nSebagai asisten AI LPI Nurul Huda Kapedi, saya siap membantu menjelaskan pertanyaan Anda secara langsung dan mendalam di sini:\n\n1. Jika Anda menanyakan tentang **sekolah dan pendaftaran**, Anda dapat menanyakan biaya, syarat PPDB, unit pendidikan (PAUD/TK/SDI/SMPI/SMK), fasilitas asrama, maupun kontak sekretariat.\n2. Jika Anda menanyakan tentang **keunggulan lembaga**, LPI Nurul Huda memadukan ilmu agama kepesantrenan dengan teknologi modern serta memiliki program Agribisnis Ternak dan riset santri tingkat nasional.\n3. Jika ada topik **sains, teknologi, keislaman, atau tips belajar** yang ingin dibahas, silakan sampaikan detail pertanyaannya.\n\nBolehkah saya tahu hal spesifik apa yang ingin Bapak/Ibu/Kakak ketahui lebih lanjut? Saya siap melayani dengan senang hati! 🙏`,
      sources: ['Layanan Informasi Ramah', 'Asisten Digital Nurul Huda']
    };
  }

  // 5. SAINS UMUM (Diuji SEBELUM kata 'kenapa' umum agar tidak tertukar!)
  // 5a. Langit Biru
  if (/\b(langit biru|warna langit|kenapa langit)\b/i.test(raw)) {
    return {
      reply: `Pertanyaan sains yang sangat menarik! Mari kita bedah penjelasannya secara ilmiah: 😊\n\n**Mengapa Langit Berwarna Biru?**\nFenomena ini terjadi karena peristiwa fisika atmosfer yang disebut **Hamburan Rayleigh (Rayleigh Scattering)**:\n1. Cahaya matahari yang sampai ke bumi tampak putih, padahal sebenarnya terdiri dari gabungan spektrum warna (merah, jingga, kuning, hijau, biru, nila, ungu) dengan panjang gelombang yang berbeda.\n2. Cahaya biru memiliki panjang gelombang yang lebih pendek dan berenergi lebih tinggi dibandingkan spektrum warna merah atau kuning.\n3. Saat cahaya matahari menembus atmosfer bumi, partikel gas (seperti nitrogen dan oksigen) menghamburkan cahaya dengan panjang gelombang pendek (biru) ke segala arah dengan intensitas jauh lebih kuat.\n4. Akibatnya, saat kita memandang ke atas pada siang hari, mata kita menangkap gelombang cahaya biru yang terhambur di seluruh penjuru langit.\n\nSains adalah sarana mengagumi kebesaran ciptaan Allah SWT. Apakah ada fenomena alam atau sains lain yang ingin Anda diskusikan? 🙏😊`,
      sources: ['Khazanah Sains & Fisika Atmosfer']
    };
  }

  // 5b. Siklus Air & Hujan
  if (/\b(kenapa hujan|proses hujan|terjadinya hujan|siklus air|hujan turun|kenapa mendung)\b/i.test(raw)) {
    return {
      reply: `Hujan terjadi melalui siklus hidrologi alamiah yang teratur dan luar biasa: 😊\n\n1. **Evaporasi (Penguapan)**: Panas matahari menguapkan air dari laut, danau, sungai, dan tanaman ke udara dalam bentuk uap air.\n2. **Kondensasi (Pengembunan)**: Saat uap air naik ke lapisan atmosfer yang lebih tinggi dan dingin, uap tersebut mengembun menjadi titik-titik air kecil yang berkumpul membentuk awan.\n3. **Presipitasi (Turunnya Hujan)**: Titik-titik air di dalam awan terus bertambah berat hingga udara tidak lagi mampu menahannya, lalu jatuh ke bumi sebagai butiran air hujan.\n4. **Infiltrasi & Aliran**: Air hujan meresap ke dalam tanah dan mengalir kembali ke sungai dan samudra.\n\nKonsep pemanenan air dari udara ini pula yang mendasari inovasi *Atmospheric Water Generator (AWG)* karya santri SMK Nurul Huda yang meraih Juara 1 Nasional di UNISMA Malang. 🙏😊`,
      sources: ['Khazanah Sains & Hidrologi', 'Inovasi Riset Santri']
    };
  }

  // 5c. Gravitasi
  if (/\b(apa itu gravitasi|gaya gravitasi|kenapa benda jatuh|hukum gravitasi)\b/i.test(raw)) {
    return {
      reply: `**Gravitasi** adalah gaya tarik-menarik alami yang terjadi antara semua benda yang memiliki massa di alam semesta: 😊\n\n1. **Prinsip Dasar**: Semakin besar massa suatu benda, semakin kuat gaya tarik gravitasinya. Bumi memiliki massa yang sangat besar, sehingga menarik segala benda di permukaannya (termasuk kita, udara, dan lautan) ke arah pusat bumi.\n2. **Hukum Newton**: Sir Isaac Newton merumuskan bahwa setiap partikel materi menarik partikel lain dengan gaya yang berbanding lurus dengan massa dan berbanding terbalik dengan kuadrat jaraknya.\n3. **Relativitas Einstein**: Dalam fisika modern, Albert Einstein menjelaskan bahwa gravitasi adalah kelengkungan ruang-waktu yang disebabkan oleh massa benda angkasa.\n\nKarena adanya gravitasilah bumi memiliki atmosfer yang melindungi kehidupan dan orbit planet tetap stabil mengelilingi matahari. Sungguh sebuah tatanan alam yang maha sempurna. 🙏😊`,
      sources: ['Khazanah Fisika Dasar']
    };
  }

  // 5d. Fotosintesis
  if (/\b(fotosintesis|proses fotosintesis|bagaimana tumbuhan makan)\b/i.test(raw)) {
    return {
      reply: `**Fotosintesis** adalah proses biokimia di mana tumbuhan hijau, alga, dan beberapa bakteri membuat makanannya sendiri dengan memanfaatkan cahaya matahari: 😊\n\n1. **Bahan Utama**: Tumbuhan menyerap air ($H_2O$) melalui akar dari tanah, dan menyerap karbon dioksida ($CO_2$) dari udara melalui stomata di daun.\n2. **Peran Klorofil**: Pigmen hijau daun (klorofil) menangkap energi radiasi sinar matahari.\n3. **Proses Kimia**: Energi matahari digunakan untuk memecah air dan menggabungkannya dengan $CO_2$ menghasilkan glukosa ($C_6H_{12}O_6$) sebagai sumber energi tumbuhan.\n4. **Hasil Samping Berharga**: Proses ini melepaskan oksigen ($O_2$) ke udara yang menjadi sumber pernapasan bagi manusia dan hewan di seluruh bumi.\n\nFotosintesis adalah penyedia oksigen terbesar di bumi yang menjaga kelangsungan ekosistem. Ada topik biologi lain yang ingin dibahas? 🙏😊`,
      sources: ['Khazanah Sains & Biologi']
    };
  }

  // 5e. Tata Surya & Rotasi Bumi
  if (/\b(tata surya|rotasi bumi|revolusi bumi|kenapa ada siang malam|bumi bulat|gerhana)\b/i.test(raw)) {
    return {
      reply: `Berikut penjelasan sains tentang pergerakan bumi dan tata surya kita: 😊\n\n1. **Rotasi Bumi (Penyebab Siang & Malam)**: Bumi berputar pada porosnya dari barat ke timur membutuhkan waktu sekitar 24 jam. Bagian bumi yang menghadap matahari mengalami siang, sementara bagian yang membelakangi matahari mengalami malam.\n2. **Revolusi Bumi (Penyebab Pergantian Musim)**: Bumi mengelilingi matahari dalam lintasan elips selama sekitar 365,25 hari (1 tahun). Kemiringan sumbu bumi sebesar 23,5 derajat menyebabkan variasi panjang siang-malam dan pergantian musim.\n3. **Sistem Tata Surya**: Terdiri dari Matahari sebagai pusat gravitasi, dikelilingi 8 planet (Merkurius, Venus, Bumi, Mars, Yupiter, Saturnus, Uranus, Neptunus), asteroid, komet, dan meteoroid.\n\nKeteraturan rotasi dan revolusi ini menunjukkan keagungan hukum alam (*sunnatullah*) yang sangat presisi. 🙏😊`,
      sources: ['Khazanah Astronomi & Sains']
    };
  }

  // 6. TEKNOLOGI & ARTIFICIAL INTELLIGENCE (AI, Robotik, Coding)
  if (/\b(apa itu ai|artificial intelligence|kecerdasan buatan|cara kerja ai|definisi ai|belajar ai)\b/i.test(raw)) {
    return {
      reply: `**Artificial Intelligence (AI)** atau Kecerdasan Buatan adalah bidang ilmu komputer yang bertujuan menciptakan perangkat lunak atau mesin yang mampu berpikir, belajar, dan memecahkan masalah menyerupai kecerdasan manusia: 😊\n\n**Bagaimana AI Bekerja?**\n1. **Data Training**: Model AI dilatih dengan jutaan data (teks, gambar, audio, atau angka) untuk mengenali pola.\n2. **Machine Learning & Neural Networks**: Algoritma pembelajaran mesin menggunakan jaringan saraf tiruan yang terinspirasi dari struktur otak manusia untuk membuat prediksi atau keputusan yang akurat.\n3. **Natural Language Processing (NLP)**: Memungkinkan AI memahami dan menjawab bahasa manusia (seperti asisten yang sedang Anda ajak bicara ini).\n\n**Penerapan di Dunia Nyata:**\nAsisten virtual, diagnosa medis, mobil otonom, sistem penerjemah, dan otomatisasi pertanian cerdas (*smart agriculture*).\n\nDi LPI Nurul Huda Kapedi, santri dibimbing agar cakap literasi digital dan komputasi sehingga mampu memanfaatkan teknologi secara bijak dan produktif. Ada aspek teknologi tertentu yang ingin kita diskusikan? 🙏😊`,
      sources: ['Wawasan Teknologi & AI', 'Kurikulum Literasi Digital']
    };
  }

  if (/\b(robotik|robotika|cara membuat robot|belajar robot)\b/i.test(raw)) {
    return {
      reply: `**Robotika** adalah cabang teknologi yang memadukan teknik mesin, elektronika, dan ilmu pemrograman komputer untuk menciptakan mesin otomatis (robot) yang dapat membantu pekerjaan manusia: 😊\n\n**Komponen Utama Robot:**\n1. **Sensor**: Berfungsi sebagai 'indra' robot (contoh: sensor ultrasonik untuk jarak, sensor inframerah untuk garis, atau kamera visual).\n2. **Controller (Otak Robot)**: Mikrokontroler seperti Arduino, Raspberry Pi, atau ESP32 yang memproses instruksi logika program.\n3. **Aktuator (Otot Robot)**: Motor servo, motor DC, atau pneumatik yang mengubah sinyal listrik menjadi gerakan mekanis.\n4. **Power Supply**: Baterai atau sumber energi untuk menghidupkan seluruh sistem.\n\nDi LPI Nurul Huda, pembinaan robotik dan computational thinking menjadi salah satu program unggulan untuk melatih daya cipta dan daya nalar santri sejak dini. 🙏😊`,
      sources: ['Kurikulum Robotika & Teknologi LPI Nurul Huda']
    };
  }

  if (/\b(coding|pemrograman|bahasa pemrograman|belajar coding|belajar programmer)\b/i.test(raw)) {
    return {
      reply: `**Coding** adalah proses menulis instruksi dalam bahasa komputer agar perangkat lunak dapat menjalankan tugas tertentu: 😊\n\n**Rekomendasi Langkah Awal Belajar Coding:**\n1. **Pahami Logika Dasar (Algoritma)**: Urutan langkah terstruktur dalam memecahkan masalah (percabangan *if-else*, perulangan *loops*, variabel, fungsi).\n2. **Pilih Bahasa yang Ramah Pemula**:\n   - **Python**: Sangat bersih, mudah dibaca, banyak digunakan untuk sains data dan AI.\n   - **JavaScript / HTML / CSS**: Pondasi utama pembuatan website interaktif modern.\n   - **C / C++**: Sangat baik untuk memahami dasar memori komputer dan pemrograman mikrokontroler robotika.\n3. **Praktik Proyek Nyata**: Mulai dari proyek kecil seperti kalkulator, game tebak angka, atau website portofolio sederhana.\n\nDi lingkungan pendidikan kami, santri diarahkan untuk menguasai keterampilan digital agar siap berkarya di era teknologi modern. Tertarik membuat proyek coding tertentu? 🙏😊`,
      sources: ['Wawasan Pemrograman & Ilmu Komputer']
    };
  }

  // 7. TIPS BELAJAR, TAHFIDZ & PENULISAN ESAI
  // 7a. Menulis Esai & Karya Tulis Ilmiah
  if (/\b(cara menulis esai|tips esai|struktur esai|karya tulis ilmiah|membuat esai|menang lomba esai|tulis esai)\b/i.test(raw)) {
    return {
      reply: `Menulis esai kompetisi yang berkualitas dan berpotensi juara memerlukan struktur berpikir yang teratur dan bahasa yang tajam: 😊\n\n**1. Judul yang Menarik & Solutif**\nBuat judul yang memadukan isu nyata dan tawaran solusi konkret (contoh judul siswi kami: *"Santri Digital untuk Madura Sehat: Inovasi Atmospheric Water Generator (AWG)"*).\n\n**2. Pendahuluan (Introduction)**\n- Mulai dengan latar belakang masalah (*hook*) didukung data valid atau fakta lapangan.\n- Tunjukkan urgensi mengapa masalah tersebut harus segera dipecahkan.\n- Sampaikan *thesis statement* gagasan inovasi Anda secara ringkas dan lugas.\n\n**3. Isi / Pembahasan (Body Paragraphs)**\n- Uraikan cara kerja, keunggulan teknis, dan kebaruan (*novelty*) dari solusi Anda.\n- Jelaskan analisis kelayakan implementasi praktis dan dampak sosial/ekonomi bagi masyarakat.\n\n**4. Penutup & Kesimpulan (Conclusion)**\n- Rangkum esensi gagasan tanpa sekadar mengulang kalimat pendahuluan.\n- Berikan rekomendasi langkah strategis ke depan (*call to action*).\n\n**5. Daftar Pustaka (References)**\n- Gunakan rujukan ilmiah yang kredibel (jurnal, buku rujukan, data resmi BPS/kementerian).\n\nApakah Anda sedang mempersiapkan esai untuk perlombaan tertentu? Saya siap membantu mendiskusikan atau menelaah kerangka ide Anda! 🙏😊`,
      sources: ['Bimbingan Esai MAFIA FEST', 'Karya Tulis Santri Nurul Huda']
    };
  }

  // 7b. Tips Menghafal Al-Qur'an (Tahfidz) & Belajar
  if (/\b(tahfidz|tahfidzul quran|menghafal (al[- ]?qur['’]?an|quran)|tips menghafal|cara menghafal|menghafal cepat)\b/i.test(raw)) {
    return {
      reply: `Menghafal Al-Qur'an (*Tahfidzul Qur'an*) adalah ikhtiar mulia yang membutuhkan keikhlasan, kesabaran, dan metode yang disiplin: 😊\n\n**Metode Tahfidz yang Terbukti Efektif di Pesantren:**\n1. **Sabaq (Hafalan Baru)**: Menyetorkan hafalan ayat-ayat baru yang telah dimantapkan dengan membacanya berulang-ulang minimal 20–40 kali sebelum disetorkan kepada ustadz/ustadzah.\n2. **Sabqi (Muroja'ah Hafalan Baru)**: Mengulang hafalan baru yang disetorkan beberapa hari terakhir agar benar-benar melekat di ingatan jangka pendek menuju ingatan jangka panjang.\n3. **Manzil (Muroja'ah Keseluruhan)**: Jadwal rutin memutar seluruh juz hafalan yang telah dimiliki secara berkala agar tidak hilang (*mutqin*).\n4. **Gunakan Satu Jenis Mushaf**: Mempertahankan satu mushaf standar (misalnya Mushaf Pojok/Madinah) sangat membantu memori visual otak mengingat letak baris dan halaman ayat.\n5. **Pahami Makna Ayat**: Membaca terjemah dan mengetahui keterkaitan kisah membuat ingatan ayat jauh lebih kokoh.\n6. **Jaga Hati & Amal Shalih**: Imam Syafi'i mengingatkan bahwa ilmu adalah cahaya, dan cahaya Allah tidak akan dianugerahkan kepada pelaku maksiat.\n\nDi LPI Nurul Huda, program tahfidz Juz 30 hingga lanjutan dibimbing secara terstruktur dengan lingkungan yang kondusif. Semoga Allah memudahkan langkah Anda! 🙏😊`,
      sources: ['Metode Tahfidz Pesantren', 'Karakter Keagamaan LPI Nurul Huda']
    };
  }

  if (/\b(tips belajar|cara belajar|fokus belajar|cara konsentrasi|metode belajar|pomodoro|feynman)\b/i.test(raw)) {
    return {
      reply: `Berikut beberapa metode belajar berbasis sains kognitif yang terbukti meningkatkan daya ingat dan pemahaman: 😊\n\n1. **Teknik Pomodoro (Manajemen Fokus)**: Belajar dengan konsentrasi penuh selama 25 menit, lalu istirahat 5 menit. Ulangi 4 siklus sebelum istirahat panjang 15–30 menit. Cara ini mencegah kelelahan otak dan menjaga ketajaman konsentrasi.\n2. **Feynman Technique (Mengajar untuk Belajar)**: Pelajari suatu topik, lalu jelaskan materi tersebut dengan bahasa sederhana Anda sendiri seolah sedang menerangkannya kepada anak kecil. Jika ada bagian yang tersendat, di situlah celah pemahaman yang perlu dipelajari kembali.\n3. **Active Recall & Spaced Repetition**: Jangan hanya membaca ulang (*passive reading*), melainkan ujilah diri sendiri dengan menjawab pertanyaan latihan tanpa melihat catatan, lalu ulangi kuis tersebut dengan jeda hari (1 hari, 3 hari, 7 hari).\n4. **Atur Lingkungan Belajar**: Jauhkan notifikasi gawai (*smartphone*) yang mengganggu saat sesi belajar, pastikan pencahayaan cukup, dan jaga asupan air minum.\n\nKombinasi metode yang tepat akan membuat belajar terasa lebih ringan dan produktif. Semoga proses belajar Anda lancar dan sukses! 🙏😊`,
      sources: ['Metode Belajar Efektif & Neurosains Kognitif']
    };
  }

  // 8. KEISLAMAN UMUM
  // 8a. Rukun Iman
  if (/\b(rukun iman)\b/i.test(raw)) {
    return {
      reply: `Dalam ajaran Islam, **Rukun Iman** ada 6 (enam) pilar keyakinan yang wajib diyakini dengan sepenuh hati oleh setiap Muslim: 😊\n\n1. **Iman kepada Allah SWT**: Meyakini keberadaan, keesaan, dan sifat-sifat kesempurnaan Allah SWT sebagai satu-satunya pencipta alam semesta.\n2. **Iman kepada Malaikat-Malaikat Allah**: Meyakini keberadaan para malaikat sebagai makhluk taat yang diciptakan dari cahaya dan menjalankan tugas dari Allah.\n3. **Iman kepada Kitab-Kitab Allah**: Meyakini kitab-kitab suci yang diturunkan kepada para Rasul (Taurat, Zabur, Injil, dan Al-Qur'an sebagai kitab penyempurna sepanjang zaman).\n4. **Iman kepada Rasul-Rasul Allah**: Meyakini para nabi dan rasul utusan Allah yang membawa petunjuk dan teladan akhlak bagi umat manusia.\n5. **Iman kepada Hari Akhir (Hari Kiamat)**: Meyakini adanya hari kehancuran alam semesta, hari kebangkitan, hisab amal, serta surga dan neraka.\n6. **Iman kepada Qada dan Qadar**: Meyakini bahwa segala ketentuan baik maupun buruk telah ditetapkan dalam takdir dan hikmah kebijaksanaan Allah SWT.\n\nDi LPI Nurul Huda Kapedi, penanaman akidah ini menjadi pondasi karakter utama sejak usia dini. Semoga bermanfaat! 🙏😊`,
      sources: ['Khazanah Akidah Islam', 'Pendidikan Agama Islam']
    };
  }

  // 8b. Rukun Islam
  if (/\b(rukun islam)\b/i.test(raw)) {
    return {
      reply: `**Rukun Islam** terdiri dari 5 (lima) pilar utama yang menjadi pondasi amal ibadah praktis seorang Muslim: 😊\n\n1. **Mengucapkan Dua Kalimat Syahadat**: Bersaksi dengan lisan dan hati bahwa tiada Tuhan selain Allah dan Nabi Muhammad adalah utusan Allah (*Asyhadu an laa ilaaha illallaah wa asyhadu anna Muhammadan rasuulullaah*).\n2. **Mendirikan Sholat**: Melaksanakan sholat fardhu lima waktu (Dzuhur, Ashar, Maghrib, Isya, dan Subuh) sehari semalam.\n3. **Menunaikan Zakat**: Mengeluarkan sebagian harta yang telah mencapai nisab dan haul bagi orang-orang yang berhak menerimanya (*mustahiq*).\n4. **Berpuasa di Bulan Ramadhan**: Menahan diri dari makan, minum, dan perkara yang membatalkan dari terbit fajar hingga terbenam matahari dengan niat beribadah.\n5. **Menunaikan Ibadah Haji**: Melaksanakan rukun haji ke Baitullah di Makkah bagi yang mampu secara fisik, mental, dan finansial.\n\nSemoga kita senantiasa diberi keistiqamahan untuk menyempurnakan amal ibadah sehari-hari. 🙏`,
      sources: ['Khazanah Fiqh Islam', 'Pendidikan Agama Islam']
    };
  }

  // 8c. Sholat & Wudhu
  if (/\b(rukun sholat|rukun shalat|tata cara sholat|bacaan sholat|waktu sholat)\b/i.test(raw)) {
    return {
      reply: `Berdasarkan kajian fiqh mazhab Syafi'i yang diajarkan di pesantren, **Rukun Sholat** terbagi menjadi rukun qauliyah (ucapan), fi'liyah (gerakan), dan qalbiyah (hati). Terdapat 13 rukun utama: 😊\n\n1. **Niat** di dalam hati berbarengan dengan takbiratul ihram.\n2. **Berdiri tegak** bagi yang mampu.\n3. **Takbiratul Ihram** (mengucapkan *Allahu Akbar*).\n4. **Membaca Surat Al-Fatihah** secara tartil pada setiap rakaat.\n5. **Ruku'** dengan thuma'ninah (diam sejenak).\n6. **I'tidal** (bangkit dari ruku') dengan thuma'ninah.\n7. **Sujud dua kali** pada setiap rakaat dengan thuma'ninah.\n8. **Duduk di antara dua sujud** dengan thuma'ninah.\n9. **Duduk tasyahud akhir**.\n10. **Membaca bacaan tasyahud akhir**.\n11. **Membaca shalawat kepada Nabi Muhammad SAW** pada tasyahud akhir.\n12. **Mengucapkan salam pertama**.\n13. **Tertib** (melaksanakan rukun-rukun di atas secara berurutan).\n\nDi lingkungan santri Nurul Huda, pembiasaan sholat berjamaah dan pendalaman fiqh sholat dipraktikkan langsung setiap hari. 🙏😊`,
      sources: ['Kajian Fiqh Ibadah', 'Pendidikan Agama Islam']
    };
  }

  if (/\b(rukun wudhu|cara wudhu|tata cara wudhu|batal wudhu)\b/i.test(raw)) {
    return {
      reply: `Berdasarkan fiqh Islam, **Rukun Wudhu** ada 6 (enam) perkara wajib yang harus dipenuhi: 😊\n\n1. **Niat** berwudhu saat pertama kali membasuh muka.\n2. **Membasuh seluruh wajah** secara merata (dari batas rambut kepala hingga dagu, dan dari telinga kanan ke telinga kiri).\n3. **Membasuh kedua tangan sampai siku** (termasuk sela-sela jari tangan).\n4. **Mengusap sebagian rambut atau kulit kepala**.\n5. **Membasuh kedua kaki sampai mata kaki** (termasuk sela-sela jari kaki).\n6. **Tertib** (melakukan secara berurutan sesuai urutan di atas).\n\nAdapun berkumur, membasuh hidung, dan mengusap kedua telinga merupakan amalan sunnah yang sangat dianjurkan untuk menyempurnakan pahala wudhu. 🙏😊`,
      sources: ['Kajian Fiqh Bersuci (Thaharah)']
    };
  }

  // 8d. Adab Menuntut Ilmu
  if (/\b(adab menuntut ilmu|adab belajar|menghormati guru|ta'limul muta'allim)\b/i.test(raw)) {
    return {
      reply: `Sebagaimana diajarkan dalam kitab klasik *Ta'limul Muta'allim*, ada adab-adab mulia dalam menuntut ilmu agar ilmu yang didapat membawa berkah dan kemanfaatan: 😊\n\n1. **Meluruskan Niat**: Niat ikhlas karena Allah, berniat mengangkat kebodohan dari diri sendiri, serta berniat mengamalkannya bagi kebaikan umat.\n2. **Memuliakan Guru (Kiai/Ustadz)**: Menjaga sopan santun dalam bersikap dan berbicara, tidak menyela ucapan guru, serta senantiasa mendoakan kebaikan bagi guru.\n3. **Sabar & Bersungguh-sungguh (*Mujahadah*)**: Menuntut ilmu adalah proses panjang yang membutuhkan ketabahan dalam menghadapi ujian belajar.\n4. **Menjauhi Maksiat & Menjaga Hati**: Ilmu adalah nur (cahaya) Allah SWT, dan nur Allah tidak akan bersemayam di dalam hati yang dikotori maksiat.\n5. **Menghormati Buku & Sarana Belajar**: Menjaga kitab dan buku dengan baik, tidak meletakkannya di tempat sembarangan.\n\nNilai-nilai luhur kepesantrenan inilah yang senantiasa dihidupkan di LPI Nurul Huda Kapedi. 🙏`,
      sources: ['Kitab Ta\'limul Muta\'allim', 'Pendidikan Karakter Santri']
    };
  }

  // 9. KEUNGGULAN & ALASAN MEMILIH NURUL HUDA
  if (/\b(keunggulan|kelebihan|istimewa|alasan memilih|kenapa memilih|kenapa harus (sekolah di |masuk )?nurul huda|mengapa memilih nurul huda|apa keunggulan nurul huda)\b/i.test(raw)) {
    return {
      reply: `Yayasan Pendidikan Islam Nurul Huda Kapedi memiliki berbagai keunggulan istimewa yang menjadikannya pilihan tepat bagi masa depan putra-putri Anda: 😊\n\n1. **Integrasi Imtaq & Iptek**: Memadukan kurikulum nasional dan nilai-nilai akidah serta akhlakul karimah khas pesantren dengan penguasaan teknologi digital dan robotika sejak usia muda.\n2. **Program Keahlian Terapan SMK**: SMK Nurul Huda Sasar memiliki program keahlian unggulan **Agribisnis Ternak** yang berorientasi wirausaha mandiri dan dibekali keterampilan teknologi tepat guna.\n3. **Prestasi Sains & Riset Santri Terbukti Nyata**: Santri kami berhasil meraih **Juara 1 Tingkat Nasional di UNISMA Malang** lewat inovasi teknologi tepat guna *Atmospheric Water Generator (AWG)* untuk memanen air bersih dari udara, serta inovasi *WATERFLOW*.\n4. **Tahfidzul Qur'an & Pembiasaan Ibadah Harian**: Pembinaan hafalan Al-Qur'an terstruktur, pembiasaan sholat berjamaah lima waktu, sholat dhuha, tartilul Qur'an, dan kajian kitab kuning.\n5. **Fasilitas Lengkap & Pilihan Fleksibel**: Menyediakan asrama pesantren 24 jam bagi yang ingin bermukim (mondok), namun tetap terbuka luas bagi siswa reguler yang pulang-pergi.\n6. **Biaya Sangat Terjangkau & Program Beasiswa**: Yayasan berkomitmen memberikan akses pendidikan bermutu dengan biaya ramah masyarakat, didukung beasiswa prestasi, beasiswa tahfidz, dan santunan yatim/prasejahtera.\n\nApakah ada hal khusus terkait jenjang pendidikan atau pendaftaran yang ingin Anda tanyakan lebih lanjut? Kami siap membantu! 🙏😊`,
      sources: ['Profil Keunggulan Lembaga', 'Prestasi Santri & Kurikulum']
    };
  }

  // 10. PPDB (Penerimaan Peserta Didik Baru) & Biaya
  const isPpdbQuery = /\b(ppdb|spmb|pendaftaran siswa|pendaftaran murid|pendaftaran santri|daftar siswa|daftar murid|daftar santri|syarat masuk|persyaratan masuk)\b/i.test(raw) ||
    (/\b(biaya|spp|tarif|uang masuk|syarat pendaftaran|persyaratan pendaftaran|berkas pendaftaran|jadwal pendaftaran|formulir pendaftaran|brosur pendaftaran)\b/i.test(raw) &&
     /\b(sekolah|pendidikan|masuk|sdi|smpi|smk|tk|paud|santri|murid|siswa|ajaran baru|ppdb|spmb|daftar)\b/i.test(raw) &&
     !/\b(sewa|helikopter|pesawat|mobil|motor|hotel|lapangan golf|nuklir|kapal)\b/i.test(raw)) ||
    (/\b(syarat|persyaratan|formulir|brosur|jadwal)\b/i.test(raw) && /\b(ppdb|spmb|pendaftaran|daftar baru)\b/i.test(raw));

  if (isPpdbQuery) {
    return {
      reply: `Terima kasih atas minat Bapak/Ibu/Kakak untuk bergabung dengan keluarga besar LPI Nurul Huda Kapedi. 😊\n\nBerikut rincian resmi terkait Penerimaan Peserta Didik Baru (PPDB / SPMB):\n\n**1. Jadwal & Waktu Pelayanan**\n- Pendaftaran dibuka setiap tahun ajaran baru, dengan gelombang pendaftaran resmi berlangsung mulai **01 Mei hingga 31 Juni**.\n- Pelayanan dibuka setiap hari kerja (Senin s.d. Sabtu) pukul **07.00 – 14.00 WIB** bertempat di kantor sekretariat panitia di Dusun Sasar, Desa Kapedi, Bluto, Sumenep.\n\n**2. Persyaratan Berkas per Jenjang**\n- **SDI Nurul Huda**: Mengisi formulir pendaftaran, Fotokopi Akta Kelahiran, Fotokopi Kartu Keluarga (KK), dan Pas foto 3x4 (3 lembar).\n- **SMPI Nurul Huda**: Mengisi formulir pendaftaran, Fotokopi Ijazah / SKL (2 lembar), Fotokopi KK & Akta Kelahiran, dan Pas foto 3x4 (3 lembar).\n- **SMK Nurul Huda Sasar (Agribisnis Ternak)**: Mengisi formulir pendaftaran, Fotokopi Ijazah / SKL (2 lembar), Fotokopi KK & Akta Kelahiran, dan Pas foto 3x4 (3 lembar).\n\n**3. Biaya Pendidikan & Program Keringanan**\nBiaya pendaftaran dan SPP dirancang sangat terjangkau bagi masyarakat. Yayasan juga menyediakan program beasiswa prestasi, beasiswa tahfidz Al-Qur'an, serta bantuan keringanan bagi anak yatim dan keluarga prasejahtera.\n\n**4. Kontak Layanan Panitia PPDB**\n- **Bapak Abu Rizal**: +62 815-5400-8683\n- **Bapak Ach Roni**: +62 857-4866-3415\n\nBapak/Ibu juga dapat mengakses menu [PPDB](ppdb.html) di website ini untuk mengunduh brosur resmi. Kami siap menyambut kehadiran putra-putri Anda! 🙏😊`,
      sources: ['Arsip Resmi PPDB LPI Nurul Huda', 'Panitia Penerimaan Santri Baru']
    };
  }

  // 11. Asrama & Kepesantrenan (Wajib mondok / pulang-pergi)
  if (/\b(asrama|mondok|pondok|pesantren|wajib mondok|pulang pergi|mukim|santri|kamar tidur|makan di pondok)\b/i.test(raw)) {
    return {
      reply: `Terkait sistem asrama dan kepesantrenan di LPI Nurul Huda Kapedi, berikut penjelasannya: 😊\n\n- **Pilihan Fleksibel**: Siswa **tidak diwajibkan** untuk bermukim di asrama. Siswa diperbolehkan memilih antara menjadi **santri mukim** (tinggal di asrama pesantren) atau **siswa reguler** (pulang-pergi ke rumah bagi yang berdomisili dekat di sekitar Bluto/Sumenep).\n- **Bimbingan Asrama 24 Jam**: Bagi santri yang mukim di asrama, tersedia pendampingan intensif dari para ustadz dan ustadzah untuk pembiasaan sholat fardhu berjamaah, tahfidzul Qur'an, bimbingan belajar malam, dan kajian kitab kuning.\n- **Fasilitas Asrama**: Kamar santri yang memadai, masjid/musholla ibadah, dapur santri, serta lingkungan yang asri, aman, dan religius di Dusun Sasar, Desa Kapedi, Bluto, Sumenep.\n\nBapak/Ibu dipersilakan berkunjung langsung untuk melihat suasana asrama kami saat jam kerja. Kami siap menyambut Anda. 🙏😊`,
      sources: ['Buku Panduan Asrama Pesantren', 'Sekretariat Yayasan']
    };
  }

  // 12. Beasiswa & Keringanan Biaya
  if (/\b(beasiswa|keringanan|bantuan|yatim|piatu|prasejahtera|gratis|potongan biaya|beasiswa tahfidz)\b/i.test(raw)) {
    return {
      reply: `Yayasan Pendidikan Islam Nurul Huda Kapedi berkomitmen agar pendidikan berkualitas dapat diakses oleh seluruh lapisan masyarakat tanpa terkendala biaya: 😊\n\n1. **Beasiswa Prestasi Akademik & Non-Akademik**: Diberikan kepada siswa/santri yang memiliki catatan prestasi lomba tingkat kabupaten, provinsi, maupun nasional, serta peringkat kelas yang membanggakan.\n2. **Beasiswa Tahfidzul Qur'an**: Apresiasi dan beasiswa khusus bagi siswa/santri yang memiliki hafalan Al-Qur'an (Juz 30 atau lebih).\n3. **Santunan Anak Yatim & Keluarga Prasejahtera**: Yayasan memberikan kemudahan dan keringanan biaya pendidikan bagi anak yatim/piatu serta keluarga yang membutuhkan bantuan finansial.\n\nUntuk konsultasi pengajuan beasiswa atau keringanan biaya, Bapak/Ibu dapat langsung menghubungi sekretariat panitia di WhatsApp [+62 815-5400-8683](https://wa.me/6281554008683). Kami siap membantu dengan sepenuh hati. 🙏😊`,
      sources: ['Kebijakan Beasiswa Yayasan', 'Sekretariat PPDB']
    };
  }

  // 13. Unit Pendidikan & Jurusan SMK
  const isUnitQuery = /\b(unit pendidikan|jenjang pendidikan|tingkat pendidikan|ada unit apa|sekolah apa saja|ada sekolah apa|daftar sekolah|jurusan apa|program keahlian|ada smk apa|ada smp apa)\b/i.test(raw) ||
    (/\b(smk|sdi|smpi|paud|tk)\b/i.test(raw) && !/\b(daftar|biaya|syarat|persyaratan|ppdb|spmb)\b/i.test(raw));

  if (isUnitQuery) {
    return {
      reply: `Dengan senang hati kami jelaskan unit-unit pendidikan yang dikelola oleh Yayasan Nurul Huda Kapedi. 😊\n\nLembaga kami menaungi 5 jenjang pendidikan formal yang terintegrasi dan berkesinambungan:\n\n1. **PAUD Nurul Huda**: Pendidikan usia dini yang berfokus pada stimulasi tumbuh kembang anak secara menyeluruh berlandaskan nilai-nilai islami.\n2. **TK Islam Nurul Huda**: Pembelajaran taman kanak-kanak berbasis fitrah yang menyenangkan, membiasakan adab mulia, hafalan surat pendek, serta doa harian.\n3. **SDI Nurul Huda (Sekolah Dasar Islam)**: Memadukan kurikulum nasional dengan kurikulum kepesantrenan, pembiasaan sholat dhuha dan dzuhur berjamaah, tahfidz Juz 30, serta pengenalan dasar teknologi komputer.\n4. **SMPI Nurul Huda Kapedi (Sekolah Menengah Pertama Islam)**: Menitikberatkan pada pembinaan karakter remaja, pendalaman sains terpadu, tahfidz Al-Qur'an, penguasaan bahasa asing dasar, dan kepemimpinan.\n5. **SMK Nurul Huda Sasar**: Sekolah kejuruan berbasis keterampilan terapan dengan program keahlian unggulan **Agribisnis Ternak**, yang diperkuat inovasi teknologi digital, robotik, dan pembekalan wirausaha mandiri.\n\nSeluruh unit berada dalam satu lingkungan yang harmonis di Kapedi, Bluto, Sumenep. Apakah ada jenjang tertentu yang ingin Anda ketahui lebih mendalam? 🙏`,
      sources: ['Data Unit Pendidikan LPI Nurul Huda', 'Kurikulum Yayasan']
    };
  }

  // 14. Prestasi Siswa & Santri (UNISMA, AWG, WATERFLOW, Lomba Regional)
  if (/\b(prestasi|juara|lomba|penghargaan|unisma|pemenang|awg|waterflow|zakiya|isyatul|mafia fest)\b/i.test(raw)) {
    return {
      reply: `Alhamdulillah, siswa dan santri LPI Nurul Huda Kapedi senantiasa didorong untuk berprestasi dan telah menorehkan berbagai capaian membanggakan, antara lain: 😊\n\n**1. Prestasi Tingkat Nasional (MAFIA FEST di Universitas Islam Malang / UNISMA)**\n- **Zakiya Amilatul Jannah** (Siswi SMK Nurul Huda Sasar): Meraih **Juara 1 Tingkat Nasional** dalam Lomba Menulis Esai melalui karya inovasi berjudul *"Santri Digital untuk Madura Sehat: Inovasi Atmospheric Water Generator (AWG)"*.\n- **Isyatul Munawwaroh** (Siswi SMK Nurul Huda Sasar): Meraih **Juara Harapan 1 Tingkat Nasional** melalui karya esai inovatif *"WATERFLOW: Smart Reservoir Berbasis Local Wisdom"*.\n\n**2. Ajang Perlombaan & Persahabatan Regional Se-Madura**\n- Meraih predikat sebagai **Juara Lembaga Favorit** se-Madura.\n- **Juara 1 Olimpiade PAI**: diraih oleh Syifa Fauziah (dan Juara 3 oleh Arifatul Maulida).\n- **Juara 2 Tartilul Qur'an**: diraih oleh Lu'luatul Mahbubah.\n- **Juara 1 Shalawat Dibaiyah**: diraih oleh Thoriqil Mustaqim.\n- **Juara 2 Kaligrafi**: diraih oleh Aisyahtul Munawaroh.\n- **Juara 1 Mewarnai**: diraih oleh Tiara Syarifah Putri.\n\nPrestasi ini membuktikan bahwa pendidikan di lembaga kami memadukan kemampuan akademis, kreativitas sains modern, dan ketakwaan religius secara seimbang. 🙏😊`,
      sources: ['Dokumen Prestasi Resmi Siswa', 'MAFIA FEST UNISMA Malang']
    };
  }

  // 15. Visi, Misi, Sejarah, Pendiri & Pimpinan
  if (/\b(visi|misi|tujuan|sejarah|berdiri|pendiri|pimpinan|ketua yayasan|kepala yayasan|tahun berdiri)\b/i.test(raw)) {
    return {
      reply: `Dengan senang hati kami sampaikan profil dan orientasi Yayasan Pendidikan Islam Nurul Huda Kapedi: 😊\n\n**Sejarah & Pimpinan**\nLembaga kami didirikan sejak tahun **1998** dan diresmikan secara hukum yayasan pada tahun **2013** di bawah kepemimpinan **K. Minhaji**. Berlokasi di Dusun Sasar, Desa Kapedi, Kecamatan Bluto, Kabupaten Sumenep, yayasan hadir untuk menjawab kebutuhan masyarakat akan pendidikan berkualitas yang berakar pada nilai-nilai kepesantrenan.\n\n**Visi Lembaga**\n"Menjadi lembaga pendidikan Islam terpadu yang unggul dalam mencetak generasi bertakwa, berakhlak mulia, menguasai IPTEK, dan berdaya saing di era digital."\n\n**Misi Utama**\n1. Mengintegrasikan kurikulum formal sekolah dengan nilai-nilai keagamaan khas pesantren untuk membentuk akhlakul karimah.\n2. Mengembangkan potensi siswa di bidang teknologi informasi, inovasi digital, serta robotik sejak usia muda.\n3. Menyelenggarakan pelatihan vokasional berbasis praktik yang relevan dengan kebutuhan industri modern.\n4. Mendorong kreativitas siswa agar mampu menjadi kreator dan pencipta karya yang produktif dan bermanfaat.\n\nJika ada hal lain yang ingin Bapak/Ibu ketahui, kami siap melayani dengan senang hati. 🙏`,
      sources: ['Profil Sejarah Lembaga', 'Akta Yayasan 2013']
    };
  }

  // 16. Kurikulum & Metode Pembelajaran
  if (/\b(kurikulum|metode belajar di sekolah|kurikulum merdeka|pembelajaran di sekolah)\b/i.test(raw)) {
    return {
      reply: `Kurikulum di LPI Nurul Huda Kapedi dirancang secara terpadu (*Integrated Islamic Curriculum*): 😊\n\n1. **Kurikulum Nasional (Kurikulum Merdeka)**: Mengedepankan pembelajaran berdiferensiasi, penguatan literasi dan numerasi, serta Projek Penguatan Profil Pelajar Pancasila (P5).\n2. **Kurikulum Pesantren & Karakter**: Penanaman akidah ahlussunnah wal jama'ah, fiqh ibadah praktis, pembiasaan adab islami, serta program tahfidzul Qur'an.\n3. **Muatan Vokasi & Digital**: Pengenalan komputer dan logika robotik sejak tingkat dasar/menengah, serta pemaduan teknologi modern pada program Agribisnis Ternak di SMK Nurul Huda Sasar.\n\nPerpaduan ini memastikan peserta didik tidak hanya unggul secara akademis, namun juga memiliki akhlak yang mulia. 🙏😊`,
      sources: ['Panduan Kurikulum Terpadu LPI Nurul Huda']
    };
  }

  // 17. Fasilitas Kampus
  if (/\b(fasilitas|lab komputer|sarana olahraga|lapangan|musholla|perpustakaan kampus)\b/i.test(raw)) {
    return {
      reply: `Untuk menunjang kenyamanan dan efektivitas proses belajar mengajar, LPI Nurul Huda Kapedi menyediakan fasilitas terpadu, antara lain: 😊\n\n- **Masjid dan Musholla**: Sarana ibadah yang representatif untuk pembiasaan sholat berjamaah, kajian keislaman, dan pembinaan rohani harian.\n- **Laboratorium Komputer**: Dilengkapi perangkat komputer dan akses internet untuk pembelajaran literasi digital, desain, dan robotik.\n- **Perpustakaan**: Menyediakan beragam buku teks pelajaran umum, referensi keagamaan Islam, dan ensiklopedia ilmu pengetahuan.\n- **Sarana Olahraga**: Lapangan multifungsi untuk kegiatan olahraga, bela diri, dan upacara.\n- **Asrama / Pondok Pesantren**: Bagi santri yang memilih bermukim (mondok), tersedia asrama dengan bimbingan dan pendampingan ustadz/ustadzah selama 24 jam.\n- **Sarana Praktik Vokasional**: Lahan dan unit praktik khusus untuk siswa SMK dalam pendalaman agribisnis dan teknologi terapan.\n\nBapak/Ibu dipersilakan untuk berkunjung langsung melihat fasilitas kami pada jam kerja. 🙏😊`,
      sources: ['Inventaris Fasilitas Kampus', 'Buku Panduan Lembaga']
    };
  }

  // 18. Kontak & Alamat
  if (/\b(kontak|alamat|lokasi|nomor wa|nomor telepon|wa admin|whatsapp admin|email resmi|lokasi sekolah|dimana alamat)\b/i.test(raw)) {
    return {
      reply: `Dengan senang hati kami sampaikan informasi alamat dan saluran komunikasi resmi LPI Nurul Huda Kapedi: 😊\n\n- **Alamat Kantor**: Jl. Utara Masjid Sumber, Dusun Sasar, Desa Kapedi, Kecamatan Bluto, Kabupaten Sumenep, Madura, Jawa Timur 69461.\n- **WhatsApp / Telepon Layanan**: [${institution.whatsapp}](https://wa.me/6281554008683) (Respon cepat pada jam kerja).\n- **Email Resmi**: ${institution.email}\n- **Instagram**: [@osdaka_ynh](https://www.instagram.com/osdaka_ynh)\n- **YouTube**: [PP Nurul Huda Kapedi](https://youtube.com/@ppnurulhudakapedi)\n- **Lokasi Google Maps**: [Buka Penunjuk Arah Google Maps](https://maps.app.goo.gl/vWHgCBXxvxwLxXwU8)\n\nKantor kami buka melayani tamu setiap hari kerja (Senin s.d. Sabtu) pukul **07.00 – 14.00 WIB**. Kami nantikan kehadiran Anda. 🙏😊`,
      sources: ['Sekretariat Yayasan', 'Direktori Kontak Resmi']
    };
  }

  // 19. Pertanyaan di luar cakupan lembaga (sewa mobil, pesawat, dsb.)
  if (/\b(helikopter|pesawat|kapal|sewa mobil|sewa motor|sewa gedung|hotel|lapangan golf|kolam renang|bioskop|mall)\b/i.test(raw)) {
    return {
      reply: `Terima kasih banyak atas pertanyaan yang Bapak/Ibu/Kakak sampaikan. 😊\n\nMohon maaf sebesar-besarnya, fasilitas atau layanan tersebut **tidak tersedia** di LPI Nurul Huda Kapedi. Lembaga kami adalah yayasan pendidikan Islam yang berfokus menyelenggarakan jenjang PAUD, TK, SDI, SMPI, dan SMK (Agribisnis Ternak) berbasis nilai kepesantrenan dan IPTEK.\n\nJika Bapak/Ibu membutuhkan informasi seputar program sekolah atau ingin berdiskusi mengenai topik sains, pendidikan, dan keislaman, kami siap melayani dengan senang hati! 🙏😊`,
      sources: ['Klarifikasi Ruang Lingkup Layanan']
    };
  }

  // 20. Jika ada chunk relevan dengan skor tinggi dari arsip lembaga
  const chunks = clientRetrieveChunks(query);
  if (chunks.length > 0 && chunks[0].score >= 8) {
    return {
      reply: `Terima kasih atas pertanyaannya. Berdasarkan informasi resmi lembaga terkait **${chunks[0].title}**, berikut penjelasannya: 😊\n\n${chunks[0].content}\n\nApabila Bapak/Ibu/Kakak membutuhkan informasi yang lebih detail mengenai hal ini, silakan menghubungi sekretariat kami melalui WhatsApp di [${institution.whatsapp}](https://wa.me/6281554008683). Kami siap melayani Anda dengan senang hati. 🙏`,
      sources: [chunks[0].title]
    };
  }

  // 21. Pertanyaan Terbuka / Diskusi Ramah Lainnya
  return {
    reply: `Terima kasih banyak atas pertanyaan yang Bapak/Ibu/Kakak sampaikan. 😊\n\nAgar kami dapat memberikan jawaban yang paling tepat dan solutif, mohon perjelas kembali pertanyaan Anda ya:\n\n1. Jika pertanyaan berkaitan dengan **LPI Nurul Huda Kapedi**, Anda dapat menanyakan topik seperti: *keunggulan sekolah*, *syarat pendaftaran PPDB*, *unit pendidikan (PAUD/TK/SDI/SMPI/SMK)*, *jurusan Agribisnis Ternak*, *prestasi nasional*, *asrama/pondok*, *biaya & beasiswa*, atau *kontak sekretariat*.\n2. Jika pertanyaan berkaitan dengan **pengetahuan umum**, kami siap berdiskusi tentang *keislaman (rukun iman/islam/sholat)*, *sains & teknologi (AI, robotik)*, *tips belajar*, atau *panduan menulis esai*.\n\nKami selalu siap membantu dan melayani Bapak/Ibu/Kakak dengan senang hati! 🙏😊`,
    sources: ['Asisten AI Nurul Huda']
  };
}
