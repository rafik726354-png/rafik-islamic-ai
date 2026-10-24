export interface SurahMeta {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  banglaName: string;
  banglaMeaning: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number; // Overall number (1-6236)
  numberInSurah: number;
  text: string; // Pristine Arabic text
  translationBn: string; // Dr. Abu Bakr Muhammad Zakaria's verbatim translation from QuranEnc
  translationEn: string; // Saheeh International
  footnotes?: string; // Dr. Zakaria's scholarly explanatory footnotes from QuranEnc
  audio?: string; // Verified real Qari recitation audio URL
  audioEn?: string; // Verified English translation audio URL (Ibrahim Walk)
  hasHumanBengaliAyahAudio?: boolean; // Whether human studio recording for this single ayah is available
  juz?: number;
  page?: number;
  sajda?: boolean | object;
}

export type AudioLanguageMode = 'ar' | 'en' | 'ar_en' | 'bn_surah';

export interface OfflineSurahRecord {
  surahNumber: number;
  surahName: string;
  numberOfAyahs: number;
  savedAt: number;
  ayahs: Ayah[];
  sizeBytes?: number;
}

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  englishName: string;
  banglaName: string;
  quality?: string;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translationBn?: string;
  timestamp: number;
}

export interface BookVolume {
  volumeNumber: number;
  titleBn: string;
  titleEn?: string;
  descriptionBn?: string;
  url?: string;
}

export interface LibraryItem {
  id: string;
  category: 'quran-tafsir' | 'hadith' | 'dua-dhikr' | 'seerah' | 'aqidah' | 'fiqh' | 'learning';
  titleBn: string;
  titleEn: string;
  authorBn: string;
  translatorBn?: string;
  publisherBn?: string;
  totalVolumes?: number;
  volumes?: BookVolume[];
  coverColor?: string;
  descriptionBn: string;
  descriptionEn: string;
  sourceUrl: string;
  sourceName: string;
  recommendedTag?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: { name: string; url: string }[];
  error?: boolean;
}
