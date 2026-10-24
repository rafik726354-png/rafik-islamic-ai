import React, { useState, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  BookMarked,
  BookOpen,
  Scroll,
  Heart,
  Compass,
  Scale,
  GraduationCap,
  ShieldCheck,
  X,
  Bookmark,
  BookmarkCheck,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { ISLAMIC_LIBRARY_ITEMS } from '../data/libraryData';
import { LibraryItem } from '../types/quran';

export const IslamicLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeBookDetail, setActiveBookDetail] = useState<LibraryItem | null>(null);
  const [savedBookIds, setSavedBookIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('rafik_saved_library_books');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const categories = [
    { id: 'all', labelBn: 'সকল কিতাব', icon: BookOpen },
    { id: 'quran-tafsir', labelBn: 'কুরআন ও তাফসির', icon: BookMarked },
    { id: 'hadith', labelBn: 'হাদিস গ্রন্থ', icon: Scroll },
    { id: 'dua-dhikr', labelBn: 'দোয়া ও জিকির', icon: Heart },
    { id: 'seerah', labelBn: 'সীরাতুন নবী (সাঃ)', icon: Compass },
    { id: 'aqidah', labelBn: 'আকিদা ও তাওহিদ', icon: ShieldCheck },
    { id: 'fiqh', labelBn: 'ফিকহ ও মাসআলা', icon: Scale },
    { id: 'learning', labelBn: 'দ্বীনি জ্ঞান ও রেফারেন্স', icon: GraduationCap },
  ];

  const toggleSaveBook = (bookId: string) => {
    setSavedBookIds((prev) => {
      const updated = prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId];
      try {
        localStorage.setItem('rafik_saved_library_books', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save library preference:', e);
      }
      return updated;
    });
  };

  const filteredItems = ISLAMIC_LIBRARY_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      item.titleBn.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.authorBn.toLowerCase().includes(q) ||
      (item.translatorBn && item.translatorBn.toLowerCase().includes(q)) ||
      (item.publisherBn && item.publisherBn.toLowerCase().includes(q)) ||
      item.descriptionBn.toLowerCase().includes(q) ||
      item.sourceName.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveBookDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-36 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#D9A514]/25">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7D5106] font-semibold mb-1.5 font-bengali">
            <ShieldCheck className="w-4 h-4 text-[#176B50] shrink-0" />
            <span>প্রামাণিক ও নির্ভরযোগ্য ইসলামিক লাইব্রেরি</span>
            <span aria-hidden="true" className="text-[#D9A514]">·</span>
            <span>মূল উৎস লিঙ্কযুক্ত</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#493719] text-3d-raised font-bengali">
            ইসলামিক লাইব্রেরি (Islamic Library)
          </h1>
          <p className="text-[#5A4525] text-xs sm:text-sm font-bengali mt-1 max-w-2xl">
            কুরআনের তাফসির, সহিহ হাদিসের প্রধান সংকলন, হিসনুল মুসলিম, সীরাতে রাসুল ও ফিকহের প্রামাণ্য আকর গ্রন্থসমূহ
          </p>
        </div>

        {/* Quiet Authority Footprint */}
        <div className="flex items-center gap-2 text-xs text-[#7A6240] font-sans">
          <span>QuranEnc</span>
          <span aria-hidden="true" className="text-[#D9A514]">·</span>
          <span>Sunnah.com</span>
          <span aria-hidden="true" className="text-[#D9A514]">·</span>
          <span>Quran.com</span>
          <span aria-hidden="true" className="text-[#D9A514]">·</span>
          <span>IslamHouse</span>
        </div>
      </div>

      {/* Search and Category Filter Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6240]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কিতাবের নাম, লেখক, অনুবাদক বা বিষয়বস্তু দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-16 py-3 rounded-2xl bg-[#FFFBEA] border border-[#D9A514]/35 text-[#493719] placeholder-[#7A6240]/60 text-sm focus:outline-none focus:border-[#D9A514] transition-colors font-bengali shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6240] hover:text-[#493719] font-bengali px-2 py-1"
            >
              মুছুন
            </button>
          )}
        </div>

        {/* Functional Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? ISLAMIC_LIBRARY_ITEMS.length
                : ISLAMIC_LIBRARY_ITEMS.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bengali font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs font-bold'
                    : 'bg-[#FFFBEA] hover:bg-[#FFF7D6] border border-[#D9A514]/30 text-[#7A6240]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#176B50]' : 'text-[#8C6207]'}`} />
                <span className="whitespace-nowrap">{cat.labelBn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isSelected ? 'bg-[#FFF7D6] text-[#382507] font-bold' : 'bg-[#FFF7D6] text-[#7A6240]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Realistic 3D Book Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const isSaved = savedBookIds.includes(item.id);
          const coverBg = item.coverColor || '#176B50';

          return (
            <div
              key={item.id}
              onClick={() => setActiveBookDetail(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveBookDetail(item)}
              className="group relative flex flex-col justify-between cursor-pointer rounded-2xl p-4 bg-[#FFFBEA] border border-[#D9A514]/30 hover:border-[#D9A514] card-3d card-3d-hover transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl text-left focus:outline-none focus:ring-2 focus:ring-[#D9A514]/50 shadow-xs"
            >
              {/* Realistic 3D Book Cover Presentation */}
              <div
                className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-xl mb-4 transition-transform duration-300 group-hover:scale-[1.02] flex flex-col justify-between p-4"
                style={{
                  backgroundColor: coverBg,
                  backgroundImage: `
                    linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.25) 100%),
                    radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 70%)
                  `
                }}
              >
                {/* 3D Realistic Spine Edge & Ridge (Left Side) */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-5 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.2) 35%, rgba(0,0,0,0.45) 85%, transparent 100%)',
                    boxShadow: 'inset 1px 0 2px rgba(255,255,255,0.15)'
                  }}
                >
                  {/* Spine Ribs / Blind Emboss Marks */}
                  <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-black/40 shadow-[0_1px_0_rgba(255,255,255,0.2)]" />
                  <div className="absolute top-2/4 left-0 right-0 h-[2px] bg-black/40 shadow-[0_1px_0_rgba(255,255,255,0.2)]" />
                  <div className="absolute top-3/4 left-0 right-0 h-[2px] bg-black/40 shadow-[0_1px_0_rgba(255,255,255,0.2)]" />
                </div>

                {/* Right Edge: Stacked Off-White Paper Pages Trim Effect */}
                <div
                  className="absolute right-0 top-1 bottom-1 w-1.5 pointer-events-none rounded-r-sm"
                  style={{
                    background: 'linear-gradient(to right, #C8B99D 0%, #F5ECD7 50%, #E3D4B6 100%)',
                    boxShadow: 'inset 0 0 2px rgba(0,0,0,0.3)'
                  }}
                />

                {/* Silk Ribbon Bookmark hanging at top right */}
                <div className="absolute top-0 right-5 w-3 h-8 bg-amber-400 shadow-md rounded-b-sm pointer-events-none flex flex-col justify-end">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-black/20 self-center" />
                </div>

                {/* Outer Embossed Gold Border Box */}
                <div className="absolute inset-2.5 sm:inset-3 border border-amber-300/40 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start text-amber-200/40 text-[9px]">
                    <span>✦</span>
                    <span>✦</span>
                  </div>
                  <div className="flex justify-between items-end text-amber-200/40 text-[9px]">
                    <span>✦</span>
                    <span>✦</span>
                  </div>
                </div>

                {/* Top Book Meta: Category & Recommended Badge */}
                <div className="relative z-10 flex items-center justify-between gap-1 pl-3">
                  <span className="text-[10px] uppercase font-sans tracking-widest text-amber-200/80">
                    {categories.find((c) => c.id === item.category)?.labelBn}
                  </span>
                  {item.recommendedTag && (
                    <span className="text-[9px] font-bengali font-bold text-amber-200 bg-black/30 px-1.5 py-0.5 rounded border border-amber-300/30">
                      ★ {item.recommendedTag}
                    </span>
                  )}
                </div>

                {/* Center Book Cover: Title & Calligraphic Flourish */}
                <div className="relative z-10 text-center my-auto pl-3 pr-2 space-y-1.5">
                  <h3 className="font-bengali font-bold text-base sm:text-lg text-amber-50 leading-snug drop-shadow-md group-hover:text-amber-200 transition-colors line-clamp-3">
                    {item.titleBn}
                  </h3>
                  <div className="w-12 h-[1px] bg-amber-300/40 mx-auto" />
                  <p className="text-[11px] font-sans text-amber-200/70 line-clamp-1 italic">
                    {item.titleEn}
                  </p>
                </div>

                {/* Bottom Book Cover: Author & Volume Badge */}
                <div className="relative z-10 pl-3 pr-1 pt-2 flex items-center justify-between text-xs text-amber-100/90 font-bengali border-t border-amber-300/20">
                  <span className="truncate text-[11px] font-medium max-w-[70%]">
                    {item.authorBn}
                  </span>
                  {item.totalVolumes ? (
                    <span className="text-[10px] font-sans font-bold text-amber-300 shrink-0">
                      {item.totalVolumes} {item.totalVolumes > 1 ? 'Volumes' : 'Vol'}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Quiet Text Metadata & Short Description (Zero-Pill Discipline) */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#176B50] font-bengali font-semibold">
                    <span>{item.authorBn}</span>
                    {item.totalVolumes ? (
                      <>
                        <span aria-hidden="true" className="text-[#D9A514]">·</span>
                        <span className="text-[#8C6207]">{item.totalVolumes} খণ্ড</span>
                      </>
                    ) : null}
                  </div>

                  <p className="text-xs text-[#5A4525] font-bengali line-clamp-2 mt-1.5 leading-relaxed">
                    {item.descriptionBn}
                  </p>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-[#D9A514]/25 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#7A6240] font-sans">
                    {item.sourceName}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveBook(item.id);
                      }}
                      title={isSaved ? 'সংরক্ষণ তালিকা থেকে সরান' : 'পছন্দের তালিকায় সংরক্ষণ করুন'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-[#D9A514]/20 border-[#D9A514] text-[#8C6207]'
                          : 'bg-[#FFF7D6] border-[#D9A514]/30 text-[#7A6240] hover:text-[#493719]'
                      }`}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-3.5 h-3.5 fill-[#D9A514]/40" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <span className="inline-flex items-center gap-1 text-xs text-[#8C6207] font-bengali font-bold group-hover:underline">
                      <span>বিস্তারিত</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clean Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-[#FFFBEA] rounded-3xl border border-dashed border-[#D9A514]/40 p-6 card-3d">
          <BookOpen className="w-12 h-12 text-[#D9A514]/50 mx-auto" />
          <h3 className="text-base font-bold text-[#493719] font-bengali">
            “{searchQuery}” দিয়ে কোনো কিতাব পাওয়া যায়নি
          </h3>
          <p className="text-xs text-[#7A6240] font-bengali max-w-sm mx-auto">
            অন্য কোনো শব্দ বা বিষয়ে অনুসন্ধান করুন অথবা ফিল্টার পরিবর্তন করুন।
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="btn-3d-subtle px-4 py-2 rounded-xl text-xs font-bengali font-bold"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}

      {/* Enhanced Book Detail View (Modal) */}
      {activeBookDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#FFFBEA] border border-[#D9A514]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp card-3d text-[#493719]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9A514]/30 bg-[#FFF7D6]">
              <div className="flex items-center gap-2 text-xs text-[#8C6207] font-bengali font-bold">
                <BookOpen className="w-4 h-4 text-[#176B50]" />
                <span>কিতাবের বিবরণ ও সূচিপত্র</span>
              </div>
              <button
                onClick={() => setActiveBookDetail(null)}
                className="p-1.5 rounded-xl bg-[#FFFBEA] border border-[#D9A514]/30 hover:bg-[#FFF7D6] text-[#7A6240] hover:text-[#493719] transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Top Split: 3D Book Cover + Metadata */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* 3D Showcase Cover */}
                <div
                  className="relative aspect-[3/4] w-40 sm:w-48 shrink-0 rounded-xl overflow-hidden shadow-2xl p-4 flex flex-col justify-between mx-auto sm:mx-0"
                  style={{
                    backgroundColor: activeBookDetail.coverColor || '#176B50',
                    backgroundImage: `
                      linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.3) 100%),
                      radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 70%)
                    `
                  }}
                >
                  {/* Spine ridge */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-5 pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.25) 35%, rgba(0,0,0,0.5) 85%, transparent 100%)'
                    }}
                  />
                  {/* Page trim */}
                  <div
                    className="absolute right-0 top-1 bottom-1 w-2 pointer-events-none rounded-r-sm"
                    style={{
                      background: 'linear-gradient(to right, #C8B99D 0%, #F5ECD7 50%, #E3D4B6 100%)'
                    }}
                  />
                  <div className="relative z-10 text-center my-auto pl-3 pr-2 space-y-2">
                    <h3 className="font-bengali font-bold text-base text-amber-50 drop-shadow-md leading-snug">
                      {activeBookDetail.titleBn}
                    </h3>
                    <div className="w-10 h-[1px] bg-amber-300/40 mx-auto" />
                    <p className="text-[10px] font-sans text-amber-200/80 italic">
                      {activeBookDetail.titleEn}
                    </p>
                  </div>
                  <div className="relative z-10 pl-3 text-center text-[10px] text-amber-200 font-bengali">
                    {activeBookDetail.authorBn}
                  </div>
                </div>

                {/* Metadata Column */}
                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#8C6207] font-bengali font-semibold">
                      <span>{categories.find((c) => c.id === activeBookDetail.category)?.labelBn}</span>
                      {activeBookDetail.recommendedTag && (
                        <>
                          <span aria-hidden="true" className="text-[#D9A514]">·</span>
                          <span className="text-[#176B50] font-bold">★ {activeBookDetail.recommendedTag}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#493719] text-3d-raised font-bengali mt-1">
                      {activeBookDetail.titleBn}
                    </h2>
                    <p className="text-xs text-[#7A6240] font-sans mt-0.5">
                      {activeBookDetail.titleEn}
                    </p>
                  </div>

                  {/* Structured Authority Metadata List */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF7D6] border border-[#D9A514]/30 text-xs font-bengali space-y-2 shadow-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-[#7D5106] shrink-0 font-bold w-20">লেখক:</span>
                      <span className="text-[#493719] font-semibold">{activeBookDetail.authorBn}</span>
                    </div>

                    {activeBookDetail.translatorBn && (
                      <div className="flex items-start gap-2 pt-1.5 border-t border-[#D9A514]/20">
                        <span className="text-[#7D5106] shrink-0 font-bold w-20">অনুবাদক:</span>
                        <span className="text-[#493719]">{activeBookDetail.translatorBn}</span>
                      </div>
                    )}

                    {activeBookDetail.publisherBn && (
                      <div className="flex items-start gap-2 pt-1.5 border-t border-[#D9A514]/20">
                        <span className="text-[#7D5106] shrink-0 font-bold w-20">প্রকাশনা/উৎস:</span>
                        <span className="text-[#493719]">{activeBookDetail.publisherBn}</span>
                      </div>
                    )}

                    {activeBookDetail.totalVolumes && (
                      <div className="flex items-start gap-2 pt-1.5 border-t border-[#D9A514]/20">
                        <span className="text-[#7D5106] shrink-0 font-bold w-20">মোট খণ্ড:</span>
                        <span className="text-[#8C6207] font-bold">{activeBookDetail.totalVolumes} খণ্ড</span>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={activeBookDetail.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d-gold px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bengali font-bold flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-[#176B50]" />
                      <span>অধ্যয়ন শুরু করুন (মূল পোর্টালে পড়ুন)</span>
                    </a>

                    <button
                      onClick={() => toggleSaveBook(activeBookDetail.id)}
                      className={`btn-3d-subtle px-4 py-2.5 rounded-xl border text-xs font-bengali font-semibold flex items-center gap-1.5 ${
                        savedBookIds.includes(activeBookDetail.id)
                          ? 'border-[#D9A514] text-[#8C6207] font-bold bg-[#FFF7D6]'
                          : ''
                      }`}
                    >
                      {savedBookIds.includes(activeBookDetail.id) ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 fill-[#D9A514]/40" />
                          <span>সংরক্ষিত আছে</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>সংরক্ষণ করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2 pt-2 border-t border-[#D9A514]/20">
                <h4 className="text-sm font-bold text-[#8C6207] font-bengali flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#176B50]" />
                  <span>সারসংক্ষেপ ও পরিচয়</span>
                </h4>
                <p className="text-[#5A4525] text-sm font-bengali leading-relaxed">
                  {activeBookDetail.descriptionBn}
                </p>
                <p className="text-[#7A6240] text-xs font-sans leading-relaxed pt-1">
                  {activeBookDetail.descriptionEn}
                </p>
              </div>

              {/* Genuine Volumes List (If Authenticated Multi-Volume Collection) */}
              {activeBookDetail.volumes && activeBookDetail.volumes.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#D9A514]/20">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#8C6207] font-bengali flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#176B50]" />
                      <span>খণ্ডসমূহের তালিকা ও বিষয়বস্তু ({activeBookDetail.volumes.length}টি খণ্ড)</span>
                    </h4>
                    <span className="text-[11px] text-[#176B50] font-bengali font-semibold">প্রামাণিক বিন্যাস</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                    {activeBookDetail.volumes.map((vol) => (
                      <div
                        key={vol.volumeNumber}
                        className="p-3 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 hover:border-[#D9A514] transition-colors space-y-1 text-xs shadow-xs"
                      >
                        <div className="font-bengali font-bold text-[#493719] flex items-center justify-between">
                          <span>{vol.titleBn}</span>
                          <span className="text-[10px] text-[#8C6207] font-mono font-bold">খণ্ড {vol.volumeNumber}</span>
                        </div>
                        {vol.descriptionBn && (
                          <p className="text-[11px] text-[#5A4525] font-bengali leading-relaxed">
                            {vol.descriptionBn}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="px-6 py-3 bg-[#FFF7D6] border-t border-[#D9A514]/30 flex items-center justify-between text-xs text-[#7A6240] font-bengali">
              <span>উৎস: {activeBookDetail.sourceName}</span>
              <button
                onClick={() => setActiveBookDetail(null)}
                className="text-[#8C6207] hover:text-[#493719] font-bold transition-colors"
              >
                বন্ধ করুন ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
