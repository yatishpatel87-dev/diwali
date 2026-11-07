import React from 'react';
import { GameTab, Language } from '../types/game';
import { t } from '../utils/translations';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, Languages } from 'lucide-react';

interface HeaderProps {
  currentTab: GameTab;
  setTab: (tab: GameTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setTab,
  lang,
  setLang,
  isMuted,
  setIsMuted
}) => {
  const currentT = t[lang];

  const navItems: { id: GameTab; label: string }[] = [
    { id: 'diyas', label: currentT.tabs.diyas },
    { id: 'rangoli', label: currentT.tabs.rangoli },
    { id: 'fireworks', label: currentT.tabs.fireworks },
    { id: 'mithai', label: currentT.tabs.mithai },
    { id: 'puja', label: currentT.tabs.puja },
    { id: 'greetings', label: currentT.tabs.greetings },
  ];

  const handleToggleSound = () => {
    const newState = sound.toggleMute();
    setIsMuted(newState);
  };

  const handleToggleLang = () => {
    const nextLang: Language = lang === 'gu' ? 'en' : 'gu';
    setLang(nextLang);
    sound.playDiyaLight();
  };

  return (
    <header className="sticky top-0 z-50 bg-amber-950/90 backdrop-blur-md border-b border-amber-800/40 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div 
          onClick={() => { setTab('diyas'); sound.playDiyaLight(); }}
          className="flex items-center gap-2 cursor-pointer group whitespace-nowrap shrink-0"
        >
          <span className="text-xl md:text-2xl font-bold tracking-tight text-amber-200 group-hover:text-amber-100 transition-colors flex items-center gap-2">
            <span className="text-amber-400">🪔</span>
            <span>{currentT.appTitle}</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  sound.playDiyaLight();
                }}
                className={`px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                    : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/30'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Utility Controls & Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-lg bg-amber-900/40 border border-amber-800/60 text-amber-300 hover:text-amber-100 hover:bg-amber-800/50 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={handleToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-900/40 border border-amber-800/60 text-amber-200 hover:text-amber-100 hover:bg-amber-800/50 transition-colors whitespace-nowrap shrink-0"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'gu' ? 'English' : 'ગુજરાતી'}</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto pt-2.5 pb-0.5 scrollbar-none border-t border-amber-900/30 mt-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                sound.playDiyaLight();
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-amber-600/40 text-amber-100 border border-amber-500/50'
                  : 'text-amber-300/80 hover:text-amber-100 bg-amber-950/40'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
