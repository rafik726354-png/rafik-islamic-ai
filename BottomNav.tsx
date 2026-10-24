import React from 'react';
import { Home, BookOpen, Library, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFBEA]/95 backdrop-blur-xl border-t border-[#D9A514]/30 px-3 py-2 flex items-center justify-around shadow-xl safe-area-bottom">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'home'
            ? 'text-[#8C6207] font-bold scale-105'
            : 'text-[#7A6240] hover:text-[#493719]'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-bengali">হোম</span>
      </button>

      <button
        onClick={() => setActiveTab('quran')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'quran'
            ? 'text-[#8C6207] font-bold scale-105'
            : 'text-[#7A6240] hover:text-[#493719]'
        }`}
      >
        <BookOpen className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-bengali">আল-কুরআন</span>
      </button>

      <button
        onClick={() => setActiveTab('library')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'library'
            ? 'text-[#8C6207] font-bold scale-105'
            : 'text-[#7A6240] hover:text-[#493719]'
        }`}
      >
        <Library className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-bengali">লাইব্রেরি</span>
      </button>

      <button
        onClick={() => setActiveTab('ai')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'ai'
            ? 'text-[#8C6207] font-bold scale-105'
            : 'text-[#7A6240] hover:text-[#493719]'
        }`}
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D9A514] animate-ping"></span>
        </div>
        <span className="text-[11px] font-bengali">AI সহকারী</span>
      </button>
    </nav>
  );
};
