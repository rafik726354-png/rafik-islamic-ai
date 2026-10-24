/**
 * Syed Ismat Toha Authentic Bengali Quran Audio Map
 * Producer: Al Quran Academy London (Director: Hafiz Munir Uddin Ahmad)
 * Voice: Sayed Ismat Toha (সৈয়দ ইসমত তোহা)
 * Arabic Recitation: Qari Abdul Basit Abdus Samad
 * Source: Internet Archive (Al-QuranArabicToBanglaAudio)
 * Access: Public Da'wah & Educational Audio Streaming
 */

export const TOHA_AUDIO_METADATA = {
  reciterNameBn: "সৈয়দ ইসমত তোহা",
  reciterNameEn: "Sayed Ismat Toha",
  publisherBn: "আল কুরআন একাডেমী লন্ডন",
  publisherEn: "Al Quran Academy London",
  supervisorBn: "হাফেজ মুনির উদ্দিন আহমদ",
  arabicReciterBn: "কারী আবদুল বাসেত আব্দুস সামাদ",
  sourceName: "Internet Archive (Al-QuranArabicToBanglaAudio)",
  sourceUrl: "https://archive.org/details/Al-QuranArabicToBanglaAudio",
  baseUrl: "https://archive.org/download/Al-QuranArabicToBanglaAudio/",
  license: "উন্মুক্ত ইসলামিক দাওয়াহ ও অবাণিজ্যিক শিক্ষা প্রচার",
};

// Map of Surah number (1-114) to Archive.org authentic MP3 filenames
export const BENGALI_SURAH_AUDIO_FILENAMES: Record<number, string> = {
  1: "001.Surah Al-Faatihah .mp3",
  2: "002.surahAl-baqarah.mp3",
  3: "003.surahAal-imran.mp3",
  4: "004.surahAn-nisaa.mp3",
  5: "005.surahAl-maaidah.mp3",
  6: "006.surahAl-anaam.mp3",
  7: "007.surahAl-araaf.mp3",
  8: "008.surahAl-anfaal.mp3",
  9: "009.surahAt-tawbah.mp3",
  10: "010.surahYunus.mp3",
  11: "011.surahHud.mp3",
  12: "012.surahYusuf.mp3",
  13: "013.surahAr-rad.mp3",
  14: "014.surahIbrahim.mp3",
  15: "015.surahAl-hijr.mp3",
  16: "016.surahAn-nahl.mp3",
  17: "017.surahAl-israaBaneeIsraaee.mp3",
  18: "018.surahAl-kahf.mp3",
  19: "019.surahMaryam.mp3",
  20: "020.surahTaa-haa.mp3",
  21: "021.surahAl-anbiyaa.mp3",
  22: "022.surahAl-hajj.mp3",
  23: "023.surahAl-muminoon.mp3",
  24: "024.surahAn-noor.mp3",
  25: "025.surahAl-furqaan.mp3",
  26: "026.surahAsh-shuaraa.mp3",
  27: "027.surahAn-naml.mp3",
  28: "028.surahAl-qasas.mp3",
  29: "029.surahAl-ankaboot.mp3",
  30: "030.surahAr-room.mp3",
  31: "031.surahLuqman.mp3",
  32: "032.surahAs-sajdah.mp3",
  33: "033.surahAl-ahzaab.mp3",
  34: "034.surahSaba.mp3",
  35: "035.surahFaatir.mp3",
  36: "036.surahYaseen.mp3",
  37: "037.surahAs-saaffaat.mp3",
  38: "038.surahSaad.mp3",
  39: "039.surahAz-zumar.mp3",
  40: "040.surahGhafirAl-momin.mp3",
  41: "041.surahFussilatHa-meemAs-shajdah.mp3",
  42: "042.surahAsh-shura.mp3",
  43: "043.surahAz-zukhruf.mp3",
  44: "044.surahAd-dukhaan.mp3",
  45: "045.surahAl-jaathiyah.mp3",
  46: "046.surahAl-ahqaf.mp3",
  47: "047.surahMuhammad.mp3",
  48: "048.surahAl-fath.mp3",
  49: "049.surahAl-hujuraat.mp3",
  50: "050.surahQaaf.mp3",
  51: "051.surahAdh-dhaariyatazh-zariyat.mp3",
  52: "052.surahAt-tur.mp3",
  53: "053.surahAn-najm.mp3",
  54: "054.surahAl-qamar.mp3",
  55: "055.surahAr-rahmaan.mp3",
  56: "056.surahAl-waaqiah.mp3",
  57: "057.surahAl-hadid.mp3",
  58: "058.surahAl-mujaadilah.mp3",
  59: "059.surahAl-hashr.mp3",
  60: "060.surahAl-mumtahanah.mp3",
  61: "061.surahAs-saff.mp3",
  62: "062.surahAl-jumuah.mp3",
  63: "063.surahAl-munaafiqoon.mp3",
  64: "064.surahAt-taghaabun.mp3",
  65: "065.surahAt-talaaq.mp3",
  66: "066.surahAt-tahrim.mp3",
  67: "067.surahAl-mulk.mp3",
  68: "068.surahAl-qalam.mp3",
  69: "069.surahAl-haaqqah.mp3",
  70: "070.surahAl-maaarij.mp3",
  71: "071.surahNooh.mp3",
  72: "072.surahAl-jinn.mp3",
  73: "073.surahAl-muzzammil.mp3",
  74: "074.surahAl-muddaththir.mp3",
  75: "075.surahAl-qiyaamah.mp3",
  76: "076.surahAl-insaanAl-dahri.mp3",
  77: "077.surahAl-mursalaat.mp3",
  78: "078.surahAn-naba.mp3",
  79: "079.surahAn-naaziaat.mp3",
  80: "080.surahAbasa.mp3",
  81: "081.surahAt-takwir.mp3",
  82: "082.surahAl-infitaar.mp3",
  83: "083.surahAl-mutaffifin.mp3",
  84: "084.surahAl-inshiqaaq.mp3",
  85: "085.surahAl-burooj.mp3",
  86: "086.surahAt-tariq.mp3",
  87: "087.surahAl-alaa.mp3",
  88: "088.surahAl-ghaashiyah.mp3",
  89: "089.surahAl-fajr.mp3",
  90: "090.surahAl-balad.mp3",
  91: "091.surahAsh-shams.mp3",
  92: "092.surahAl-lail.mp3",
  93: "093.surahAd-dhuhaa.mp3",
  94: "094.surahAsh-sharhAlam-nashrahInshirah.mp3",
  95: "095.surahAt-tin.mp3",
  96: "096.surahAl-alaq.mp3",
  97: "097.surahAl-qadr.mp3",
  98: "098.surahAl-bayyinah.mp3",
  99: "099.surahAz-zalzalahAl-zilzal.mp3",
  100: "100.surahAl-aadiyaat.mp3",
  101: "101.surahAl-qaariah.mp3",
  102: "102.surahAt-takaathur.mp3",
  103: "103.surahAl-asr.mp3",
  104: "104.surahAl-humazah.mp3",
  105: "105.surahAl-fil.mp3",
  106: "106.surahQuraish.mp3",
  107: "107.surahAl-maaun.mp3",
  108: "108.surahAl-kawthar.mp3",
  109: "109.surahAl-kaafiroon.mp3",
  110: "110.surahAn-nasr.mp3",
  111: "111.surahAl-masadAl-lahab.mp3",
  112: "112.surahAl-ikhlaas.mp3",
  113: "113.surahAl-falaq.mp3",
  114: "114.surahAn-naas.mp3",
};

/**
 * Returns the optimized streaming proxy URL for Syed Ismat Toha audio.
 * Routes through Express backend for CORS compliance, range streaming, and zero sandbox restrictions.
 */
export function getBengaliSurahAudioUrl(surahNumber: number): string | null {
  const filename = BENGALI_SURAH_AUDIO_FILENAMES[surahNumber];
  if (!filename) return null;
  return `/api/audio/bengali/${surahNumber}`;
}

/**
 * Returns the direct authentic audio URL from Internet Archive as fallback
 */
export function getDirectArchiveAudioUrl(surahNumber: number): string | null {
  const filename = BENGALI_SURAH_AUDIO_FILENAMES[surahNumber];
  if (!filename) return null;
  return `${TOHA_AUDIO_METADATA.baseUrl}${encodeURIComponent(filename)}`;
}

/**
 * Returns ordered candidate URLs for playback resilience:
 * 1. Express backend proxy (high speed, cached on server)
 * 2. Internet Archive primary download gateway
 * 3. Internet Archive direct cluster storage node
 */
export function getBengaliAudioCandidateUrls(surahNumber: number): string[] {
  const filename = BENGALI_SURAH_AUDIO_FILENAMES[surahNumber];
  if (!filename) return [];
  const encoded = encodeURIComponent(filename);
  return [
    `/api/audio/bengali/${surahNumber}`,
    `${TOHA_AUDIO_METADATA.baseUrl}${encoded}`,
    `https://ia800109.us.archive.org/15/items/Al-QuranArabicToBanglaAudio/${encoded}`,
  ];
}

/**
 * Check if authentic Syed Ismat Toha audio is available for this Surah
 */
export function isTohaAudioAvailable(surahNumber: number): boolean {
  return Boolean(BENGALI_SURAH_AUDIO_FILENAMES[surahNumber]);
}

