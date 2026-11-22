// ============================================================
// assets/js/client-rag.js — Client-Side Smart RAG Engine
// Yayasan Pendidikan Islam Nurul Huda Kapedi
// Runs seamlessly on static hosting (GitHub Pages) & offline
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
      content: "Nilai-Nilai Utama:\n- Berpikir Kreatif & Inovatif: Melatih siswa adaptif menghadapi perkembangan era teknologi.\n- Nilai Produktif: Menanamkan pola pikir bahwa aktivitas digital siswa harus mampu menghasilkan karya atau manfaat nyata.\n- Karakter Akhlakul Karimah: Mengawinkan keahlian IPTEK dengan benteng nilai keagamaan Islam khas pesantren.\n\nProgram Unggulan:\n1. Inovasi Teknologi & Robotik: Mengembangkan bakat teknologi siswa melalui pembuatan robot dan penanaman computational thinking sejak dini.\n2. Kreativitas & Literasi Digital: Mendorong siswa menjadi 'content creator' atau pembuat solusi digital produktif.\n3. Keterampilan Vokasional: Mempersiapkan siswa siap kerja lewat keahlian praktis sesuai kebutuhan dunia usaha dan dunia industri (DUDI)."
    },
    {
      id: "unit-pendidikan",
      category: "unit",
      title: "Unit-Unit Pendidikan di Bawah Yayasan Nurul Huda Kapedi",
      keywords: ["unit", "jenjang", "paud", "tk", "sdi", "smpi", "smk", "sekolah", "sd", "smp", "kejuruan", "jurusan", "agribisnis ternak"],
      content: "Yayasan Nurul Huda Kapedi mengelola 5 jenjang pendidikan formal yang terintegrasi dan berkesinambungan:\n1. PAUD Nurul Huda: Pendidikan Anak Usia Dini untuk tumbuh kembang optimal sejak dini.\n2. TK Islam Nurul Huda: Taman Kanak-Kanak berbasis nilai-nilai Islam dengan pembelajaran yang menyenangkan dan penanaman adab serta doa harian.\n3. SDI Nurul Huda (Sekolah Dasar Islam): Kurikulum nasional dipadukan kurikulum keislaman, tahfidz Al-Qur'an (Juz 30), pembiasaan sholat dhuha & dzuhur berjamaah, serta pengenalan dasar sains dan komputer.\n4. SMPI Nurul Huda Kapedi (Sekolah Menengah Pertama Islam): Fokus pada pembinaan akhlak masa remaja, penguasaan sains terpadu, tahfidz, bahasa asing dasar, dan kepemimpinan.\n5. SMK Nurul Huda Sasar: Sekolah Menengah Kejuruan siap kerja dan wirausaha dengan Program Keahlian unggulan 'Agribisnis Ternak', integrasi sains terapan, serta inovasi teknologi ramah lingkungan."
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
    if (/\b(prestasi|juara|lomba|esai|awg|waterflow)\b/i.test(raw) && doc.category === 'prestasi') score += 15;
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
  const chunks = clientRetrieveChunks(query);
  const institution = CLIENT_KB.institution;

  // 1. Sapaan Murni
  const withoutGreeting = raw.replace(/^(assalamu'?alaikum(\s+warahmatullahi\s+wabarakatuh|\s+wr\s+wb)?|halo|hai|selamat\s+(pagi|siang|sore|malam)|assalamualaikum|permisi)[!.,\s]*/i, '').trim();
  if (withoutGreeting.length === 0) {
    return {
      reply: `Wa'alaikumussalam Warahmatullahi Wabarakatuh. Selamat datang di layanan asisten AI Yayasan Pendidikan Islam Nurul Huda Kapedi. Senang sekali dapat berjumpa dengan Anda hari ini. 😊\n\nSaya adalah asisten digital serbaguna yang siap membantu Anda dalam dua hal utama:\n1. Informasi lengkap seputar LPI Nurul Huda Kapedi (profil, PPDB, unit PAUD/TK/SDI/SMPI/SMK, prestasi, fasilitas, dan kontak).\n2. Diskusi dan wawasan umum seputar pendidikan, teknologi, keislaman, sains, tips belajar, maupun penulisan esai.\n\nAda topik atau informasi apa yang ingin kita bahas bersama hari ini? 🙏`,
      sources: ['Profil Resmi Lembaga']
    };
  }

  // 2. PPDB & Syarat Pendaftaran
  const isPpdbQuery = /\b(ppdb|spmb|pendaftaran siswa|pendaftaran murid|pendaftaran santri|daftar siswa|daftar murid|daftar santri|syarat masuk|persyaratan masuk)\b/i.test(raw) ||
    (/\b(biaya|spp|tarif|uang masuk|syarat pendaftaran|persyaratan pendaftaran|berkas pendaftaran|jadwal pendaftaran|formulir pendaftaran|brosur pendaftaran)\b/i.test(raw) &&
     /\b(sekolah|pendidikan|masuk|sdi|smpi|smk|tk|paud|santri|murid|siswa|ajaran baru|ppdb|spmb|daftar)\b/i.test(raw) &&
     !/\b(sewa|helikopter|pesawat|mobil|motor|hotel|lapangan golf|nuklir|kapal)\b/i.test(raw)) ||
    (/\b(syarat|persyaratan|formulir|brosur|jadwal)\b/i.test(raw) && /\b(ppdb|spmb|pendaftaran|daftar baru)\b/i.test(raw));

  if (isPpdbQuery) {
    return {
      reply: `Terima kasih atas minat Bapak/Ibu/Kakak untuk bergabung dengan keluarga besar LPI Nurul Huda Kapedi. 😊\n\nBerikut rincian resmi terkait Penerimaan Peserta Didik Baru (PPDB / SPMB):\n\n**1. Jadwal & Waktu Pendaftaran**\n- Pendaftaran dibuka setiap tahun ajaran baru, dengan gelombang resmi berlangsung mulai **01 Mei hingga 31 Juni**.\n- Pelayanan dibuka setiap hari kerja pukul **07.00 – 14.00 WIB** bertempat di kantor sekretariat masing-masing jenjang pendidikan di Dusun Sasar, Desa Kapedi, Bluto, Sumenep.\n\n**2. Persyaratan Berkas per Jenjang**\n- **SDI Nurul Huda**: Fotokopi Akta Kelahiran, Fotokopi Kartu Keluarga (KK), Pas foto 3x4 (3 lembar), dan mengisi formulir pendaftaran.\n- **SMPI Nurul Huda**: Fotokopi Ijazah / SKL (2 lembar), Fotokopi KK & Akta Kelahiran, Pas foto 3x4 (3 lembar), dan mengisi formulir pendaftaran.\n- **SMK Nurul Huda Sasar (Agribisnis Ternak)**: Fotokopi Ijazah / SKL (2 lembar), Fotokopi KK & Akta Kelahiran, Pas foto 3x4 (3 lembar), dan mengisi formulir pendaftaran.\n\n**3. Biaya Pendidikan & Keringanan**\nBiaya pendaftaran dan pendidikan sangat terjangkau. Yayasan juga menyediakan program beasiswa prestasi, beasiswa tahfidz Al-Qur'an, serta keringanan bagi anak yatim dan keluarga prasejahtera.\n\n**4. Kontak Layanan Panitia PPDB**\n- **Bapak Abu Rizal**: +62 815-5400-8683\n- **Bapak Ach Roni**: +62 857-4866-3415\n\nBapak/Ibu juga dapat melihat menu [PPDB](ppdb.html) di website ini untuk mengunduh brosur resmi. Kami siap menyambut kehadiran putra-putri Anda. 🙏😊`,
      sources: ['Arsip Resmi PPDB LPI Nurul Huda', 'Panitia Penerimaan Santri Baru']
    };
  }

  // 3. Unit Pendidikan & Jurusan SMK
  const isUnitQuery = /\b(unit pendidikan|jenjang pendidikan|tingkat pendidikan|ada unit apa|sekolah apa saja|ada sekolah apa|daftar sekolah|jurusan apa|program keahlian)\b/i.test(raw) ||
    (/\b(smk|sdi|smpi|paud|tk)\b/i.test(raw) && !/\b(daftar|biaya|syarat|persyaratan|ppdb|spmb)\b/i.test(raw));

  if (isUnitQuery) {
    return {
      reply: `Dengan senang hati kami jelaskan unit-unit pendidikan yang dikelola oleh Yayasan Nurul Huda Kapedi. 😊\n\nLembaga kami menaungi 5 jenjang pendidikan formal yang terintegrasi dan berkesinambungan:\n\n1. **PAUD Nurul Huda**: Pendidikan usia dini yang berfokus pada stimulasi tumbuh kembang anak secara menyeluruh berlandaskan nilai-nilai islami.\n2. **TK Islam Nurul Huda**: Pembelajaran taman kanak-kanak berbasis fitrah yang menyenangkan, membiasakan adab mulia, hafalan surat pendek, serta doa harian.\n3. **SDI Nurul Huda (Sekolah Dasar Islam)**: Memadukan kurikulum nasional dengan kurikulum kepesantrenan, pembiasaan sholat dhuha dan dzuhur berjamaah, tahfidz Juz 30, serta pengenalan dasar teknologi komputer.\n4. **SMPI Nurul Huda Kapedi (Sekolah Menengah Pertama Islam)**: Menitikberatkan pada pembinaan karakter remaja, pendalaman sains terpadu, tahfidz Al-Qur'an, penguasaan bahasa asing dasar, dan kepemimpinan.\n5. **SMK Nurul Huda Sasar**: Sekolah kejuruan berbasis keterampilan terapan dengan program keahlian unggulan **Agribisnis Ternak**, yang diperkuat inovasi teknologi digital, robotik, dan pembekalan wirausaha mandiri.\n\nSeluruh unit berada dalam satu lingkungan yang harmonis di Kapedi, Bluto, Sumenep. Apakah ada jenjang tertentu yang ingin Anda ketahui lebih lanjut? 🙏`,
      sources: ['Data Unit Pendidikan LPI Nurul Huda', 'Kurikulum Yayasan']
    };
  }

  // 4. Prestasi Siswa & Santri (UNISMA, AWG, WATERFLOW)
  if (/\b(prestasi|juara|lomba|esai|penghargaan|unisma|pemenang|awg|waterflow)\b/i.test(raw)) {
    return {
      reply: `Alhamdulillah, siswa dan santri LPI Nurul Huda Kapedi senantiasa didorong untuk berprestasi dan telah menorehkan berbagai capaian membanggakan, antara lain: 😊\n\n**1. Prestasi Tingkat Nasional (MAFIA FEST di Universitas Islam Malang / UNISMA)**\n- **Zakiya Amilatul Jannah** (Siswi SMK Nurul Huda Sasar): Meraih **Juara 1 Tingkat Nasional** dalam Lomba Menulis Esai melalui karya inovasi berjudul *"Santri Digital untuk Madura Sehat: Inovasi Atmospheric Water Generator (AWG)"*.\n- **Isyatul Munawwaroh** (Siswi SMK Nurul Huda Sasar): Meraih **Juara Harapan 1 Tingkat Nasional** melalui karya esai inovatif *"WATERFLOW: Smart Reservoir Berbasis Local Wisdom"*.\n\n**2. Ajang Perlombaan & Persahabatan Regional Se-Madura**\n- Meraih predikat sebagai **Juara Lembaga Favorit** se-Madura.\n- **Juara 1 Olimpiade PAI**: diraih oleh Syifa Fauziah (dan Juara 3 oleh Arifatul Maulida).\n- **Juara 2 Tartilul Qur'an**: diraih oleh Lu'luatul Mahbubah.\n- **Juara 1 Shalawat Dibaiyah**: diraih oleh Thoriqil Mustaqim.\n- **Juara 2 Kaligrafi**: diraih oleh Aisyahtul Munawaroh.\n- **Juara 1 Mewarnai**: diraih oleh Tiara Syarifah Putri.\n\nPrestasi ini membuktikan bahwa pendidikan di lembaga kami memadukan kemampuan akademis, kreativitas sains modern, dan ketakwaan religius secara seimbang. 🙏😊`,
      sources: ['Dokumen Prestasi Resmi Siswa', 'MAFIA FEST UNISMA Malang']
    };
  }

  // 5. Visi, Misi, Sejarah, Pimpinan
  if (/\b(visi|misi|tujuan|sejarah|berdiri|pendiri|pimpinan|ketua yayasan|kepala|tahun)\b/i.test(raw)) {
    return {
      reply: `Dengan senang hati kami sampaikan profil dan orientasi Yayasan Pendidikan Islam Nurul Huda Kapedi: 😊\n\n**Sejarah & Pimpinan**\nLembaga kami didirikan sejak tahun **1998** dan diresmikan secara hukum yayasan pada tahun **2013** di bawah kepemimpinan **K. Minhaji**. Berlokasi di Dusun Sasar, Desa Kapedi, Kecamatan Bluto, Kabupaten Sumenep, yayasan hadir untuk menjawab kebutuhan masyarakat akan pendidikan berkualitas yang berakar pada nilai-nilai kepesantrenan.\n\n**Visi Lembaga**\n"Menjadi lembaga pendidikan Islam terpadu yang unggul dalam mencetak generasi bertakwa, berakhlak mulia, menguasai IPTEK, dan berdaya saing di era digital."\n\n**Misi Utama**\n1. Mengintegrasikan kurikulum formal sekolah dengan nilai-nilai keagamaan khas pesantren untuk membentuk akhlakul karimah.\n2. Mengembangkan potensi siswa di bidang teknologi informasi, inovasi digital, serta robotik sejak usia muda.\n3. Menyelenggarakan pelatihan vokasional berbasis praktik yang relevan dengan kebutuhan industri modern.\n4. Mendorong kreativitas siswa agar mampu menjadi kreator dan pencipta karya yang produktif dan bermanfaat.\n\nJika ada hal lain yang ingin Bapak/Ibu ketahui, kami siap melayani dengan senang hati. 🙏`,
      sources: ['Profil Sejarah Lembaga', 'Akta Yayasan 2013']
    };
  }

  // 6. Fasilitas & Asrama Pesantren
  if (/\b(fasilitas|asrama|mondok|pondok|pesantren|lab|komputer|masjid|perpustakaan)\b/i.test(raw)) {
    return {
      reply: `Untuk menunjang kenyamanan dan efektivitas proses belajar mengajar, LPI Nurul Huda Kapedi menyediakan fasilitas terpadu, antara lain: 😊\n\n- **Masjid dan Musholla**: Sarana ibadah yang representatif untuk pembiasaan sholat berjamaah, kajian keislaman, dan pembinaan rohani harian.\n- **Laboratorium Komputer**: Dilengkapi perangkat komputer dan akses internet untuk pembelajaran literasi digital, desain, dan robotik.\n- **Perpustakaan**: Menyediakan beragam buku teks pelajaran umum, referensi keagamaan Islam, dan ensiklopedia ilmu pengetahuan.\n- **Sarana Olahraga**: Lapangan multifungsi untuk kegiatan olahraga, bela diri, dan upacara.\n- **Asrama / Pondok Pesantren**: Bagi santri yang memilih bermukim (mondok), tersedia asrama dengan bimbingan dan pendampingan ustadz/ustadzah selama 24 jam. (Catatan: Siswa diperbolehkan memilih antara reguler pulang-pergi maupun mukim di asrama).\n- **Sarana Praktik Vokasional**: Lahan dan unit praktik khusus untuk siswa SMK dalam pendalaman agribisnis dan teknologi terapan.\n\nBapak/Ibu dipersilakan untuk berkunjung langsung melihat fasilitas kami pada jam kerja. 🙏😊`,
      sources: ['Inventaris Fasilitas Kampus', 'Buku Panduan Asrama']
    };
  }

  // 7. Kontak & Alamat
  if (/\b(kontak|alamat|lokasi|nomor|telepon|wa|whatsapp|email|instagram|youtube|maps|dimana)\b/i.test(raw)) {
    return {
      reply: `Dengan senang hati kami sampaikan informasi alamat dan saluran komunikasi resmi LPI Nurul Huda Kapedi: 😊\n\n- **Alamat Kantor**: Jl. Utara Masjid Sumber, Dusun Sasar, Desa Kapedi, Kecamatan Bluto, Kabupaten Sumenep, Madura, Jawa Timur 69461.\n- **WhatsApp / Telepon Layanan**: [${institution.whatsapp}](https://wa.me/6281554008683) (Respon cepat pada jam kerja).\n- **Email Resmi**: ${institution.email}\n- **Instagram**: [@osdaka_ynh](https://www.instagram.com/osdaka_ynh)\n- **YouTube**: [PP Nurul Huda Kapedi](https://youtube.com/@ppnurulhudakapedi)\n- **Lokasi Google Maps**: [Buka Penunjuk Arah Google Maps](https://maps.app.goo.gl/vWHgCBXxvxwLxXwU8)\n\nKantor kami buka melayani tamu setiap hari kerja (Senin s.d. Sabtu) pukul **07.00 – 14.00 WIB**. Kami nantikan kehadiran Anda. 🙏😊`,
      sources: ['Sekretariat Yayasan', 'Direktori Kontak Resmi']
    };
  }

  // 8. Keislaman Umum (Rukun Iman, Rukun Islam, Sholat, Adab)
  if (/\b(rukun iman)\b/i.test(raw)) {
    return {
      reply: `Dalam ajaran Islam, **Rukun Iman** ada 6 (enam) perkara yang wajib diyakini dengan sepenuh hati: 😊\n\n1. **Iman kepada Allah SWT**: Meyakini keberadaan, keesaan, dan kesempurnaan Allah SWT.\n2. **Iman kepada Malaikat-Malaikat Allah**: Meyakini malaikat sebagai makhluk taat yang diciptakan dari cahaya.\n3. **Iman kepada Kitab-Kitab Allah**: Meyakini kitab suci yang diturunkan kepada para Rasul (Taurat, Zabur, Injil, dan Al-Qur'an sebagai penyempurna).\n4. **Iman kepada Rasul-Rasul Allah**: Meyakini para utusan Allah yang membawa risalah kebenaran.\n5. **Iman kepada Hari Akhir (Hari Kiamat)**: Meyakini adanya hari pembalasan, surga, dan neraka.\n6. **Iman kepada Qada dan Qadar**: Meyakini segala ketentuan dan takdir Allah SWT.\n\nDi LPI Nurul Huda, penanaman akidah ini menjadi fondasi karakter santri sejak usia dini. Semoga bermanfaat! 🙏😊`,
      sources: ['Khazanah Akidah Islam', 'Pendidikan Agama Islam']
    };
  }

  if (/\b(rukun islam)\b/i.test(raw)) {
    return {
      reply: `**Rukun Islam** terdiri dari 5 (lima) pilar utama yang menjadi pondasi amal ibadah seorang Muslim: 😊\n\n1. **Mengucapkan Dua Kalimat Syahadat**: Bersaksi bahwa tiada Tuhan selain Allah dan Nabi Muhammad adalah utusan Allah.\n2. **Mendirikan Sholat**: Melaksanakan sholat fardhu lima waktu sehari semalam.\n3. **Menunaikan Zakat**: Mengeluarkan sebagian harta yang telah mencapai nisab bagi yang berhak.\n4. **Berpuasa di Bulan Ramadhan**: Menahan diri dari makan, minum, dan hawa nafsu dari fajar hingga maghrib.\n5. **Menunaikan Ibadah Haji**: Melaksanakan haji ke Baitullah bagi yang mampu secara fisik dan finansial.\n\nSemoga kita senantiasa dimudahkan mengamalkannya dalam kehidupan sehari-hari. 🙏`,
      sources: ['Khazanah Fiqh Islam', 'Pendidikan Agama Islam']
    };
  }

  // 9. Teknologi & Artificial Intelligence (AI)
  if (/\b(apa itu ai|artificial intelligence|kecerdasan buatan|cara kerja ai)\b/i.test(raw)) {
    return {
      reply: `**Artificial Intelligence (AI)** atau Kecerdasan Buatan adalah bidang ilmu komputer yang bertujuan menciptakan sistem yang mampu meniru cara berpikir dan belajar manusia. 😊\n\n**Bagaimana AI Bekerja?**\n- **Data Training**: Model AI dilatih dengan membaca jutaan data (teks, gambar, atau audio).\n- **Machine Learning & Neural Network**: Menemukan pola-pola matematis untuk memprediksi jawaban yang paling masuk akal.\n- **Penerapan Modern**: Asisten virtual, penerjemah bahasa, diagnosa medis, robotika, dan pertanian presisi.\n\nDi LPI Nurul Huda, kami membimbing siswa agar melek teknologi dan mampu memanfaatkan AI secara bijak dan produktif. Ada aspek teknologi tertentu yang ingin didiskusikan? 🙏😊`,
      sources: ['Wawasan Teknologi & AI', 'Kurikulum Literasi Digital']
    };
  }

  // 10. Jika ada chunk relevan dengan skor tinggi dari arsip lembaga
  if (chunks.length > 0 && chunks[0].score >= 8) {
    return {
      reply: `Terima kasih atas pertanyaannya. Berdasarkan informasi resmi lembaga terkait **${chunks[0].title}**, berikut penjelasannya: 😊\n\n${chunks[0].content}\n\nApabila Bapak/Ibu/Kakak membutuhkan informasi yang lebih detail mengenai hal ini, silakan menghubungi sekretariat kami melalui WhatsApp di [${institution.whatsapp}](https://wa.me/6281554008683). Kami siap melayani Anda dengan senang hati. 🙏`,
      sources: [chunks[0].title]
    };
  }

  // 11. Pertanyaan Singkat / Belum Jelas (seperti "Kenapa", "Maksudnya", dsb.)
  return {
    reply: `Terima kasih banyak atas pertanyaan yang Bapak/Ibu/Kakak sampaikan. 😊\n\nAgar kami dapat memberikan jawaban yang paling tepat dan solutif, mohon perjelas kembali pertanyaannya ya:\n\n1. Jika Anda ingin menanyakan informasi seputar **LPI Nurul Huda Kapedi**, silakan ketik topik yang ingin diketahui (misalnya: *syarat PPDB*, *unit sekolah*, *jurusan SMK*, *prestasi*, *biaya*, atau *alamat kontak*).\n2. Jika Anda ingin berdiskusi seputar **pengetahuan umum, sains, agama Islam, teknologi, tips belajar, atau penulisan esai**, silakan tuliskan pertanyaan Anda secara lengkap.\n\nKami selalu siap membantu dan melayani Bapak/Ibu/Kakak dengan senang hati! 🙏😊`,
    sources: ['Asisten AI Nurul Huda']
  };
}
