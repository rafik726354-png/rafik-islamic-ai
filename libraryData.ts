import { LibraryItem } from '../types/quran';

// 8 Verified Cover Colors specified by User:
// Emerald Green: #176B50
// Royal Blue:    #285A91
// Burgundy:      #7B3042
// Teal:          #237C78
// Deep Purple:   #65468A
// Warm Brown:    #8A5A3B
// Charcoal:      #454545
// Golden Ochre:  #B58A35

export const ISLAMIC_LIBRARY_ITEMS: LibraryItem[] = [
  // 1. Quran & Tafsir
  {
    id: 'quran-com-explorer',
    category: 'quran-tafsir',
    titleBn: 'কুরআন ডট কম — পূর্ণাঙ্গ কুরআন ও তাফসির পোর্টাল',
    titleEn: 'Quran.com — Complete Holy Quran & Multi-Tafsir Explorer',
    authorBn: 'আন্তর্জাতিক কুরআন ফাউন্ডেশন',
    publisherBn: 'Quran.com Global Initiative',
    coverColor: '#237C78', // Teal
    descriptionBn: 'শব্দে শব্দে অর্থ (Word by word), অডিও তিলাওয়াত, ইংরেজি ও বাংলা অনুবাদ এবং তাফসির ইবনে কাসির পড়ার আধুনিক প্ল্যাটফর্ম।',
    descriptionEn: 'The leading online Quran reader with translations, tafsir, word-by-word analysis, and recitation audio.',
    sourceUrl: 'https://quran.com/',
    sourceName: 'Quran.com',
    recommendedTag: 'অত্যাবশ্যকীয়'
  },
  {
    id: 'quranenc-bengali',
    category: 'quran-tafsir',
    titleBn: 'কুরআন এনসাইক্লোপিডিয়া — প্রামাণিক বাংলা অনুবাদ',
    titleEn: 'QuranEnc — Authentic Quran Translations Encyclopedia',
    authorBn: 'বাদশাহ ফাহাদ কুরআন কমপ্লেক্স অনুমোদিত গবেষক পরিষদ',
    translatorBn: 'ড. আবূ বকর মুহাম্মাদ যাকারিয়া',
    publisherBn: 'কিং ফাহাদ কুরআন প্রিন্টিং কমপ্লেক্স, মদিনা মুনাওয়ারা',
    totalVolumes: 1,
    coverColor: '#65468A', // Deep Purple
    descriptionBn: 'বিশ্বস্ত ইসলামিক পণ্ডিতদের দ্বারা সম্পাদিত নির্ভেজাল বাংলা কুরআন অনুবাদ ও শব্দার্থ কোষ। কিং ফাহাদ কমপ্লেক্স অনুমোদিত নির্ভরযোগ্য পাঠ্য।',
    descriptionEn: 'Carefully vetted and reviewed translations of the Quran by trusted scholars.',
    sourceUrl: 'https://quranenc.com/bn/browse/bengali_zakaria',
    sourceName: 'QuranEnc.com',
    recommendedTag: 'বিশুদ্ধ অনুবাদ'
  },
  {
    id: 'tafsir-ibn-kathir',
    category: 'quran-tafsir',
    titleBn: 'তাফসির ইবনে কাসির (সংক্ষিপ্ত ও মূলনীতি)',
    titleEn: 'Tafsir Ibn Kathir — The Monumental Exegesis',
    authorBn: 'আল্লামা হাফিজ ইমাদুদ্দিন ইবনে কাসির (রহ.)',
    publisherBn: 'দারুসসালাম পাবলিকেশন্স / ইসলামিক ফাউন্ডেশন',
    totalVolumes: 11,
    coverColor: '#176B50', // Emerald Green
    volumes: [
      { volumeNumber: 1, titleBn: 'সূরা আল-ফাতিহা ও সূরা আল-বাকারাহ (১-১৪১)', descriptionBn: 'ভূমিকা, তাফসিরের মূলনীতি ও ঈমানের মৌলিক ঘোষণা' },
      { volumeNumber: 2, titleBn: 'সূরা আল-বাকারাহ (১৪২-২৮৬)', descriptionBn: 'কিবলা পরিবর্তন, সিয়াম, হজ, বিবাহ ও শরিয়তের বিধিবিধান' },
      { volumeNumber: 3, titleBn: 'সূরা আলে ইমরান ও সূরা আন-নিসা (১-৮৭)', descriptionBn: 'বদর ও উহুদ যুদ্ধের শিক্ষা এবং পারিবারিক অধিকার' },
      { volumeNumber: 4, titleBn: 'সূরা আন-নিসা (৮৮-১৭৬) ও সূরা আল-মায়িদাহ', descriptionBn: 'উত্তরাধিকার আইন, হালাল-হারাম ও অঙ্গীকার পালন' },
      { volumeNumber: 5, titleBn: 'সূরা আল-আনআম ও সূরা আল-আরাফ', descriptionBn: 'তাওহিদের প্রমাণ ও পূর্ববর্তী নবীগণের ইতিহাস' },
      { volumeNumber: 6, titleBn: 'সূরা আল-আনফাল ও সূরা আত-তাওবাহ', descriptionBn: 'জিহাদ, যুদ্ধলব্ধ সম্পদ ও কপটতার স্বরূপ উন্মোচন' },
      { volumeNumber: 7, titleBn: 'সূরা ইউনুস থেকে সূরা আন-নাহল', descriptionBn: 'হুদ, ইউসুফ ও ইব্রাহিম (আঃ)-এর শিক্ষণীয় জীবনী' },
      { volumeNumber: 8, titleBn: 'সূরা আল-ইসরা থেকে সূরা আল-আম্বিয়া', descriptionBn: 'মিরাজ গমন, আসহাবে কাহফ ও আম্বিয়াগণের আত্মত্যাগ' },
      { volumeNumber: 9, titleBn: 'সূরা আল-হজ থেকে সূরা আস-সাজদাহ', descriptionBn: 'হজের তাৎপর্য, নূর ও তাওবা' },
      { volumeNumber: 10, titleBn: 'সূরা আল-আহযাব থেকে সূরা আল-হুজুরাত', descriptionBn: 'আহযাব যুদ্ধ, ইয়াসিন ও মুমিনদের পারস্পরিক শিষ্টাচার' },
      { volumeNumber: 11, titleBn: 'সূরা কাফ থেকে সূরা আন-নাস (আমপারা)', descriptionBn: 'কিয়ামতের দৃশ্য ও দৈনন্দিন পঠিত ছোট সূরাসমূহের তাফসির' }
    ],
    descriptionBn: 'কুরআনের তাফসিরের ইতিহাসে সর্বাধিক সমাদৃত ও প্রামাণিক তাফসির। কুরআন দিয়ে কুরআন এবং সহিহ হাদিসের মাধ্যমে ব্যাখ্যার অনন্য গ্রন্থ।',
    descriptionEn: 'One of the most respected and comprehensive exegeses of the Holy Quran grounded in authentic hadith.',
    sourceUrl: 'https://quran.com/1/tafsirs/en-tafisr-ibn-kathir',
    sourceName: 'Quran.com Tafsir',
    recommendedTag: 'সর্বশ্রেষ্ঠ তাফসির'
  },

  // 2. Hadith Collections
  {
    id: 'sunnah-bukhari',
    category: 'hadith',
    titleBn: 'সহিহ আল-বুখারি — পূর্ণাঙ্গ হাদিস সম্ভার',
    titleEn: 'Sahih al-Bukhari — Complete Collection',
    authorBn: 'ইমাম মুহাম্মদ বিন ইসমাইল আল-বুখারি (রহ.)',
    publisherBn: 'তাওহীদ পাবলিকেশন্স / আধুনিক প্রকাশনী',
    totalVolumes: 10,
    coverColor: '#285A91', // Royal Blue
    volumes: [
      { volumeNumber: 1, titleBn: 'ওহীর সূচনা, ঈমান ও ইলম পর্ব', descriptionBn: 'হাদিস ১ থেকে ১৩৪ — ওহী কীভাবে নাজিল হতো ও খাঁটি ঈমানের শর্তাবলী' },
      { volumeNumber: 2, titleBn: 'পবিত্রতা, ওজু, গোসল ও সালাত পর্ব', descriptionBn: 'হাদিস ১৩৫ থেকে ৫০০ — সালাতের গুরুত্ব, আজান ও জামাত' },
      { volumeNumber: 3, titleBn: 'তাহাজ্জুদ, জুমুআ, জানাযা ও যাকাত পর্ব', descriptionBn: 'হাদিস ৫০১ থেকে ১৫১৩ — যাকাত প্রদান ও মৃতের অধিকার' },
      { volumeNumber: 4, titleBn: 'হজ, উমরাহ ও সিয়াম (রোজা) পর্ব', descriptionBn: 'হাদিস ১৫১৪ থেকে ২০৪৭ — রমজানের বিধান ও মক্কার ফরজ বিধান' },
      { volumeNumber: 5, titleBn: 'ক্রয়-বিক্রয়, ঋণ ও অংশীদারি কারবার', descriptionBn: 'হাদিস ২০৪৮ থেকে ২৬৯০ — হালাল উপার্জন ও অর্থনৈতিক শরিয়ত' },
      { volumeNumber: 6, titleBn: 'জিহাদ, সিরাত ও মাগাজি পর্ব', descriptionBn: 'হাদিস ২৬৯১ থেকে ৪৩৪৭ — বদর, উহুদ, খন্দক ও মক্কা বিজয়ের ঘটনা' },
      { volumeNumber: 7, titleBn: 'তাফসিরুল কুরআন হাদিস সংকলন', descriptionBn: 'হাদিস ৪৩৪৮ থেকে ৪৯৭৭ — কুরআনের বিভিন্ন আয়াতের হাদিসভিত্তিক শানে নুযুল' },
      { volumeNumber: 8, titleBn: 'বিবাহ, তালাক ও পারিবারিক বিধান', descriptionBn: 'হাদিস ৪৯৭৮ থেকে ৫৩৫০ — মোহরানা, পরিবার ব্যবস্থাপনা ও সন্তানের অধিকার' },
      { volumeNumber: 9, titleBn: 'খাদ্য, পোশাক, চিকিৎসা ও আদব পর্ব', descriptionBn: 'হাদিস ৫৩৫১ থেকে ৬৪১২ — সুন্নতি জীবনযাপন, শিষ্টাচার ও সুস্থতা' },
      { volumeNumber: 10, titleBn: 'রিকাক (মন গলানো হাদিস), তাওহিদ ও কিয়ামত', descriptionBn: 'হাদিস ৬৪১৩ থেকে ৭৫৬৩ — পরকাল, জান্নাত-জাহান্নাম ও আল্লাহর আসমা ওয়াস সিফাত' }
    ],
    descriptionBn: 'পবিত্র কুরআনের পর মুসলমানদের নিকট সর্বাধিক বিশুদ্ধতম কিতাব। এতে ৭,৫৬৩টি নির্বাচিত সহিহ হাদিস সংকলিত রয়েছে।',
    descriptionEn: 'The most authentic collection of Hadith, verified with rigorous sanad and matn criteria.',
    sourceUrl: 'https://sunnah.com/bukhari',
    sourceName: 'Sunnah.com',
    recommendedTag: 'সর্বাধিক বিশুদ্ধ'
  },
  {
    id: 'sunnah-muslim',
    category: 'hadith',
    titleBn: 'সহিহ মুসলিম — বিষয়ভিত্তিক সহিহ হাদিস',
    titleEn: 'Sahih Muslim — Authentic Narrations',
    authorBn: 'ইমাম মুসলিম বিন আল-হাজ্জাজ আন-নিশাপুরী (রহ.)',
    publisherBn: 'বাংলাদেশ ইসলামিক সেন্টার / তাওহীদ পাবলিকেশন্স',
    totalVolumes: 6,
    coverColor: '#7B3042', // Burgundy
    volumes: [
      { volumeNumber: 1, titleBn: 'কিতাবুল ঈমান ও কিতাবুত তাহারাত', descriptionBn: 'হাদিস ১ থেকে ৬৬০ — ঈমানের শাখা-প্রশাখা ও পবিত্রতার বিধিবিধান' },
      { volumeNumber: 2, titleBn: 'কিতাবুস সালাত ও মসজিদ সংকলন', descriptionBn: 'হাদিস ৬৬১ থেকে ১৪৪৪ — সালাতের যাবতীয় খুঁটিনাটি ও জুমার হুকুম' },
      { volumeNumber: 3, titleBn: 'কিতাবুয যাকাত, সিয়াম ও হজ', descriptionBn: 'হাদিস ১৪৪৫ থেকে ২৫০৫ — সাদাকাতুল ফিতর, এতেকাফ ও হজের আনুষ্ঠানিকতা' },
      { volumeNumber: 4, titleBn: 'কিতাবুন নিকাহ, তালাক ও বাণিজ্য', descriptionBn: 'হাদিস ২৫০৬ থেকে ৩৭৮০ — মুয়ামালাত ও ব্যবসায়িক সততা' },
      { volumeNumber: 5, titleBn: 'কিতাবুল জিহাদ ও কিতাবুল ফাদায়িল', descriptionBn: 'হাদিস ৩৭৮১ থেকে ৫৩০০ — সাহাবায়ে কিরামের অনন্য মর্যাদা' },
      { volumeNumber: 6, titleBn: 'কিতাবুয যুহদ ও কিয়ামতের আলামত', descriptionBn: 'হাদিস ৫৩০১ থেকে ৭৫০০ — দুনিয়াবিমুখতা, কবরের প্রশ্ন ও শেষ দিবস' }
    ],
    descriptionBn: 'সহিহ হাদিসের দ্বিতীয় প্রামাণ্য স্তম্ভ। অত্যন্ত চমৎকার ক্রমবিন্যাস ও সনদ ধারাবাহিকতায় সংকলিত।',
    descriptionEn: 'The second most authentic book of Hadith, praised for its thematic organization and strict criteria.',
    sourceUrl: 'https://sunnah.com/muslim',
    sourceName: 'Sunnah.com',
    recommendedTag: 'সহিহ সংকলন'
  },
  {
    id: 'sunnah-riyad-as-salihin',
    category: 'hadith',
    titleBn: 'রিয়াদুস সলেহিন (সদাচারীদের বাগান)',
    titleEn: 'Riyad as-Salihin — Gardens of the Righteous',
    authorBn: 'ইমাম আবু জাকারিয়া ইয়াহইয়া বিন শারাফ আন-নববী (রহ.)',
    publisherBn: 'দারুসসালাম / ইসলামিক ফাউন্ডেশন',
    totalVolumes: 2,
    coverColor: '#454545', // Charcoal
    volumes: [
      { volumeNumber: 1, titleBn: 'প্রথম খণ্ড — নিয়তের সততা, সবর ও ইবাদতের আদব', descriptionBn: '১ থেকে ১৮৯ অধ্যায় — তাকওয়া, শোকর ও আত্মশুদ্ধি' },
      { volumeNumber: 2, titleBn: 'দ্বিতীয় খণ্ড — আখলাক, মুয়ামালাত ও ইস্তিগফার', descriptionBn: '১৯০ থেকে ৩৭২ অধ্যায় — সালাম বিনিময়, মেহমানদারি ও ক্ষমা প্রার্থনা' }
    ],
    descriptionBn: 'দৈনন্দিন জীবন, চরিত্র গঠন, ইবাদত ও আখলাকের ওপর নির্ভরযোগ্য হাদিসের বিশ্বখ্যাত সংকলন।',
    descriptionEn: 'A timeless selection of authentic hadith covering character, worship, virtues, and spiritual discipline.',
    sourceUrl: 'https://sunnah.com/riyadussalihin',
    sourceName: 'Sunnah.com',
    recommendedTag: 'দৈনন্দিন হাদিস'
  },
  {
    id: 'sunnah-abu-dawud',
    category: 'hadith',
    titleBn: 'সুনান আবু দাউদ — ফিকহ ও আহকামের হাদিস',
    titleEn: 'Sunan Abi Dawud — Hadiths of Rulings & Fiqh',
    authorBn: 'ইমাম আবু দাউদ সুলায়মান বিন আল-আশআস (রহ.)',
    publisherBn: 'ইসলামিক ফাউন্ডেশন বাংলাদেশ',
    totalVolumes: 5,
    coverColor: '#8A5A3B', // Warm Brown
    volumes: [
      { volumeNumber: 1, titleBn: 'কিতাবুত তাহারাত ও কিতাবুস সালাত', descriptionBn: 'পবিত্রতা ও নামাজের মাসআলা সংক্রান্ত হাদিস' },
      { volumeNumber: 2, titleBn: 'কিতাবুয যাকাত, রোজা ও কিতাবুল মানাসিক (হজ)', descriptionBn: 'আর্থিক ও দৈহিক ফরজ ইবাদতের বিধান' },
      { volumeNumber: 3, titleBn: 'কিতাবুন নিকাহ, তালাক ও কিতাবুল বুয়ূ (ব্যবসা)', descriptionBn: 'লেনদেন ও হালাল জীবিকার মূলনীতি' },
      { volumeNumber: 4, titleBn: 'কিতাবুল কাদায়া (বিচার ব্যবস্থা) ও কিতাবুল হুদুদ', descriptionBn: 'দণ্ডবিধি ও ইনসাফ কায়েমের দিকনির্দেশনা' },
      { volumeNumber: 5, titleBn: 'কিতাবুল আদব ও কিতাবুল মাহদী', descriptionBn: 'আচার-আচরণ ও শেষ জামানার পরিস্থিতি' }
    ],
    descriptionBn: 'ইসলামিক ফিকহ ও হালাল-হারামের বিধান সংক্রান্ত প্রায় ৫,২৭৪টি হাদিস সমৃদ্ধ গুরুত্বপূর্ণ সুনান গ্রন্থ।',
    descriptionEn: 'Major collection focusing on legal rulings, worship regulations, and shariah guidelines.',
    sourceUrl: 'https://sunnah.com/abudawud',
    sourceName: 'Sunnah.com'
  },

  // 3. Dua and Dhikr
  {
    id: 'hisnul-muslim',
    category: 'dua-dhikr',
    titleBn: 'হিসনুল মুসলিম (মুসলিম দুর্গ) — দৈনন্দিন দোয়া ও জিকির',
    titleEn: 'Hisnul Muslim — Fortress of the Muslim',
    authorBn: 'ড. সাঈদ বিন আলী বিন ওয়াহফ আল-কাহতানী (রহ.)',
    publisherBn: 'মাকতাবাতুল বায়ান / দারুসসালাম',
    totalVolumes: 1,
    coverColor: '#B58A35', // Golden Ochre
    descriptionBn: 'ঘুম থেকে ওঠা থেকে শুরু করে সারাদিনের প্রতিটি কাজের জন্য কুরআন ও সহিহ হাদিস সমর্থিত প্রামাণিক দোয়াসমূহ।',
    descriptionEn: 'The gold standard handbook of daily invocations and supplications from the Quran and Sunnah.',
    sourceUrl: 'https://sunnah.com/hisn',
    sourceName: 'Sunnah.com / Hisnul Muslim',
    recommendedTag: 'প্রামাণিক দোয়া'
  },
  {
    id: 'morning-evening-adhkar',
    category: 'dua-dhikr',
    titleBn: 'সকাল ও সন্ধ্যার সহিহ মাসনুন জিকির',
    titleEn: 'Authentic Morning & Evening Adhkar',
    authorBn: 'রাসূলুল্লাহ (সাঃ)-এর আদর্শ সুন্নাহ',
    publisherBn: 'ইসলাম হাউস দাওয়াহ বিভাগ',
    totalVolumes: 1,
    coverColor: '#285A91', // Royal Blue
    descriptionBn: 'শয়তানের অনিষ্ট, বিপদাপদ ও রোগব্যাধি থেকে হেফাজতের জন্য সকাল ও সন্ধ্যায় পঠিতব্য প্রামাণ্য জিকির ও আয়াতসমূহ।',
    descriptionEn: 'Sunnah-prescribed remembrance for divine protection, peace of mind, and immense barakah.',
    sourceUrl: 'https://islamhouse.com/bn/books/240589/',
    sourceName: 'IslamHouse.com',
    recommendedTag: 'আত্মরক্ষা ও বারাকাহ'
  },
  {
    id: 'ruqyah-shariyyah',
    category: 'dua-dhikr',
    titleBn: 'শরয়ী রুকইয়াহ — কুরআন ও সুন্নাহর আলোকে আত্মিক চিকিৎসা',
    titleEn: 'Ruqyah Shariyyah — Spiritual Protection & Healing',
    authorBn: 'প্রসিদ্ধ ইসলামিক স্কলার ও গবেষক পরিষদ',
    publisherBn: 'ইসলামিক রিসার্চ একাডেমি',
    totalVolumes: 1,
    coverColor: '#237C78', // Teal
    descriptionBn: 'বদনজর, জাদু ও মানসিক অস্থিরতা দূরীকরণে সূরা আল-ফাতিহা, আয়াতুল কুরসি ও মুআউওয়াযাতাইন পাঠের সঠিক পদ্ধতি।',
    descriptionEn: 'Prescribed Quranic verses and prayers for spiritual healing and protection without superstition.',
    sourceUrl: 'https://islamhouse.com/bn/articles/426002/',
    sourceName: 'IslamHouse.com'
  },

  // 4. Seerah
  {
    id: 'ar-raheeq-al-makhtum',
    category: 'seerah',
    titleBn: 'আর-রাহিকুল মাখতুম (মোহরাঙ্কিত জান্নাতী সুধা)',
    titleEn: 'Ar-Raheeq Al-Makhtum — The Sealed Nectar',
    authorBn: 'আল্লামা শফিউর রহমান মুবারকপুরী (রহ.)',
    publisherBn: 'তাওহীদ পাবলিকেশন্স / রাবেতা আল-আলম আল-ইসলামী',
    totalVolumes: 1,
    coverColor: '#7B3042', // Burgundy
    descriptionBn: 'রাবেতা আল-আলম আল-ইসলামী আয়োজিত আন্তর্জাতিক সীরাতুন্নবী প্রতিযোগিতায় প্রথম পুরস্কারপ্রাপ্ত অবিস্মরণীয় সীরাত গ্রন্থ।',
    descriptionEn: 'Award-winning, highly acclaimed biography of Prophet Muhammad (peace be upon him).',
    sourceUrl: 'https://islamhouse.com/bn/books/2816982/',
    sourceName: 'IslamHouse.com',
    recommendedTag: 'সেরা সিরাত'
  },
  {
    id: 'seerah-sahaba',
    category: 'seerah',
    titleBn: 'আসহাবে রাসুলের জীবনকথা — সাহাবায়ে কিরামের বীরত্ব ও ঈমান',
    titleEn: 'Biographies of the Companions of the Prophet',
    authorBn: 'মুহাম্মদ আব্দুল মালেক ও গবেষক দল',
    publisherBn: 'বাংলাদেশ ইসলামিক সেন্টার',
    totalVolumes: 4,
    coverColor: '#65468A', // Deep Purple
    volumes: [
      { volumeNumber: 1, titleBn: 'খুলাফায়ে রাশেদিন — আবু বকর, উমর, উসমান ও আলী (রাঃ)', descriptionBn: 'ইসলামের চার মহান খলিফার খেলাফত ও অসামান্য অবদান' },
      { volumeNumber: 2, titleBn: 'আশারায়ে মুবাশশারা ও প্রথম যুগের অগ্রবর্তী সাহাবীগণ', descriptionBn: 'তালহা, যুবায়ের, আব্দুর রহমান বিন আউফ, সাদ বিন আবি ওয়াক্কাস (রাঃ)' },
      { volumeNumber: 3, titleBn: 'আনসার সাহাবী ও বদরি মুজাহিদগণ', descriptionBn: 'মদিনার আত্মত্যাগী আনসার ভাইদের অতুলনীয় ভ্রাতৃত্ববোধ' },
      { volumeNumber: 4, titleBn: 'মহীয়সী মহিলা সাহাবী ও উম্মাহাতুল মুমিনীন', descriptionBn: 'খাদিজা, আয়েশা, ফাতিমা ও সাহাবিয়াগণের ত্যাগ ও দ্বীন প্রচার' }
    ],
    descriptionBn: 'চার খলিফা, আশারায়ে মুবাশশারা এবং আনসার ও মুহাজির সাহাবিদের আত্মত্যাগ ও জীবনাদর্শ।',
    descriptionEn: 'Inspiring accounts of the companions who carried the light of Islam across the globe.',
    sourceUrl: 'https://islamhouse.com/bn/category/53198/',
    sourceName: 'IslamHouse.com'
  },

  // 5. Aqidah
  {
    id: 'tawheed-fundamentals',
    category: 'aqidah',
    titleBn: 'কিতাবুত তাওহিদ — আল্লাহর একত্ববাদের মূল দলিল',
    titleEn: 'Kitab at-Tawheed — The Oneness of Allah',
    authorBn: 'ইমাম মুহাম্মদ বিন আব্দুল ওহহাব (রহ.)',
    publisherBn: 'দারুসসালাম পাবলিকেশন্স',
    totalVolumes: 1,
    coverColor: '#176B50', // Emerald Green
    descriptionBn: 'তাওহিদুর রুবুবিয়্যাহ, তাওহিদুল উলুহিয়্যাহ এবং আসমা ওয়াস সিফাত — শিরকমুক্ত খাঁটি ঈমানের রূপরেখা।',
    descriptionEn: 'Foundational treatise on pure monotheism, avoiding shirk, and establishing sincere devotion.',
    sourceUrl: 'https://islamhouse.com/bn/books/240561/',
    sourceName: 'IslamHouse.com',
    recommendedTag: 'ঈমানের মূলভিত্তি'
  },
  {
    id: 'aqeedah-tahawiyyah',
    category: 'aqidah',
    titleBn: 'আকিদায়ে তাহাবিয়াহ — আহলুস সুন্নাহ ওয়াল জামাআতের বিশ্বাস',
    titleEn: 'Al-Aqeedah at-Tahawiyyah',
    authorBn: 'ইমাম আবু জাফর আহমাদ আত-তাহাবী আল-হানাফী (রহ.)',
    publisherBn: 'ইসলামিক ফাউন্ডেশন বাংলাদেশ',
    totalVolumes: 1,
    coverColor: '#454545', // Charcoal
    descriptionBn: 'সকল মাযহাবের আলেমদের নিকট সমাদৃত মূলধারার আহলুস সুন্নাহ ওয়াল জামাআতের সর্বসম্মত আকিদা গ্রন্থ।',
    descriptionEn: 'The widely accepted Sunni consensus statement of creed across the four madhhabs.',
    sourceUrl: 'https://islamhouse.com/bn/books/2815617/',
    sourceName: 'IslamHouse.com'
  },

  // 6. Fiqh
  {
    id: 'fiqh-salah-prayer',
    category: 'fiqh',
    titleBn: 'সালাতের পূর্ণাঙ্গ নির্দেশিকা — রাসুলুল্লাহ (সাঃ)-এর নামাজ',
    titleEn: 'The Prophet’s Prayer Described (Sifat Salat an-Nabi)',
    authorBn: 'মুহাদ্দিস মুহাম্মদ নাসিরুদ্দিন আলবানী (রহ.)',
    publisherBn: 'তাওহীদ পাবলিকেশন্স',
    totalVolumes: 1,
    coverColor: '#8A5A3B', // Warm Brown
    descriptionBn: 'তাকবীরে তাহরিমা থেকে সালাম পর্যন্ত প্রতিটি রুকন, ওয়াজিব ও সুন্নাতের দলীলভিত্তিক সহিহ বিবরণ।',
    descriptionEn: 'Detailed guide on performing prayer exactly as established by the Messenger of Allah.',
    sourceUrl: 'https://islamhouse.com/bn/books/1672/',
    sourceName: 'IslamHouse.com',
    recommendedTag: 'সালাতের সঠিক পদ্ধতি'
  },
  {
    id: 'fiqh-zakat-fasting',
    category: 'fiqh',
    titleBn: 'যাকাত ও সিয়ামের আধুনিক মাসআলা গাইড',
    titleEn: 'Comprehensive Rules of Zakat, Fasting & Charity',
    authorBn: 'ইসলামিক ফিকহ একাডেমি ও গবেষক পরিষদ',
    publisherBn: 'আন্তর্জাতিক ইসলামিক বিশ্ববিদ্যালয় রিসার্চ সেন্টার',
    totalVolumes: 1,
    coverColor: '#B58A35', // Golden Ochre
    descriptionBn: 'নিসাব পরিমাণ, স্বর্ণ-রৌপ্য ও ক্যাশ টাকার যাকাত হিসাব, রোজা ভঙ্গের কারণ ও কাজা-কাফফারার প্রামাণিক ফিকহ।',
    descriptionEn: 'Clear rulings on zakat nisab, Ramadan fasts, fidya, and purification of wealth.',
    sourceUrl: 'https://islamhouse.com/bn/category/53195/',
    sourceName: 'IslamHouse.com'
  },
  {
    id: 'fiqh-hajj-umrah',
    category: 'fiqh',
    titleBn: 'হজ ও ওমরাহর সহজ নির্দেশিকা',
    titleEn: 'Simplified Step-by-Step Guide to Hajj & Umrah',
    authorBn: 'কিং ফাহাদ ইসলামিক বিষয়ক মন্ত্রণালয়',
    publisherBn: 'সৌদি আরব ইসলামিক দাওয়াহ ও দিকনির্দেশনা মন্ত্রণালয়',
    totalVolumes: 1,
    coverColor: '#176B50', // Emerald Green
    descriptionBn: 'ইহরাম, তাওয়াফ, সায়ি, আরাফাত ও মিনার দিনসমূহের ধারাবাহিক প্রামাণ্য বিধান ও দোয়াসমূহ।',
    descriptionEn: 'Comprehensive pilgrim manual for fulfilling the fifth pillar of Islam accurately.',
    sourceUrl: 'https://islamhouse.com/bn/books/393282/',
    sourceName: 'IslamHouse.com'
  },

  // 7. Learning & Free Hub
  {
    id: 'islamhouse-bengali-hub',
    category: 'learning',
    titleBn: 'ইসলাম হাউস বাংলা — বিশ্বের বৃহত্তম নির্ভরযোগ্য ইসলামিক ওয়েবসাইট',
    titleEn: 'IslamHouse.com — Largest Islamic Authentic Resource Repository',
    authorBn: 'ইসলামিক দাওয়াহ সেন্টার ও মুফতি পরিষদ',
    publisherBn: 'ইসলাম হাউস গ্লোবাল প্রজেক্ট',
    coverColor: '#B58A35', // Golden Ochre
    descriptionBn: 'হাজারো বিনামূল্যে ডাউনলোডযোগ্য বাংলা ইসলামিক বই, অডিও লেকচার, ফতোয়া ও শিক্ষামূলক কনটেন্টের উন্মুক্ত ভাণ্ডার।',
    descriptionEn: 'Free authentic Islamic books, audio lectures, and scholarly articles in Bengali and 100+ languages.',
    sourceUrl: 'https://islamhouse.com/bn/',
    sourceName: 'IslamHouse.com',
    recommendedTag: 'মুক্ত পাঠাগার'
  }
];
