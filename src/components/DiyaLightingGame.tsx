import React, { useState, useEffect } from 'react';
import { Language } from '../types/game';
import { t } from '../utils/translations';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, Droplets, Wind, RotateCcw, Award } from 'lucide-react';

interface DiyaLightingGameProps {
  lang: Language;
}

interface DiyaState {
  id: number;
  label: string;
  xPercent: number; // Courtyard positioning
  yPercent: number;
  oilLevel: number; // 0 to 100
  hasWick: boolean;
  isLit: boolean;
  isProtected: boolean;
}

export const DiyaLightingGame: React.FC<DiyaLightingGameProps> = ({ lang }) => {
  const currentT = t[lang].diyaGame;

  // 12 festive diyas laid out aesthetically along courtyard steps and rangoli periphery
  const initialDiyas: DiyaState[] = [
    { id: 1, label: 'દીવો ૧', xPercent: 18, yPercent: 78, oilLevel: 100, hasWick: true, isLit: false, isProtected: false },
    { id: 2, label: 'દીવો ૨', xPercent: 28, yPercent: 72, oilLevel: 60, hasWick: true, isLit: false, isProtected: false },
    { id: 3, label: 'દીવો ૩', xPercent: 38, yPercent: 68, oilLevel: 0, hasWick: false, isLit: false, isProtected: false },
    { id: 4, label: 'દીવો ૪', xPercent: 50, yPercent: 65, oilLevel: 100, hasWick: true, isLit: true, isProtected: false }, // Center diya
    { id: 5, label: 'દીવો ૫', xPercent: 62, yPercent: 68, oilLevel: 0, hasWick: false, isLit: false, isProtected: false },
    { id: 6, label: 'દીવો ૬', xPercent: 72, yPercent: 72, oilLevel: 40, hasWick: true, isLit: false, isProtected: false },
    { id: 7, label: 'દીવો ૭', xPercent: 82, yPercent: 78, oilLevel: 100, hasWick: true, isLit: false, isProtected: false },
    { id: 8, label: 'દીવો ૮', xPercent: 15, yPercent: 56, oilLevel: 50, hasWick: true, isLit: false, isProtected: false },
    { id: 9, label: 'દીવો ૯', xPercent: 85, yPercent: 56, oilLevel: 0, hasWick: false, isLit: false, isProtected: false },
    { id: 10, label: 'દીવો ૧૦', xPercent: 34, yPercent: 88, oilLevel: 100, hasWick: true, isLit: false, isProtected: false },
    { id: 11, label: 'દીવો ૧૧', xPercent: 50, yPercent: 92, oilLevel: 0, hasWick: false, isLit: false, isProtected: false },
    { id: 12, label: 'દીવો ૧૨', xPercent: 66, yPercent: 88, oilLevel: 100, hasWick: true, isLit: false, isProtected: false },
  ];

  const [diyas, setDiyas] = useState<DiyaState[]>(initialDiyas);
  const [selectedTool, setSelectedTool] = useState<'match' | 'oil' | 'wick' | 'quick'>('quick');
  const [gameMode, setGameMode] = useState<'zen' | 'challenge'>('zen');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isPlayingChallenge, setIsPlayingChallenge] = useState<boolean>(false);
  const [windActive, setWindActive] = useState<boolean>(false);
  const [completedCelebrated, setCompletedCelebrated] = useState<boolean>(false);

  const litCount = diyas.filter((d) => d.isLit).length;
  const radiancePercentage = Math.round((litCount / diyas.length) * 100);

  // Trigger win effects when all 12 are lit
  useEffect(() => {
    if (litCount === diyas.length && !completedCelebrated) {
      setCompletedCelebrated(true);
      sound.playDiyaLight();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#f97316', '#ef4444', '#fef08a']
      });
    }
  }, [litCount, diyas.length, completedCelebrated]);

  // Challenge mode timer & occasional wind breeze
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameMode === 'challenge' && isPlayingChallenge && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlayingChallenge(false);
            return 0;
          }
          // Wind chance every few seconds
          if (Math.random() < 0.18) {
            triggerWindBreeze();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameMode, isPlayingChallenge, timeLeft]);

  const triggerWindBreeze = () => {
    setWindActive(true);
    // Extinguish 1 or 2 unshielded lit diyas
    setTimeout(() => {
      setDiyas((current) =>
        current.map((d) => {
          if (d.isLit && !d.isProtected && Math.random() < 0.4) {
            return { ...d, isLit: false };
          }
          return d;
        })
      );
      setWindActive(false);
    }, 1200);
  };

  const handleDiyaClick = (id: number) => {
    const target = diyas.find((d) => d.id === id);
    if (!target) return;

    if (selectedTool === 'quick') {
      // In quick mode, one click does whatever is next needed: oil -> wick -> ignite!
      if (target.oilLevel < 50) {
        sound.playOilPour();
        setDiyas((prev) =>
          prev.map((d) => (d.id === id ? { ...d, oilLevel: 100 } : d))
        );
      } else if (!target.hasWick) {
        sound.playDiyaLight();
        setDiyas((prev) =>
          prev.map((d) => (d.id === id ? { ...d, hasWick: true } : d))
        );
      } else if (!target.isLit) {
        sound.playDiyaLight();
        setDiyas((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isLit: true } : d))
        );
      } else {
        // Toggle shield or flame
        sound.playDiyaLight();
        setDiyas((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isProtected: !d.isProtected } : d))
        );
      }
      return;
    }

    if (selectedTool === 'oil') {
      sound.playOilPour();
      setDiyas((prev) =>
        prev.map((d) => (d.id === id ? { ...d, oilLevel: 100 } : d))
      );
    } else if (selectedTool === 'wick') {
      sound.playDiyaLight();
      setDiyas((prev) =>
        prev.map((d) => (d.id === id ? { ...d, hasWick: true } : d))
      );
    } else if (selectedTool === 'match') {
      if (target.oilLevel > 20 && target.hasWick) {
        sound.playDiyaLight();
        setDiyas((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isLit: true } : d))
        );
      } else {
        // Needs oil or wick
        sound.playHazardHit();
      }
    }
  };

  const handleLightAll = () => {
    sound.playDiyaLight();
    setDiyas((prev) =>
      prev.map((d) => ({
        ...d,
        oilLevel: 100,
        hasWick: true,
        isLit: true
      }))
    );
  };

  const handleReset = () => {
    sound.playDiyaLight();
    setDiyas(initialDiyas);
    setCompletedCelebrated(false);
    setTimeLeft(45);
    setIsPlayingChallenge(false);
  };

  const startChallenge = () => {
    handleReset();
    setIsPlayingChallenge(true);
    setGameMode('challenge');
    sound.playDiyaLight();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Control HUD */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-amber-900/30 border border-amber-700/40 rounded-2xl p-5 backdrop-blur-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-amber-200 tracking-tight flex items-center gap-2">
            <span className="text-amber-400">🪔</span>
            <span>{currentT.title}</span>
          </h2>
          <p className="text-xs md:text-sm text-amber-300/80 mt-1 max-w-2xl">
            {currentT.desc}
          </p>
        </div>

        {/* Radiance & Stats */}
        <div className="flex items-center gap-4 bg-amber-950/70 border border-amber-800/50 rounded-xl p-3 shrink-0">
          <div>
            <div className="text-[11px] text-amber-400 font-medium uppercase tracking-wider">
              {currentT.litCount}
            </div>
            <div className="text-xl font-bold text-amber-100 tabular-nums">
              {litCount} <span className="text-xs text-amber-400/70">/ {diyas.length}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-amber-800/60" />
          <div className="min-w-[110px]">
            <div className="flex justify-between text-[11px] text-amber-300 mb-1">
              <span>{currentT.radiance}</span>
              <span className="font-semibold tabular-nums">{radiancePercentage}%</span>
            </div>
            <div className="w-full bg-amber-950 h-2 rounded-full overflow-hidden border border-amber-800/50">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 transition-all duration-500 shadow-sm shadow-amber-400/50"
                style={{ width: `${radiancePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wind Warning Banner */}
      {windActive && (
        <div className="bg-sky-950/80 border border-sky-600/60 text-sky-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs md:text-sm animate-pulse">
          <Wind className="w-4 h-4 text-sky-400 animate-spin" />
          <span>{currentT.windAlert}</span>
        </div>
      )}

      {/* Main Interactive Courtyard Arena */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/10] min-h-[420px] rounded-2xl overflow-hidden border border-amber-700/40 shadow-2xl bg-amber-950 select-none group">
        {/* Authentic Haveli Courtyard Background Image */}
        <img
          src="/src/assets/images/diwali_courtyard_night_1794053034528.jpg"
          alt="Diwali Haveli Courtyard Night"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          referrerPolicy="no-referrer"
          style={{
            filter: `brightness(${0.4 + (radiancePercentage / 100) * 0.65}) contrast(1.05)`,
          }}
        />

        {/* Ambient Warm Golden Overlay that brightens as more diyas are lit */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 bg-radial from-amber-500/20 via-orange-600/10 to-transparent"
          style={{ opacity: radiancePercentage / 100 }}
        />

        {/* Interactive Diyas positioned on steps */}
        {diyas.map((diya) => (
          <div
            key={diya.id}
            onClick={() => handleDiyaClick(diya.id)}
            style={{
              left: `${diya.xPercent}%`,
              top: `${diya.yPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute cursor-pointer flex flex-col items-center group/diya transition-transform hover:scale-110 active:scale-95"
          >
            {/* Flame when lit */}
            {diya.isLit ? (
              <div className="relative -mb-1 animate-diya-flicker">
                {/* Outer halo */}
                <div className="absolute -inset-2 bg-amber-400/30 rounded-full blur-md" />
                {/* SVG Flame */}
                <svg width="28" height="38" viewBox="0 0 24 32" className="drop-shadow-lg">
                  <path
                    d="M12 0 C13 8 21 13 21 21 C21 27 16.5 31 12 31 C7.5 31 3 27 3 21 C3 13 11 8 12 0 Z"
                    fill="url(#flameGrad)"
                  />
                  <path
                    d="M12 11 C13 15 17 17 17 22 C17 25 14.5 28 12 28 C9.5 28 7 25 7 22 C7 17 11 15 12 11 Z"
                    fill="#FFF7ED"
                  />
                  <defs>
                    <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="35%" stopColor="#f59e0b" />
                      <stop offset="75%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            ) : (
              <div className="h-6 flex items-end">
                {diya.hasWick ? (
                  <div className="w-1.5 h-3.5 bg-amber-200/80 rounded-t-sm shadow-sm -mb-0.5" />
                ) : (
                  <div className="text-[10px] text-amber-300/80 bg-black/60 px-1.5 py-0.5 rounded opacity-0 group-hover/diya:opacity-100 transition-opacity whitespace-nowrap">
                    {lang === 'gu' ? 'વાટ મૂકો' : 'Needs wick'}
                  </div>
                )}
              </div>
            )}

            {/* Clay Diya Body (Terracotta Lamp SVG) */}
            <div className="relative">
              <svg width="44" height="24" viewBox="0 0 54 28">
                {/* Clay Diya saucer */}
                <path
                  d="M2 10 Q27 32 52 10 Q45 2 27 2 Q9 2 2 10 Z"
                  fill="url(#clayGrad)"
                  stroke="#78350f"
                  strokeWidth="1.5"
                />
                {/* Oil reservoir inside */}
                <ellipse
                  cx="27"
                  cy="10"
                  rx="22"
                  ry="6"
                  fill={diya.oilLevel > 0 ? '#b45309' : '#451a03'}
                />
                {/* Golden oil shimmer */}
                {diya.oilLevel > 0 && (
                  <ellipse
                    cx="27"
                    cy="10"
                    rx="18"
                    ry="4"
                    fill="url(#oilGrad)"
                    opacity={diya.oilLevel / 100}
                  />
                )}
                {/* Clay Diya Spout front */}
                <path
                  d="M24 10 L27 4 L30 10 Z"
                  fill="#9a3412"
                />
                <defs>
                  <linearGradient id="clayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c2410c" />
                    <stop offset="60%" stopColor="#9a3412" />
                    <stop offset="100%" stopColor="#7c2d12" />
                  </linearGradient>
                  <linearGradient id="oilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Tooltip hint on hover */}
            <div className="opacity-0 group-hover/diya:opacity-100 transition-opacity text-[11px] bg-black/85 text-amber-200 px-2 py-0.5 rounded-md mt-1 pointer-events-none whitespace-nowrap border border-amber-600/40 shadow-lg">
              {diya.isLit
                ? (lang === 'gu' ? '✨ પ્રજ્વલિત' : '✨ Lit')
                : !diya.hasWick
                ? (lang === 'gu' ? 'વાટ અને તેલ મૂકો' : 'Needs oil & wick')
                : (lang === 'gu' ? 'પ્રગટાવો' : 'Ignite flame')}
            </div>
          </div>
        ))}

        {/* All Lit Congratulation Overlay */}
        {litCount === diyas.length && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-amber-900/95 to-amber-950/95 border-2 border-amber-500/80 p-6 md:p-8 rounded-2xl max-w-md text-center shadow-2xl animate-fade-in">
              <span className="text-4xl md:text-5xl mb-2 block animate-bounce">🪔✨</span>
              <h3 className="text-xl md:text-2xl font-bold text-amber-200">
                {currentT.allLitCongrats}
              </h3>
              <p className="text-xs md:text-sm text-amber-300/90 mt-2">
                {lang === 'gu'
                  ? 'દીવાઓના પવિત્ર તેજથી સમગ્ર આંગણું અને મન પ્રફુલ્લિત થઈ ગયું છે. આપનું જીવન પણ સદાય આમ જ ઝળહળતું રહે!'
                  : 'May the celestial warmth of these diyas bring everlasting peace, prosperity, and joy to your life!'}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold rounded-xl text-xs md:text-sm transition-colors shadow-lg"
                >
                  {currentT.resetBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar & Interaction Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-amber-900/20 border border-amber-800/40 p-4 rounded-xl">
        {/* Tool selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-amber-400 mr-1">
            {lang === 'gu' ? 'સાધન:' : 'Tools:'}
          </span>
          <button
            onClick={() => { setSelectedTool('quick'); sound.playDiyaLight(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTool === 'quick'
                ? 'bg-amber-500 text-slate-900 shadow-sm font-semibold'
                : 'bg-amber-950/60 text-amber-200 hover:bg-amber-900/40 border border-amber-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'ઝડપી પ્રગટાવો (Auto)' : 'Quick Light'}</span>
          </button>

          <button
            onClick={() => { setSelectedTool('oil'); sound.playOilPour(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTool === 'oil'
                ? 'bg-amber-500 text-slate-900 shadow-sm font-semibold'
                : 'bg-amber-950/60 text-amber-200 hover:bg-amber-900/40 border border-amber-800/40'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'તેલ રેડો' : 'Pour Oil'}</span>
          </button>

          <button
            onClick={() => { setSelectedTool('match'); sound.playDiyaLight(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTool === 'match'
                ? 'bg-amber-500 text-slate-900 shadow-sm font-semibold'
                : 'bg-amber-950/60 text-amber-200 hover:bg-amber-900/40 border border-amber-800/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'દિવાસળી / જ્યોત' : 'Flame'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-start md:justify-end gap-2.5">
          <button
            onClick={handleLightAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-amber-950 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentT.lightAllBtn}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-300 hover:text-amber-100 hover:bg-amber-900/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{currentT.resetBtn}</span>
          </button>

          {gameMode === 'challenge' && !isPlayingChallenge && (
            <button
              onClick={startChallenge}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'પડકાર શરૂ કરો' : 'Start Challenge'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
