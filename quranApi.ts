import { Ayah, OfflineSurahRecord, SurahMeta } from '../types/quran';
import { getBengaliSurahAudioUrl } from '../data/bengaliAudioMap';

interface CacheItem {
  timestamp: number;
  ayahs: Ayah[];
  surahNumber: number;
  source: 'quranenc_zakaria';
}

const memoryCache = new Map<string, CacheItem>();

// Helper to fetch Dr. Abu Bakr Muhammad Zakaria translation from QuranEnc
async function fetchZakariaTranslation(surahNumber: number): Promise<any[]> {
  try {
    // Try server proxy first for caching and resilience
    const proxyRes = await fetch(`/api/quran/zakaria/${surahNumber}`);
    if (proxyRes.ok) {
      const json = await proxyRes.json();
      if (json && Array.isArray(json.result)) {
        return json.result;
      }
    }
  } catch (e) {
    console.warn('Proxy fetch failed, attempting direct QuranEnc call:', e);
  }

  // Direct QuranEnc call
  const directRes = await fetch(`https://quranenc.com/api/v1/translation/sura/bengali_zakaria/${surahNumber}`, {
    headers: { Accept: 'application/json' },
  });

  if (!directRes.ok) {
    throw new Error(`QuranEnc সার্ভার সাড়া দেয়নি (Status: ${directRes.status})। ড. যাকারিয়ার অনুবাদ লোড করা সম্ভব হয়নি।`);
  }

  const directJson = await directRes.json();
  if (!directJson || !Array.isArray(directJson.result)) {
    throw new Error('QuranEnc অনুবাদ ডেটা ত্রুটিপূর্ণ।');
  }

  return directJson.result;
}

// Fetch Arabic Text, English Translation, Qari Recitation Audio & Dr. Zakaria's Bengali Translation
export async function fetchSurahData(
  surahNumber: number,
  reciterId: string = 'ar.alafasy'
): Promise<{ ayahs: Ayah[]; surahNumber: number; isOffline?: boolean }> {
  const cacheKey = `surah_${surahNumber}_${reciterId}`;

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    return {
      ayahs: memoryCache.get(cacheKey)!.ayahs,
      surahNumber,
    };
  }

  // 2. Check local offline storage record
  const offlineRecord = getOfflineSurah(surahNumber);
  if (offlineRecord && offlineRecord.ayahs && offlineRecord.ayahs.length > 0) {
    memoryCache.set(cacheKey, {
      timestamp: offlineRecord.savedAt,
      ayahs: offlineRecord.ayahs,
      surahNumber,
      source: 'quranenc_zakaria',
    });
    return { ayahs: offlineRecord.ayahs, surahNumber, isOffline: true };
  }

  // 3. Parallel fetch from verified endpoints:
  // - QuranEnc: Dr. Abu Bakr Muhammad Zakaria Bengali Translation (Original verbatim text + Footnotes)
  // - AlQuran Cloud: Uthmani Arabic script, Saheeh International English, and Real Qari Audio
  const quranCloudUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,${reciterId}`;

  const [quranCloudRes, zakariaResult] = await Promise.all([
    fetch(quranCloudUrl, { headers: { Accept: 'application/json' } }),
    fetchZakariaTranslation(surahNumber),
  ]);

  if (!quranCloudRes.ok) {
    throw new Error(`কুরআন সার্ভার থেকে মূল আরবি পাঠ পাওয়া যায়নি (Status: ${quranCloudRes.status})।`);
  }

  const quranCloudJson = await quranCloudRes.json();
  if (quranCloudJson.code !== 200 || !Array.isArray(quranCloudJson.data) || quranCloudJson.data.length < 3) {
    throw new Error('কুরআন ডেটা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
  }

  const arabicData = quranCloudJson.data[0];
  const englishData = quranCloudJson.data[1];
  const audioData = quranCloudJson.data[2];

  // Pair each Ayah with Dr. Abu Bakr Muhammad Zakaria's verbatim translation and footnotes
  const ayahs: Ayah[] = arabicData.ayahs.map((item: any, index: number) => {
    const zakariaItem = zakariaResult[index] || {};
    const audioUrl = audioData?.ayahs?.[index]?.audio || '';
    const audioEnUrl = `https://cdn.islamic.network/quran/audio/192/en.walk/${item.number}.mp3`;

    return {
      number: item.number,
      numberInSurah: item.numberInSurah,
      text: item.text,
      translationBn: zakariaItem.translation || 'অনুবাদ পাওয়া যায়নি।',
      translationEn: englishData?.ayahs?.[index]?.text || '',
      footnotes: zakariaItem.footnotes || undefined,
      audio: audioUrl,
      audioEn: audioEnUrl,
      hasHumanBengaliAyahAudio: false, // Individual ayah studio recording is not available in open repository
      juz: item.juz,
      page: item.page,
      sajda: item.sajda,
    };
  });

  const cacheEntry: CacheItem = {
    timestamp: Date.now(),
    ayahs,
    surahNumber,
    source: 'quranenc_zakaria',
  };

  memoryCache.set(cacheKey, cacheEntry);

  return { ayahs, surahNumber };
}

// ================= Offline Storage & Sync API =================

const OFFLINE_KEY_PREFIX = 'rafik_offline_surah_';
const OFFLINE_INDEX_KEY = 'rafik_offline_surahs_index';

export function saveSurahOffline(
  surahNumber: number,
  ayahs: Ayah[],
  surahName: string
): boolean {
  try {
    const record: OfflineSurahRecord = {
      surahNumber,
      surahName,
      numberOfAyahs: ayahs.length,
      savedAt: Date.now(),
      ayahs,
      sizeBytes: JSON.stringify(ayahs).length,
    };

    localStorage.setItem(`${OFFLINE_KEY_PREFIX}${surahNumber}`, JSON.stringify(record));

    // Update index list
    const indexList = listOfflineSurahs();
    if (!indexList.some((s) => s.surahNumber === surahNumber)) {
      indexList.push({
        surahNumber,
        surahName,
        numberOfAyahs: ayahs.length,
        savedAt: record.savedAt,
        ayahs: [], // don't duplicate full ayahs in index
        sizeBytes: record.sizeBytes,
      });
      localStorage.setItem(OFFLINE_INDEX_KEY, JSON.stringify(indexList));
    }
    return true;
  } catch (e) {
    console.warn('Offline save failed (storage full?):', e);
    return false;
  }
}

export function isSurahOffline(surahNumber: number): boolean {
  try {
    return Boolean(localStorage.getItem(`${OFFLINE_KEY_PREFIX}${surahNumber}`));
  } catch {
    return false;
  }
}

export function getOfflineSurah(surahNumber: number): OfflineSurahRecord | null {
  try {
    const raw = localStorage.getItem(`${OFFLINE_KEY_PREFIX}${surahNumber}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function removeOfflineSurah(surahNumber: number): void {
  try {
    localStorage.removeItem(`${OFFLINE_KEY_PREFIX}${surahNumber}`);
    const indexList = listOfflineSurahs().filter((s) => s.surahNumber !== surahNumber);
    localStorage.setItem(OFFLINE_INDEX_KEY, JSON.stringify(indexList));
  } catch (e) {
    console.warn(e);
  }
}

export function listOfflineSurahs(): OfflineSurahRecord[] {
  try {
    const raw = localStorage.getItem(OFFLINE_INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getOfflineStorageStats(): { count: number; estimatedSizeKb: number } {
  const surahs = listOfflineSurahs();
  let totalBytes = 0;
  for (const s of surahs) {
    totalBytes += s.sizeBytes || 15000;
  }
  return {
    count: surahs.length,
    estimatedSizeKb: Math.round(totalBytes / 1024),
  };
}
