import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Sliders,
  AlertCircle,
  RotateCcw,
  Volume2,
  Download,
  CheckCircle2,
  Info,
  ShieldCheck,
  FileText,
  Globe
} from 'lucide-react';
import { ALL_SURAHS } from '../data/surahs';
import { Ayah, Bookmark as BookmarkType, Reciter, SurahMeta } from '../types/quran';
import {
  fetchSurahData,
  saveSurahOffline,
  isSurahOffline,
  getOfflineStorageStats
} from '../services/quranApi';
import { getBengaliSurahAudioUrl } from '../data/bengaliAudioMap';
import { saveAudioToOfflineCache } from '../services/audioCache';
import { ExtendedAudioMode } from './AudioPlayer';

interface QuranReaderProps {
  initialSurahNumber?: number;
  activeReciter: Reciter;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentAyahIndex: number;
  setCurrentAyahIndex: (index: number) => void;
  onSurahChange: (surah: SurahMeta, ayahs: Ayah[]) => void;
  audioMode?: ExtendedAudioMode;
  setAudioMode?: (mode: ExtendedAudioMode) => void;
  setBengaliNotice?: (notice: string | null) => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  initialSurahNumber,
  activeReciter,
  isPlaying,
  setIsPlaying,
  currentAyahIndex,
  setCurrentAyahIndex,
  onSurahChange,
  audioMode = 'ar',
  setAudioMode,
  setBengaliNotice,
}) => {
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentSurahOffline, setIsCurrentSurahOffline] = useState<boolean>(false);
  const [syncingOffline, setSyncingOffline] = useState<boolean>(false);
  const [offlineStats, setOfflineStats] = useState({ count: 0, estimatedSizeKb: 0 });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [activeTab, setActiveTab] = useState<'surahs' | 'bookmarks' | 'offline'>('surahs');

  // Display Settings
  const [showBengali, setShowBengali] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showControls, setShowControls] = useState<boolean>(false);
  const [expandedFootnotes, setExpandedFootnotes] = useState<Record<number, boolean>>({});

  // Notice for Bengali Audio Unavailability for single Ayahs
  const [singleAyahNotice, setSingleAyahNotice] = useState<string | null>(null);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [copiedAyahNum, setCopiedAyahNum] = useState<number | null>(null);

  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load bookmarks & offline stats on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rafik_quran_bookmarks');
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
      setOfflineStats(getOfflineStorageStats());
    } catch (e) {
      console.warn('Error loading initial data:', e);
    }
  }, []);

  // Handle Initial Surah load
  useEffect(() => {
    if (initialSurahNumber && initialSurahNumber >= 1 && initialSurahNumber <= 114) {
      const target = ALL_SURAHS.find((s) => s.number === initialSurahNumber);
      if (target) {
        loadSurah(target);
      }
    }
  }, [initialSurahNumber]);

  // Load Surah
  const loadSurah = async (surah: SurahMeta, startAyahIndex = 0) => {
    setSelectedSurah(surah);
    setLoading(true);
    setError(null);
    setSingleAyahNotice(null);
    setCurrentAyahIndex(startAyahIndex);
    setIsCurrentSurahOffline(isSurahOffline(surah.number));

    // Save to last-read in localStorage
    try {
      const lastReadData: BookmarkType = {
        id: `last_read_${surah.number}`,
        surahNumber: surah.number,
        surahName: surah.banglaName,
        ayahNumber: startAyahIndex + 1,
        arabicText: surah.name,
        timestamp: Date.now(),
      };
      localStorage.setItem('rafik_last_read', JSON.stringify(lastReadData));
    } catch (e) {
      console.warn('Error saving last-read:', e);
    }

    try {
      const res = await fetchSurahData(surah.number, activeReciter.id);
      setAyahs(res.ayahs);
      onSurahChange(surah, res.ayahs);
    } catch (err: any) {
      console.error('Surah load error:', err);
      setError(err.message || 'সূরা লোড করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch if reciter changes while reading
  useEffect(() => {
    if (selectedSurah) {
      fetchSurahData(selectedSurah.number, activeReciter.id)
        .then((res) => {
          setAyahs(res.ayahs);
          onSurahChange(selectedSurah, res.ayahs);
        })
        .catch((err) => console.warn('Reciter change error:', err));
    }
  }, [activeReciter.id]);

  // Auto-scroll to active ayah
  useEffect(() => {
    if (isPlaying && ayahRefs.current[currentAyahIndex]) {
      ayahRefs.current[currentAyahIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentAyahIndex, isPlaying]);

  // Play a specific Ayah with optional language mode
  const playAyah = (index: number, mode?: ExtendedAudioMode) => {
    if (mode && setAudioMode) {
      setAudioMode(mode);
    }
    setCurrentAyahIndex(index);
    setIsPlaying(true);
  };

  // When Bengali single-ayah audio is clicked:
  // Strictly enforce user instruction: Do NOT use AI voice. Show clear "বাংলা অডিও এখনো উপলব্ধ নয়" notice.
  const handleSingleAyahBengaliClick = (ayahNumberInSurah: number) => {
    const msg = `আয়াত ${ayahNumberInSurah}: একক আয়াতভিত্তিক বাংলা অডিও এখনো উপলব্ধ নয়। আল কুরআন একাডেমী লন্ডনের মূল প্রকাশনা অনুযায়ী সৈয়দ ইসমত তোহার কণ্ঠে সম্পূর্ণ সূরার অর্থ পাঠ রেকর্ড করা হয়েছে। কোনো কৃত্রিম AI বা রোবোটিক কণ্ঠের অনুকরণ ব্যবহার করা হয় না। সম্পূর্ণ সূরার আসল অর্থ পাঠ শুনতে উপরের 'বাংলা অর্থ পাঠ (সৈয়দ ইসমত তোহা)' বোতামে ক্লিক করুন।`;
    setSingleAyahNotice(msg);
    if (setBengaliNotice) setBengaliNotice(msg);
  };

  // Sync / Save Surah for offline (including audio caching for genuine offline playback)
  const handleOfflineSync = () => {
    if (!selectedSurah || ayahs.length === 0) return;
    setSyncingOffline(true);
    const success = saveSurahOffline(selectedSurah.number, ayahs, selectedSurah.banglaName);

    // Also cache Bengali audio in background for offline listening
    const bnAudioUrl = getBengaliSurahAudioUrl(selectedSurah.number);
    if (bnAudioUrl) {
      saveAudioToOfflineCache(bnAudioUrl).catch((err) => {
        console.warn('Offline audio cache warning:', err);
      });
    }

    setTimeout(() => {
      setSyncingOffline(false);
      setIsCurrentSurahOffline(success);
      setOfflineStats(getOfflineStorageStats());
    }, 400);
  };

  // Toggle bookmark for an Ayah
  const toggleBookmark = (ayah: Ayah) => {
    if (!selectedSurah) return;
    const bookmarkId = `bm_${selectedSurah.number}_${ayah.numberInSurah}`;
    const exists = bookmarks.some((b) => b.id === bookmarkId);

    let updated: BookmarkType[];
    if (exists) {
      updated = bookmarks.filter((b) => b.id !== bookmarkId);
    } else {
      const newBm: BookmarkType = {
        id: bookmarkId,
        surahNumber: selectedSurah.number,
        surahName: selectedSurah.banglaName,
        ayahNumber: ayah.numberInSurah,
        arabicText: ayah.text,
        translationBn: ayah.translationBn,
        timestamp: Date.now(),
      };
      updated = [newBm, ...bookmarks];
    }

    setBookmarks(updated);
    try {
      localStorage.setItem('rafik_quran_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.warn('Bookmark storage error:', e);
    }
  };

  const isBookmarked = (ayahNum: number) => {
    if (!selectedSurah) return false;
    const bookmarkId = `bm_${selectedSurah.number}_${ayahNum}`;
    return bookmarks.some((b) => b.id === bookmarkId);
  };

  // Toggle Footnotes expansion
  const toggleFootnote = (ayahNum: number) => {
    setExpandedFootnotes((prev) => ({
      ...prev,
      [ayahNum]: !prev[ayahNum],
    }));
  };

  // Copy Ayah text to clipboard
  const copyAyah = (ayah: Ayah) => {
    if (!selectedSurah) return;
    const textToCopy = `${ayah.text}\n\n[ড. আবু বকর মুহাম্মাদ যাকারিয়ার অনুবাদ: ${ayah.translationBn}]\n— সূরা ${selectedSurah.banglaName} (${selectedSurah.englishName}), আয়াত: ${ayah.numberInSurah}\nসূত্র: QuranEnc.com`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyahNum(ayah.numberInSurah);
    setTimeout(() => setCopiedAyahNum(null), 2000);
  };

  // Navigation: Next / Prev Surah
  const goToNextSurah = () => {
    if (!selectedSurah || selectedSurah.number >= 114) return;
    const next = ALL_SURAHS.find((s) => s.number === selectedSurah.number + 1);
    if (next) loadSurah(next);
  };

  const goToPrevSurah = () => {
    if (!selectedSurah || selectedSurah.number <= 1) return;
    const prev = ALL_SURAHS.find((s) => s.number === selectedSurah.number - 1);
    if (prev) loadSurah(prev);
  };

  // Filtered Surahs
  const filteredSurahs = ALL_SURAHS.filter((surah) => {
    const matchesSearch =
      surah.number.toString().includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.banglaName.includes(searchQuery) ||
      surah.name.includes(searchQuery);

    const matchesFilter = filterType === 'all' || surah.revelationType === filterType;
    return matchesSearch && matchesFilter;
  });

  // Arabic Font Size Classes
  const getArabicSizeClass = () => {
    if (fontSize === 'normal') return 'text-xl sm:text-2xl leading-loose';
    if (fontSize === 'xlarge') return 'text-3xl sm:text-4xl leading-[2.6]';
    return 'text-2xl sm:text-3xl leading-[2.4]';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-36 animate-fadeIn">
      {/* View 1: Surah Selection List & Bookmarks */}
      {!selectedSurah ? (
        <div className="space-y-6">
          {/* Header Title & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D9A514]/25">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEA] border border-[#D9A514]/40 text-[#7D5106] text-xs font-semibold mb-2 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#176B50]" />
                <span>ড. আবূ বকর মুহাম্মাদ যাকারিয়ার প্রামাণিক অনুবাদ (QuranEnc)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#493719] text-3d-raised font-bengali">
                পবিত্র আল-কুরআনুল কারীম
              </h1>
              <p className="text-[#5A4525] text-xs sm:text-sm font-bengali mt-1">
                ১১৪টি পূর্ণাঙ্গ সূরা, বিশুদ্ধ উসমানি লিপি, হুবহু প্রকাশিত বাংলা অনুবাদ ও বাস্তব মানুষের কণ্ঠের অডিও
              </p>
            </div>

            {/* Tabs: Surahs, Bookmarks, Offline */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 shadow-xs">
              <button
                onClick={() => setActiveTab('surahs')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bengali font-bold transition-all ${
                  activeTab === 'surahs'
                    ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs'
                    : 'text-[#7A6240] hover:text-[#493719]'
                }`}
              >
                সকল সূরা ({ALL_SURAHS.length})
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bengali font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'bookmarks'
                    ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs'
                    : 'text-[#7A6240] hover:text-[#493719]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                বুকমার্ক ({bookmarks.length})
              </button>
              <button
                onClick={() => setActiveTab('offline')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bengali font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'offline'
                    ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs'
                    : 'text-[#7A6240] hover:text-[#493719]'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                অফলাইন ({offlineStats.count})
              </button>
            </div>
          </div>

          {activeTab === 'surahs' ? (
            <>
              {/* Search & Revelation Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6240]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="সূরার নাম (বাংলা/ইংরেজি/আরবি) বা নম্বর দিয়ে খুঁজুন..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFFBEA] border border-[#D9A514]/35 text-[#493719] placeholder-[#7A6240]/60 text-sm focus:outline-none focus:border-[#D9A514] transition-colors font-bengali shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6240] hover:text-[#493719]"
                    >
                      মুছুন
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-2 rounded-xl text-xs font-bengali font-semibold transition-colors ${
                      filterType === 'all'
                        ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs'
                        : 'bg-[#FFFBEA] text-[#7A6240] border border-[#D9A514]/30 hover:bg-[#FFF7D6]'
                    }`}
                  >
                    সব ({ALL_SURAHS.length})
                  </button>
                  <button
                    onClick={() => setFilterType('Meccan')}
                    className={`px-3 py-2 rounded-xl text-xs font-bengali font-semibold transition-colors ${
                      filterType === 'Meccan'
                        ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs'
                        : 'bg-[#FFFBEA] text-[#7A6240] border border-[#D9A514]/30 hover:bg-[#FFF7D6]'
                    }`}
                  >
                    মাক্কী
                  </button>
                  <button
                    onClick={() => setFilterType('Medinan')}
                    className={`px-3 py-2 rounded-xl text-xs font-bengali font-semibold transition-colors ${
                      filterType === 'Medinan'
                        ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs'
                        : 'bg-[#FFFBEA] text-[#7A6240] border border-[#D9A514]/30 hover:bg-[#FFF7D6]'
                    }`}
                  >
                    মাদানী
                  </button>
                </div>
              </div>

              {/* Translation Source Attribution Banner */}
              <div className="p-3.5 rounded-2xl bg-[#FFFBEA] border border-[#D9A514]/30 card-3d flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#176B50] shrink-0" />
                  <span className="text-[#493719] font-bengali">
                    মূল বাংলা অনুবাদ: <strong>ড. আবূ বকর মুহাম্মাদ যাকারিয়া</strong> | উৎস: <strong>QuranEnc.com</strong> (বাদশাহ ফাহাদ কুরআন কমপ্লেক্স অনুমোদিত)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#7A6240] font-sans text-[11px]">
                  <span>Verbatim Published Text</span>
                  <span>•</span>
                  <span>No AI Alterations</span>
                </div>
              </div>

              {/* 114 Surahs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredSurahs.map((surah) => {
                  const offline = isSurahOffline(surah.number);
                  return (
                    <div
                      key={surah.number}
                      onClick={() => loadSurah(surah)}
                      className="group relative cursor-pointer p-4 rounded-2xl bg-[#FFFBEA] border border-[#D9A514]/30 hover:border-[#D9A514] card-3d card-3d-hover transition-all flex items-center justify-between shadow-xs"
                    >
                      {/* Left: Number and Names */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/40 flex items-center justify-center text-[#8C6207] font-bold font-mono text-sm group-hover:border-[#D9A514] group-hover:scale-105 transition-all shadow-inner relative">
                          {surah.number}
                          {offline && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#176B50] rounded-full border border-[#FFFBEA]" title="অফলাইনে সংরক্ষিত" />
                          )}
                        </div>
                        <div>
                          <div className="font-bengali font-bold text-base text-[#493719] text-3d-raised group-hover:text-[#8C6207] transition-colors">
                            {surah.banglaName}
                          </div>
                          <div className="text-xs text-[#7A6240] font-sans mt-0.5 flex items-center gap-1.5">
                            <span>{surah.englishName}</span>
                            <span>•</span>
                            <span className="text-[11px] text-[#8C6207] font-bengali font-medium">
                              {surah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'} ({surah.numberOfAyahs} আয়াত)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Arabic Calligraphy Name */}
                      <div className="text-right">
                        <span className="font-arabic text-xl sm:text-2xl text-[#382507] text-3d-arabic group-hover:text-[#8C6207] font-bold drop-shadow-xs">
                          {surah.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : activeTab === 'offline' ? (
            /* Offline Synced Surahs View */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFFBEA] border border-[#D9A514]/35 card-3d flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="font-bold text-[#8C6207] font-bengali text-sm">
                    ডিভাইসে সংরক্ষিত ডেটা (Offline Storage)
                  </h3>
                  <p className="text-[#5A4525] font-bengali mt-0.5">
                    মোট সংরক্ষিত: {offlineStats.count}টি সূরা (~{offlineStats.estimatedSizeKb} KB)। ইন্টারনেট ছাড়াই যে কোনো সময় পড়া যাবে।
                  </p>
                </div>
              </div>

              {offlineStats.count === 0 ? (
                <div className="text-center py-16 space-y-3 bg-[#FFFBEA] rounded-3xl border border-dashed border-[#D9A514]/40 p-6 card-3d">
                  <Download className="w-12 h-12 text-[#D9A514]/50 mx-auto" />
                  <h3 className="text-base font-bold text-[#493719] font-bengali">
                    এখনো কোনো সূরা অফলাইনে সংরক্ষিত নেই
                  </h3>
                  <p className="text-xs text-[#7A6240] font-bengali max-w-sm mx-auto">
                    যেকোনো সূরা পড়ার সময় উপরের “অফলাইন সিঙ্ক” বাটনে ক্লিক করে ডিভাইসে সংরক্ষণ করতে পারবেন।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {ALL_SURAHS.filter((s) => isSurahOffline(s.number)).map((surah) => (
                    <div
                      key={surah.number}
                      onClick={() => loadSurah(surah)}
                      className="cursor-pointer p-4 rounded-2xl bg-[#FFFBEA] border border-[#D9A514]/35 hover:border-[#D9A514] card-3d card-3d-hover flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#176B50] shrink-0" />
                        <div>
                          <div className="font-bold text-[#493719] font-bengali text-sm">
                            {surah.banglaName}
                          </div>
                          <div className="text-xs text-[#8C6207] font-sans font-medium">
                            {surah.numberOfAyahs} আয়াত • অফলাইনে প্রস্তুত
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8C6207]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Bookmarks View */
            <div className="space-y-3">
              {bookmarks.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-[#FFFBEA] rounded-3xl border border-dashed border-[#D9A514]/40 p-6 card-3d">
                  <Bookmark className="w-12 h-12 text-[#D9A514]/50 mx-auto" />
                  <h3 className="text-base font-bold text-[#493719] font-bengali">
                    কোনো সংরক্ষিত বুকমার্ক নেই
                  </h3>
                  <p className="text-xs text-[#7A6240] font-bengali max-w-sm mx-auto">
                    যেকোনো সূরা পড়ার সময় আয়াতের পাশে বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করতে পারবেন।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      className="p-4 rounded-2xl bg-[#FFFBEA] border border-[#D9A514]/30 space-y-2 hover:border-[#D9A514] transition-colors card-3d shadow-sm"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#D9A514]/20">
                        <div className="font-bengali font-bold text-[#8C6207] text-sm">
                          {bm.surahName} : আয়াত {bm.ayahNumber}
                        </div>
                        <button
                          onClick={() => {
                            const surahMeta = ALL_SURAHS.find((s) => s.number === bm.surahNumber);
                            if (surahMeta) loadSurah(surahMeta, bm.ayahNumber - 1);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#FFF7D6] hover:bg-[#FFFBEA] border border-[#D9A514]/40 text-[#8C6207] text-xs font-bengali font-bold flex items-center gap-1 shadow-xs"
                        >
                          <span>পড়ুন</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-arabic text-lg text-[#382507] text-3d-arabic text-right leading-relaxed">
                        {bm.arabicText}
                      </p>
                      {bm.translationBn && (
                        <p className="text-xs text-[#5A4525] font-bengali pt-1 border-t border-[#D9A514]/15">
                          {bm.translationBn}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* View 2: Surah Reader Screen — Premium Ivory Paper Book Aesthetic */
        <div
          className="rounded-3xl border border-[#E5D6B3] bg-[#F7F0D8] p-4 sm:p-7 space-y-6 shadow-2xl relative text-[#302719] transition-colors"
          style={{
            backgroundImage: 'radial-gradient(#E5D6B3 0.65px, transparent 0.65px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Top Bar: Back button, Surah Title, Settings */}
          <div className="sticky top-16 z-20 backdrop-blur-xl bg-[#F7F0D8]/95 py-3 px-4 rounded-2xl border border-[#E5D6B3] flex items-center justify-between shadow-sm">
            <button
              onClick={() => setSelectedSurah(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBF5E6] hover:bg-[#EFE5CC] border border-[#E5D6B3] text-[#302719] text-xs sm:text-sm font-bengali transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#8A5A3B]" />
              <span>সূরার তালিকা</span>
            </button>

            <div className="text-center truncate px-2">
              <div className="font-bengali font-bold text-[#302719] text-base sm:text-lg truncate">
                {selectedSurah.banglaName}
              </div>
              <div className="text-[11px] text-[#7A6240] font-sans flex items-center justify-center gap-1">
                <span>{selectedSurah.englishName}</span>
                <span>•</span>
                <span>{selectedSurah.numberOfAyahs} আয়াত</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Offline Sync Button */}
              <button
                onClick={handleOfflineSync}
                disabled={syncingOffline}
                title={isCurrentSurahOffline ? 'অফলাইনে সংরক্ষিত আছে' : 'অফলাইনে সংরক্ষণ করুন'}
                className={`p-2 rounded-xl border transition-all ${
                  isCurrentSurahOffline
                    ? 'bg-[#EAE0C4] border-[#B8A57E] text-[#176B50]'
                    : 'bg-[#FBF5E6] border-[#E5D6B3] text-[#7A6240] hover:bg-[#EFE5CC]'
                }`}
              >
                {syncingOffline ? (
                  <div className="w-4 h-4 border-2 border-[#8A5A3B] border-t-transparent rounded-full animate-spin" />
                ) : isCurrentSurahOffline ? (
                  <CheckCircle2 className="w-4 h-4 text-[#176B50]" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setShowControls(!showControls)}
                title="ডিসপ্লে অপশন ও ফন্ট সাইজ"
                className={`p-2 rounded-xl border transition-colors ${
                  showControls
                    ? 'bg-[#8A5A3B] border-[#8A5A3B] text-[#FBF5E6]'
                    : 'bg-[#FBF5E6] border-[#E5D6B3] text-[#7A6240] hover:text-[#302719] hover:bg-[#EFE5CC]'
                }`}
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reader Display Settings Panel */}
          {showControls && (
            <div className="p-4 rounded-2xl bg-[#FBF5E6] border border-[#E5D6B3] space-y-3 animate-scaleUp shadow-sm text-[#302719]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Translation Toggles */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8A5A3B] font-bengali font-bold">অনুবাদ:</span>
                  <button
                    onClick={() => setShowBengali(!showBengali)}
                    className={`px-3 py-1 rounded-lg text-xs font-bengali font-medium transition-colors ${
                      showBengali
                        ? 'bg-[#8A5A3B] border border-[#8A5A3B] text-white shadow-sm'
                        : 'bg-[#F7F0D8] border border-[#E5D6B3] text-[#7A6240]'
                    }`}
                  >
                    বাংলা (ড. যাকারিয়া) {showBengali ? '✓' : ''}
                  </button>
                  <button
                    onClick={() => setShowEnglish(!showEnglish)}
                    className={`px-3 py-1 rounded-lg text-xs font-sans font-medium transition-colors ${
                      showEnglish
                        ? 'bg-[#8A5A3B] border border-[#8A5A3B] text-white shadow-sm'
                        : 'bg-[#F7F0D8] border border-[#E5D6B3] text-[#7A6240]'
                    }`}
                  >
                    English (Saheeh) {showEnglish ? '✓' : ''}
                  </button>
                </div>

                {/* Font Size Adjuster */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8A5A3B] font-bengali font-bold">ফন্ট সাইজ:</span>
                  {(['normal', 'large', 'xlarge'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`px-2.5 py-1 rounded-lg text-xs uppercase font-mono font-bold transition-colors ${
                        fontSize === sz
                          ? 'bg-[#8A5A3B] border border-[#8A5A3B] text-white shadow-sm'
                          : 'bg-[#F7F0D8] border border-[#E5D6B3] text-[#7A6240]'
                      }`}
                    >
                      {sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Surah Banner Header with Ornate Unwan / Frontispiece Aesthetic */}
          <div className="relative overflow-hidden rounded-3xl bg-[#FBF5E6] border-2 border-[#E5D6B3] p-6 sm:p-8 text-center space-y-3 shadow-md">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7F0D8] border border-[#E5D6B3] text-[#7A6240] text-xs font-medium">
              <span>{selectedSurah.revelationType === 'Meccan' ? 'মাক্কী সূরা' : 'মাদানী সূরা'}</span>
              <span>•</span>
              <span>সূরা নং {selectedSurah.number}</span>
              <span>•</span>
              <span>{selectedSurah.numberOfAyahs} আয়াত</span>
            </div>

            <h2 className="font-arabic text-4xl sm:text-5xl text-[#8A5A3B] font-bold drop-shadow-sm">
              {selectedSurah.name}
            </h2>
            <div className="text-lg font-bold text-[#302719] font-bengali">
              {selectedSurah.banglaName} ({selectedSurah.banglaMeaning})
            </div>
            <div className="text-xs text-[#7A6240] font-cinzel">
              {selectedSurah.englishName} — {selectedSurah.englishNameTranslation}
            </div>

            {/* Official Attribution Badge for Dr. Zakaria */}
            <div className="mx-auto max-w-xl p-2.5 rounded-xl bg-[#F7F0D8] border border-[#E5D6B3] text-[11px] text-[#5A4527] font-bengali text-center leading-relaxed">
              অনুবাদ: <strong>ড. আবূ বকর মুহাম্মাদ যাকারিয়া</strong> | উৎস: <strong>QuranEnc.com</strong> (বাদশাহ ফাহাদ কুরআন মুদ্রণ কমপ্লেক্স অনুমোদিত)। প্রতিটি আয়াত অবিকৃত ও হুবহু মূল প্রকাশনা অনুসারে রক্ষিত।
            </div>

            {/* Bismillah Header (except for Surah At-Tawbah 9) */}
            {selectedSurah.number !== 9 && (
              <div className="pt-3 border-t border-[#E5D6B3]">
                <span className="font-arabic text-2xl sm:text-3xl text-[#8A5A3B] tracking-wider">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </span>
                <p className="text-xs text-[#7A6240] font-bengali mt-1">
                  পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি
                </p>
              </div>
            )}

            {/* Real Audio Action Bar (No AI TTS) */}
            <div className="pt-4 border-t border-[#E5D6B3] flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-bengali text-[#7A6240] font-bold mr-1">বাস্তব অডিও শুনুন:</span>
              <button
                onClick={() => playAyah(0, 'ar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bengali font-semibold transition-all flex items-center gap-1.5 ${
                  isPlaying && audioMode === 'ar'
                    ? 'bg-[#8A5A3B] text-[#FBF5E6] shadow-md font-bold'
                    : 'bg-[#F7F0D8] hover:bg-[#EFE5CC] border border-[#E5D6B3] text-[#302719]'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>আরবি তিলাওয়াত ({activeReciter.banglaName})</span>
              </button>

              <button
                onClick={() => playAyah(0, 'bn_surah')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bengali font-semibold transition-all flex items-center gap-1.5 ${
                  isPlaying && audioMode === 'bn_surah'
                    ? 'bg-[#8A5A3B] text-[#FBF5E6] shadow-md font-bold'
                    : 'bg-[#F7F0D8] hover:bg-[#EFE5CC] border border-[#E5D6B3] text-[#302719]'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-[#8A5A3B]" />
                <span>বাংলা অর্থ পাঠ (সৈয়দ ইসমত তোহা)</span>
              </button>

              <button
                onClick={() => playAyah(0, 'en')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all flex items-center gap-1.5 ${
                  isPlaying && audioMode === 'en'
                    ? 'bg-[#8A5A3B] text-[#FBF5E6] shadow-md font-bold'
                    : 'bg-[#F7F0D8] hover:bg-[#EFE5CC] border border-[#E5D6B3] text-[#302719]'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-[#8A5A3B]" />
                <span>English Audio (Ibrahim Walk)</span>
              </button>
            </div>
          </div>

          {/* Single Ayah Bengali Notice (When clicked) */}
          {singleAyahNotice && (
            <div className="p-4 rounded-2xl bg-[#FFF5DB] border border-[#D8BE82] text-[#6B4B18] text-xs flex items-start gap-3 shadow-sm animate-fadeIn">
              <Info className="w-5 h-5 text-[#8A5A3B] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-[#8A5A3B] font-bengali">
                  বাংলা অডিও এখনো উপলব্ধ নয় (আয়াতভিত্তিক)
                </div>
                <p className="text-[#5A4018] font-bengali leading-relaxed">
                  {singleAyahNotice}
                </p>
              </div>
              <button
                onClick={() => setSingleAyahNotice(null)}
                className="text-xs text-[#8A5A3B] hover:text-[#302719] ml-auto"
              >
                ✕
              </button>
            </div>
          )}

          {/* Loading or Error State */}
          {loading ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-12 h-12 border-3 border-[#8A5A3B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-[#7A6240] font-bengali text-sm animate-pulse">
                সূরা {selectedSurah.banglaName} এবং ড. আবূ বকর মুহাম্মাদ যাকারিয়ার অনুবাদ লোড হচ্ছে...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-[#FDE8E8] border border-red-300 text-center space-y-4 max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
              <p className="text-red-800 text-sm font-bengali">{error}</p>
              <button
                onClick={() => loadSurah(selectedSurah)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bengali font-bold transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>পুনরায় চেষ্টা করুন</span>
              </button>
            </div>
          ) : (
            /* Ayahs List — Premium Ivory/Yellow Paper Aesthetic */
            <div className="space-y-4">
              {ayahs.map((ayah, index) => {
                const isCurrentPlaying = isPlaying && currentAyahIndex === index;
                const bookmarked = isBookmarked(ayah.numberInSurah);
                const isFootnoteOpen = Boolean(expandedFootnotes[ayah.numberInSurah]);

                return (
                  <div
                    key={ayah.number}
                    ref={(el) => {
                      ayahRefs.current[index] = el;
                    }}
                    className={`relative p-5 sm:p-7 rounded-3xl border transition-all duration-300 ${
                      isCurrentPlaying
                        ? 'bg-[#FFFBEF] border-[#B58A35] ring-2 ring-[#B58A35]/30 shadow-md'
                        : 'bg-[#FBF5E6] border-[#E5D6B3] hover:border-[#CDBE99] shadow-sm'
                    }`}
                  >
                    {/* Top Verse Row: Ayah badge & actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5D6B3] text-xs">
                      {/* Verse Number Badge */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#F7F0D8] border border-[#E5D6B3] flex items-center justify-center text-[#8A5A3B] font-bold font-mono text-xs shadow-inner">
                          {ayah.numberInSurah}
                        </div>
                        <span className="text-[11px] text-[#7A6240] font-sans">
                          {selectedSurah.number}:{ayah.numberInSurah}
                        </span>
                        {ayah.sajda && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F7F0D8] text-[#8A5A3B] text-[10px] font-bengali font-bold border border-[#E5D6B3]">
                            সিজদা
                          </span>
                        )}
                      </div>

                      {/* Action buttons: Play Real Arabic, Bengali Status, English Human Audio, Bookmark, Copy */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Play Real Arabic Recitation */}
                        <button
                          onClick={() => playAyah(index, 'ar')}
                          title="বাস্তব ক্বারীর আরবি তিলাওয়াত শুনুন"
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bengali font-semibold transition-colors flex items-center gap-1 ${
                            isCurrentPlaying && audioMode === 'ar'
                              ? 'bg-[#8A5A3B] text-[#FBF5E6] font-bold shadow-sm'
                              : 'bg-[#F7F0D8] hover:bg-[#EFE5CC] border border-[#E5D6B3] text-[#302719]'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>আরবি তিলাওয়াত</span>
                        </button>

                        {/* Bengali Audio (Human Studio status) */}
                        <button
                          onClick={() => handleSingleAyahBengaliClick(ayah.numberInSurah)}
                          title="বাংলা অডিও স্ট্যাটাস"
                          className="px-2.5 py-1.5 rounded-xl text-[11px] font-bengali transition-colors flex items-center gap-1 bg-[#F7F0D8] hover:bg-[#EFE5CC] text-[#7A6240] border border-[#E5D6B3]"
                        >
                          <Volume2 className="w-3 h-3 text-[#8A5A3B]" />
                          <span>বাংলা অডিও</span>
                        </button>

                        {/* Play Real English Studio Audio by Ibrahim Walk */}
                        <button
                          onClick={() => playAyah(index, 'en')}
                          title="Play English Audio by Ibrahim Walk"
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-sans font-semibold transition-colors flex items-center gap-1 ${
                            isCurrentPlaying && audioMode === 'en'
                              ? 'bg-[#8A5A3B] text-[#FBF5E6] font-bold shadow-sm'
                              : 'bg-[#F7F0D8] hover:bg-[#EFE5CC] border border-[#E5D6B3] text-[#7A6240]'
                          }`}
                        >
                          <Volume2 className="w-3 h-3 text-[#8A5A3B]" />
                          <span>English</span>
                        </button>

                        <button
                          onClick={() => toggleBookmark(ayah)}
                          title={bookmarked ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'}
                          className={`p-2 rounded-xl transition-colors ${
                            bookmarked
                              ? 'bg-[#F7E7C4] text-[#8A5A3B] border border-[#C8B78C]'
                              : 'bg-[#F7F0D8] hover:bg-[#EFE5CC] border border-[#E5D6B3] text-[#7A6240]'
                          }`}
                        >
                          {bookmarked ? (
                            <BookmarkCheck className="w-4 h-4 fill-[#8A5A3B]/40 text-[#8A5A3B]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => copyAyah(ayah)}
                          title="আয়াত ও অনুবাদ কপি করুন"
                          className="p-2 rounded-xl bg-[#F7F0D8] hover:bg-[#EFE5CC] border border-[#E5D6B3] text-[#7A6240] hover:text-[#302719] transition-colors"
                        >
                          {copiedAyahNum === ayah.numberInSurah ? (
                            <Check className="w-4 h-4 text-[#176B50]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Pristine Arabic Text — Deep Archival Ink */}
                    <div className="py-4 text-right">
                      <p
                        className={`font-arabic text-[#1C150B] select-all leading-[2.2] ${getArabicSizeClass()}`}
                        dir="rtl"
                      >
                        {ayah.text}
                      </p>
                    </div>

                    {/* Translations — Exact #302719 requested */}
                    <div className="space-y-2.5 pt-3 border-t border-[#E5D6B3]">
                      {showBengali && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8A5A3B] font-bengali">
                              অনুবাদ: ড. আবূ বকর মুহাম্মাদ যাকারিয়া (QuranEnc)
                            </span>
                            {ayah.footnotes && (
                              <button
                                onClick={() => toggleFootnote(ayah.numberInSurah)}
                                className="text-[11px] text-[#8A5A3B] hover:text-[#684126] underline font-bengali flex items-center gap-1"
                              >
                                <span>{isFootnoteOpen ? 'টীকা লুকান' : 'টীকা ও ব্যাখ্যা দেখুন'}</span>
                              </button>
                            )}
                          </div>
                          <p className="text-[#302719] text-sm sm:text-base font-bengali leading-relaxed select-all">
                            {ayah.translationBn}
                          </p>

                          {/* Expandable Footnote by Dr. Zakaria */}
                          {isFootnoteOpen && ayah.footnotes && (
                            <div className="p-3.5 mt-2 rounded-2xl bg-[#F0E5C9] border border-[#D8C7A0] text-xs font-bengali text-[#302719] leading-relaxed space-y-1 animate-fadeIn">
                              <div className="font-bold text-[#8A5A3B] flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-[#8A5A3B]" />
                                <span>ড. যাকারিয়ার সংক্ষিপ্ত ব্যাখ্যা ও টীকা:</span>
                              </div>
                              <div className="whitespace-pre-wrap select-all text-[#302719] pt-1 border-t border-[#D8C7A0]">
                                {ayah.footnotes}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {showEnglish && (
                        <div className="space-y-1 pt-2 border-t border-[#E5D6B3]/60">
                          <div className="text-[10px] uppercase font-semibold tracking-wider text-[#7A6240] font-sans">
                            English Translation (Saheeh International)
                          </div>
                          <p className="text-[#574836] text-sm font-sans leading-relaxed select-all">
                            {ayah.translationEn}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Next / Previous Surah Navigation Bar */}
          {!loading && !error && (
            <div className="pt-6 flex items-center justify-between gap-4 border-t border-[#E5D6B3]">
              <button
                onClick={goToPrevSurah}
                disabled={selectedSurah.number <= 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBF5E6] hover:bg-[#EFE5CC] disabled:opacity-40 border border-[#E5D6B3] text-[#302719] text-xs sm:text-sm font-bengali transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#8A5A3B]" />
                <span>পূর্ববর্তী সূরা</span>
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs text-[#8A5A3B] hover:underline font-bengali"
              >
                উপরে যান ↑
              </button>

              <button
                onClick={goToNextSurah}
                disabled={selectedSurah.number >= 114}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBF5E6] hover:bg-[#EFE5CC] disabled:opacity-40 border border-[#E5D6B3] text-[#302719] text-xs sm:text-sm font-bengali transition-colors"
              >
                <span>পরবর্তী সূরা</span>
                <ChevronRight className="w-4 h-4 text-[#8A5A3B]" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
