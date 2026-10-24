import React from 'react';
import { BookOpen, Sparkles, Settings, Info, Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  isPlayingAudio?: boolean;
  demoMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenAbout,
  isPlayingAudio,
  demoMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#FFFBEA]/95 border-b border-[#D9A514]/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/50 flex items-center justify-center shadow-sm group-hover:border-[#D9A514] transition-colors">
            <span className="font-arabic text-[#176B50] text-lg font-bold">قرآن</span>
            {isPlayingAudio && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9A514] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D9A514]"></span>
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bengali font-bold text-base sm:text-lg text-[#493719] text-3d-raised group-hover:text-[#8C6207] transition-colors">
                রাফিক ইসলামিক এআই
              </span>
              {demoMode && (
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-semibold rounded bg-[#F5E6B8] border border-[#D9A514]/50 text-[#7D5106]">
                  Demo Mode
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#7A6240] font-cinzel tracking-wider hidden sm:block">
              Rafik Islamic AI
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bengali font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-[#D9A514]/25 text-[#382507] font-bold border border-[#D9A514]/50 shadow-sm'
                : 'text-[#69522D] hover:text-[#382507] hover:bg-[#FFF7D6]'
            }`}
          >
            হোম
          </button>
          <button
            onClick={() => setActiveTab('quran')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bengali font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'quran'
                ? 'bg-[#D9A514]/25 text-[#382507] font-bold border border-[#D9A514]/50 shadow-sm'
                : 'text-[#69522D] hover:text-[#382507] hover:bg-[#FFF7D6]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#176B50]" />
            আল-কুরআন
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bengali font-medium transition-all ${
              activeTab === 'library'
                ? 'bg-[#D9A514]/25 text-[#382507] font-bold border border-[#D9A514]/50 shadow-sm'
                : 'text-[#69522D] hover:text-[#382507] hover:bg-[#FFF7D6]'
            }`}
          >
            ইসলামিক লাইব্রেরি
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bengali font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-[#D9A514]/25 text-[#382507] font-bold border border-[#D9A514]/50 shadow-sm'
                : 'text-[#69522D] hover:text-[#382507] hover:bg-[#FFF7D6]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D9A514]" />
            AI সহকারী
          </button>
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAbout}
            title="তথ্য ও নির্ভরযোগ্য উৎস"
            className="p-2 rounded-xl text-[#69522D] hover:text-[#382507] hover:bg-[#FFF7D6] border border-[#D9A514]/30 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            title="সেটিংস ও ফন্ট নির্বাচন"
            className="p-2 rounded-xl text-[#69522D] hover:text-[#382507] hover:bg-[#FFF7D6] border border-[#D9A514]/30 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
