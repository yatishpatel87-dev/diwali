import React, { useState } from 'react';
import { GameTab, Language } from './types/game';
import { Header } from './components/Header';
import { DiyaLightingGame } from './components/DiyaLightingGame';
import { RangoliStudio } from './components/RangoliStudio';
import { FirecrackerSky } from './components/FirecrackerSky';
import { MithaiBonanzaGame } from './components/MithaiBonanzaGame';
import { LaxmiPujaAarti } from './components/LaxmiPujaAarti';
import { DiwaliCardMaker } from './components/DiwaliCardMaker';
import { t } from './utils/translations';
import { sound } from './utils/audio';
import { Sparkles, Compass, Flame } from 'lucide-react';

export default function App() {
  const [currentTab, setTab] = useState<GameTab>('diyas');
  const [lang, setLang] = useState<Language>('gu');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const currentT = t[lang];

  // Quick festive calendar days
  const festiveDays = [
    { dayGu: 'ધનતેરસ', dayEn: 'Dhanteras', descGu: 'લક્ષ્મી-કુબેર પૂજન', descEn: 'Prosperity & Wealth' },
    { dayGu: 'કાળી ચૌદશ', dayEn: 'Kali Chaudas', descGu: 'તેલના દીવા અને રક્ષા', descEn: 'Triumph over darkness' },
    { dayGu: 'દિવાળી', dayEn: 'Deepawali', descGu: 'ચોપડા પૂજન અને મહાલક્ષ્મી આરાધના', descEn: 'Festival of Lights' },
    { dayGu: 'બેસતું વર્ષ', dayEn: 'Bestu Varas', descGu: 'સાલ મુબારક - નૂતન વર્ષ', descEn: 'Gujarati New Year' },
    { dayGu: 'ભાઈબીજ', dayEn: 'Bhai Dooj', descGu: 'ભાઈ-બહેનનો સ્નેહ સંબંધ', descEn: 'Sibling Bond' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 via-[#1e0e06] to-[#120603] text-amber-50 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-900">
      {/* Top Bar strictly following contract */}
      <Header
        currentTab={currentTab}
        setTab={setTab}
        lang={lang}
        setLang={setLang}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-8 space-y-8">
        {/* Festive Welcome Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-700/40 bg-gradient-to-r from-amber-950 via-amber-900/60 to-amber-950 p-6 md:p-8 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
                <span>🪔</span>
                <span>{currentT.appSubtitle}</span>
                <span>·</span>
                <span>વિક્રમ સંવત ૨૦૮૩</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-amber-100 tracking-tight font-display">
                {currentT.happyDiwali}
              </h1>
              <p className="text-xs md:text-sm text-amber-200/80 max-w-2xl leading-relaxed">
                {lang === 'gu'
                  ? 'દીવા પ્રગટાવો, રંગોળી સજાવો, પર્યાવરણને અનુકૂળ આતશબાજી માણો, સ્વાદિષ્ટ ગુજરાતી મિઠાઈઓ ઝીલો અને મા લક્ષ્મીની મંગલ આરતી કરો.'
                  : 'Experience the magic of Diwali with authentic interactive games: light the sacred courtyard diyas, create radial rangolis, celebrate with safe eco-fireworks, catch traditional sweets, and perform Aarti.'}
              </p>
            </div>

            {/* Quick Game Mode Switcher Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setTab('diyas'); sound.playDiyaLight(); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'diyas'
                    ? 'bg-amber-500 text-amber-950 shadow-md font-bold'
                    : 'bg-amber-950/70 border border-amber-700/60 text-amber-200 hover:bg-amber-900/50'
                }`}
              >
                <span>🪔</span>
                <span>{currentT.tabs.diyas}</span>
              </button>

              <button
                onClick={() => { setTab('rangoli'); sound.playDiyaLight(); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'rangoli'
                    ? 'bg-amber-500 text-amber-950 shadow-md font-bold'
                    : 'bg-amber-950/70 border border-amber-700/60 text-amber-200 hover:bg-amber-900/50'
                }`}
              >
                <span>🎨</span>
                <span>{currentT.tabs.rangoli}</span>
              </button>

              <button
                onClick={() => { setTab('fireworks'); sound.playRocketWhistle(); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'fireworks'
                    ? 'bg-amber-500 text-amber-950 shadow-md font-bold'
                    : 'bg-amber-950/70 border border-amber-700/60 text-amber-200 hover:bg-amber-900/50'
                }`}
              >
                <span>🎆</span>
                <span>{currentT.tabs.fireworks}</span>
              </button>

              <button
                onClick={() => { setTab('mithai'); sound.playDiyaLight(); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'mithai'
                    ? 'bg-amber-500 text-amber-950 shadow-md font-bold'
                    : 'bg-amber-950/70 border border-amber-700/60 text-amber-200 hover:bg-amber-900/50'
                }`}
              >
                <span>🍬</span>
                <span>{currentT.tabs.mithai}</span>
              </button>

              <button
                onClick={() => { setTab('puja'); sound.playTempleBell(); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'puja'
                    ? 'bg-amber-500 text-amber-950 shadow-md font-bold'
                    : 'bg-amber-950/70 border border-amber-700/60 text-amber-200 hover:bg-amber-900/50'
                }`}
              >
                <span>🪷</span>
                <span>{currentT.tabs.puja}</span>
              </button>
            </div>
          </div>

          {/* 5 Days of Diwali Ribbon */}
          <div className="mt-6 pt-5 border-t border-amber-800/40 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {festiveDays.map((d, index) => (
              <div
                key={d.dayEn}
                className="bg-amber-950/50 border border-amber-800/50 rounded-xl p-2.5 transition-colors hover:border-amber-600/50"
              >
                <div className="text-xs font-bold text-amber-300">
                  {lang === 'gu' ? d.dayGu : d.dayEn}
                </div>
                <div className="text-[11px] text-amber-400/80 truncate">
                  {lang === 'gu' ? d.descGu : d.descEn}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Tab View */}
        <section className="transition-all duration-300">
          {currentTab === 'diyas' && <DiyaLightingGame lang={lang} />}
          {currentTab === 'rangoli' && <RangoliStudio lang={lang} />}
          {currentTab === 'fireworks' && <FirecrackerSky lang={lang} />}
          {currentTab === 'mithai' && <MithaiBonanzaGame lang={lang} />}
          {currentTab === 'puja' && <LaxmiPujaAarti lang={lang} />}
          {currentTab === 'greetings' && <DiwaliCardMaker lang={lang} />}
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="mt-12 border-t border-amber-800/40 bg-amber-950/80 px-4 md:px-8 py-6 text-center text-xs text-amber-300/70">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🪔</span>
            <span className="font-semibold text-amber-200">
              {currentT.appTitle} · {currentT.salMubarak}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>{currentT.happyDiwali}</span>
            <span>·</span>
            <span>{currentT.fireworksGame.safeMessage}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
