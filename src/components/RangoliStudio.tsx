import React, { useRef, useState, useEffect } from 'react';
import { Language } from '../types/game';
import { t } from '../utils/translations';
import { sound } from '../utils/audio';
import { 
  Palette, 
  RotateCcw, 
  Download, 
  Trash2, 
  Flower2, 
  Sparkles, 
  Compass, 
  Brush,
  CircleDot
} from 'lucide-react';

interface RangoliStudioProps {
  lang: Language;
}

const FESTIVE_POWDERS = [
  { nameGu: 'કંકુ લાલ', nameEn: 'Kumkum Red', hex: '#dc2626' },
  { nameGu: 'હળદર પીળો', nameEn: 'Turmeric Yellow', hex: '#facc15' },
  { nameGu: 'કેસરી', nameEn: 'Saffron Orange', hex: '#ea580c' },
  { nameGu: 'મોરપિચ્છ વાદળી', nameEn: 'Peacock Blue', hex: '#0284c7' },
  { nameGu: 'પોપટી લીલો', nameEn: 'Emerald Green', hex: '#16a34a' },
  { nameGu: 'રાણી ગુલાબી', nameEn: 'Rani Pink', hex: '#db2777' },
  { nameGu: 'જાંબલી', nameEn: 'Royal Purple', hex: '#9333ea' },
  { nameGu: 'શ્વેત ચોખા લોટ', nameEn: 'White Powder', hex: '#f8fafc' },
  { nameGu: 'સોનેરી', nameEn: 'Golden Glow', hex: '#eab308' },
];

export const RangoliStudio: React.FC<RangoliStudioProps> = ({ lang }) => {
  const currentT = t[lang].rangoliGame;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentColor, setCurrentColor] = useState<string>('#ea580c');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [toolMode, setToolMode] = useState<'symmetry' | 'freehand' | 'flower' | 'diya'>('symmetry');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  // Initialize canvas with smooth charcoal/dark haveli stone texture
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high internal resolution
    canvas.width = 800;
    canvas.height = 800;

    initCanvasBackground(ctx, 800, 800);
    // Draw initial welcome mandala outline
    drawPresetTemplate(ctx, 'lotus');
    saveState();
  }, []);

  const initCanvasBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Deep dark stone floor background
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.7);
    bgGrad.addColorStop(0, '#2d1b10');
    bgGrad.addColorStop(0.7, '#1c1009');
    bgGrad.addColorStop(1, '#120a05');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle traditional dotted guideline circles
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    const center = width / 2;
    [60, 120, 180, 240, 300, 360].forEach((radius) => {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 8 radial guideline lines
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + Math.cos(angle) * 360, center + Math.sin(angle) * 360);
      ctx.stroke();
    }
    ctx.restore();
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-12), data]);
    setHasDrawn(true);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sound.playDiyaLight();
    const newHist = [...history];
    newHist.pop(); // Remove current
    const previous = newHist[newHist.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
      setHistory(newHist);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sound.playHazardHit();
    initCanvasBackground(ctx, canvas.width, canvas.height);
    saveState();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCanvasCoords(e);

    if (toolMode === 'flower') {
      placeFlowerStamp(coords.x, coords.y);
      saveState();
      return;
    }
    if (toolMode === 'diya') {
      placeDiyaStamp(coords.x, coords.y);
      saveState();
      return;
    }

    draw(e);
  };

  const endDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    const center = canvas.width / 2;

    if (toolMode === 'freehand') {
      paintGulalDot(ctx, x, y, currentColor, brushSize);
    } else if (toolMode === 'symmetry') {
      // 8-Fold Radial Mandala Symmetry
      const dx = x - center;
      const dy = y - center;
      const r = Math.sqrt(dx * dx + dy * dy);
      const baseAngle = Math.atan2(dy, dx);

      for (let i = 0; i < 8; i++) {
        const symAngle = baseAngle + (i * Math.PI) / 4;
        const px = center + r * Math.cos(symAngle);
        const py = center + r * Math.sin(symAngle);
        paintGulalDot(ctx, px, py, currentColor, brushSize);

        // Also reflect across radial axis for true 16-point geometric balance
        const symAngleReflect = -baseAngle + (i * Math.PI) / 4;
        const rx = center + r * Math.cos(symAngleReflect);
        const ry = center + r * Math.sin(symAngleReflect);
        paintGulalDot(ctx, rx, ry, currentColor, brushSize);
      }
    }
  };

  // Organic powder spray texture
  const paintGulalDot = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    radius: number
  ) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = radius * 0.4;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Natural powder granules
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius * 1.4;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.arc(px, py, Math.random() * 2 + 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const placeFlowerStamp = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sound.playOilPour();
    ctx.save();
    const petalCount = 8;
    const petalRadius = brushSize * 1.5;

    // Petals
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * Math.PI * 2) / petalCount;
      const px = x + Math.cos(angle) * petalRadius * 0.7;
      const py = y + Math.sin(angle) * petalRadius * 0.7;

      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.ellipse(px, py, petalRadius * 0.6, petalRadius * 0.35, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    // Flower core (haldi yellow or vermilion)
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y, petalRadius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const placeDiyaStamp = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sound.playDiyaLight();
    ctx.save();
    const size = brushSize * 2.2;

    // Clay saucer
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.ellipse(x, y + size * 0.2, size * 0.8, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flame
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.8);
    ctx.bezierCurveTo(x + size * 0.4, y - size * 0.2, x + size * 0.3, y + size * 0.1, x, y + size * 0.1);
    ctx.bezierCurveTo(x - size * 0.3, y + size * 0.1, x - size * 0.4, y - size * 0.2, x, y - size * 0.8);
    ctx.fill();
    ctx.restore();
  };

  const drawPresetTemplate = (
    ctx: CanvasRenderingContext2D,
    template: 'lotus' | 'peacock' | 'diya' | 'swastik'
  ) => {
    const center = 400;

    if (template === 'lotus') {
      // Intricate lotus mandala petals
      for (let ring = 1; ring <= 3; ring++) {
        const radius = ring * 80;
        const petals = ring * 6;
        for (let i = 0; i < petals; i++) {
          const angle = (i * Math.PI * 2) / petals;
          const px = center + Math.cos(angle) * radius;
          const py = center + Math.sin(angle) * radius;
          const col = ring === 1 ? '#ea580c' : ring === 2 ? '#db2777' : '#facc15';
          paintGulalDot(ctx, px, py, col, 12);
        }
      }
      // Central glowing diya
      paintGulalDot(ctx, center, center, '#facc15', 20);
    } else if (template === 'diya') {
      // Auspicious concentric diya ring
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        const px = center + Math.cos(angle) * 220;
        const py = center + Math.sin(angle) * 220;
        paintGulalDot(ctx, px, py, '#dc2626', 14);
        paintGulalDot(ctx, center + Math.cos(angle) * 160, center + Math.sin(angle) * 160, '#facc15', 10);
      }
      paintGulalDot(ctx, center, center, '#ea580c', 28);
    } else if (template === 'peacock') {
      // Peacock vibrant feather colors (Peacock blue, emerald, yellow)
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        paintGulalDot(ctx, center + Math.cos(angle) * 260, center + Math.sin(angle) * 260, '#0284c7', 16);
        paintGulalDot(ctx, center + Math.cos(angle) * 200, center + Math.sin(angle) * 200, '#16a34a', 14);
        paintGulalDot(ctx, center + Math.cos(angle) * 130, center + Math.sin(angle) * 130, '#facc15', 12);
        paintGulalDot(ctx, center + Math.cos(angle) * 70, center + Math.sin(angle) * 70, '#dc2626', 10);
      }
    } else if (template === 'swastik') {
      // Auspicious Swastik pattern in traditional kanku red
      const s = 140;
      const col = '#dc2626';
      // Center cross
      for (let d = -s; d <= s; d += 15) {
        paintGulalDot(ctx, center + d, center, col, 8);
        paintGulalDot(ctx, center, center + d, col, 8);
      }
      // Swastik arms
      for (let d = 0; d <= s * 0.7; d += 15) {
        paintGulalDot(ctx, center + s, center - d, col, 8);
        paintGulalDot(ctx, center - s, center + d, col, 8);
        paintGulalDot(ctx, center + d, center + s, col, 8);
        paintGulalDot(ctx, center - d, center - s, col, 8);
      }
      // Four auspicious dots
      const dOffset = s * 0.5;
      paintGulalDot(ctx, center + dOffset, center - dOffset, '#facc15', 10);
      paintGulalDot(ctx, center - dOffset, center - dOffset, '#facc15', 10);
      paintGulalDot(ctx, center - dOffset, center + dOffset, '#facc15', 10);
      paintGulalDot(ctx, center + dOffset, center + dOffset, '#facc15', 10);
    }
  };

  const handleApplyTemplate = (type: 'lotus' | 'peacock' | 'diya' | 'swastik') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sound.playDiyaLight();
    initCanvasBackground(ctx, canvas.width, canvas.height);
    drawPresetTemplate(ctx, type);
    saveState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sound.playDiyaLight();
    const link = document.createElement('a');
    link.download = `diwali-rangoli-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-amber-900/30 border border-amber-700/40 rounded-2xl p-5 backdrop-blur-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-amber-200 tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-400" />
            <span>{currentT.title}</span>
          </h2>
          <p className="text-xs md:text-sm text-amber-300/80 mt-1 max-w-2xl">
            {currentT.desc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-800/60 text-xs font-medium text-amber-300 hover:text-amber-100 disabled:opacity-40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{currentT.undo}</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-800/60 text-xs font-medium text-amber-300 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{currentT.clear}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-amber-950 text-xs font-bold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{currentT.download}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Control Panel: Colors, Tools, Templates */}
        <div className="space-y-5 bg-amber-950/60 border border-amber-800/40 p-4 md:p-5 rounded-2xl">
          {/* Drawing Modes */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2.5">
              {currentT.tools}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setToolMode('symmetry'); sound.playDiyaLight(); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left transition-colors ${
                  toolMode === 'symmetry'
                    ? 'bg-amber-600 text-amber-950 border-amber-400 font-bold shadow-sm'
                    : 'bg-amber-900/30 text-amber-200 border-amber-800/50 hover:bg-amber-900/50'
                }`}
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span className="leading-tight">{currentT.symmetry8}</span>
              </button>

              <button
                onClick={() => { setToolMode('freehand'); sound.playDiyaLight(); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left transition-colors ${
                  toolMode === 'freehand'
                    ? 'bg-amber-600 text-amber-950 border-amber-400 font-bold shadow-sm'
                    : 'bg-amber-900/30 text-amber-200 border-amber-800/50 hover:bg-amber-900/50'
                }`}
              >
                <Brush className="w-4 h-4 shrink-0" />
                <span className="leading-tight">{currentT.freehand}</span>
              </button>

              <button
                onClick={() => { setToolMode('flower'); sound.playDiyaLight(); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left transition-colors ${
                  toolMode === 'flower'
                    ? 'bg-amber-600 text-amber-950 border-amber-400 font-bold shadow-sm'
                    : 'bg-amber-900/30 text-amber-200 border-amber-800/50 hover:bg-amber-900/50'
                }`}
              >
                <Flower2 className="w-4 h-4 shrink-0" />
                <span className="leading-tight">{currentT.flowerPetals}</span>
              </button>

              <button
                onClick={() => { setToolMode('diya'); sound.playDiyaLight(); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left transition-colors ${
                  toolMode === 'diya'
                    ? 'bg-amber-600 text-amber-950 border-amber-400 font-bold shadow-sm'
                    : 'bg-amber-900/30 text-amber-200 border-amber-800/50 hover:bg-amber-900/50'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="leading-tight">{lang === 'gu' ? 'દીવો મુકો' : 'Diya Stamp'}</span>
              </button>
            </div>
          </div>

          {/* Color Powders */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2.5">
              {currentT.colors}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FESTIVE_POWDERS.map((powder) => (
                <button
                  key={powder.hex}
                  onClick={() => {
                    setCurrentColor(powder.hex);
                    sound.playOilPour();
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                    currentColor === powder.hex
                      ? 'border-amber-300 ring-2 ring-amber-400/40 bg-amber-900/60 scale-105'
                      : 'border-amber-800/50 hover:border-amber-700 bg-amber-950/40'
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-full shadow-inner border border-white/20"
                    style={{ backgroundColor: powder.hex }}
                  />
                  <span className="text-[10px] text-amber-200 truncate w-full text-center">
                    {lang === 'gu' ? powder.nameGu : powder.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Brush Size Slider */}
          <div>
            <div className="flex justify-between text-xs text-amber-300 font-medium mb-1.5">
              <span>{currentT.brushSize}</span>
              <span className="tabular-nums font-semibold">{brushSize}px</span>
            </div>
            <input
              type="range"
              min="4"
              max="28"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Festive Templates */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2.5">
              {currentT.templates}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleApplyTemplate('lotus')}
                className="p-2 text-xs rounded-lg bg-amber-900/30 border border-amber-800/50 text-amber-200 hover:bg-amber-800/40 transition-colors text-left font-medium"
              >
                🪷 {currentT.templateLotus}
              </button>
              <button
                onClick={() => handleApplyTemplate('peacock')}
                className="p-2 text-xs rounded-lg bg-amber-900/30 border border-amber-800/50 text-amber-200 hover:bg-amber-800/40 transition-colors text-left font-medium"
              >
                🦚 {currentT.templatePeacock}
              </button>
              <button
                onClick={() => handleApplyTemplate('diya')}
                className="p-2 text-xs rounded-lg bg-amber-900/30 border border-amber-800/50 text-amber-200 hover:bg-amber-800/40 transition-colors text-left font-medium"
              >
                🪔 {currentT.templateDiya}
              </button>
              <button
                onClick={() => handleApplyTemplate('swastik')}
                className="p-2 text-xs rounded-lg bg-amber-900/30 border border-amber-800/50 text-amber-200 hover:bg-amber-800/40 transition-colors text-left font-medium"
              >
                卐 {currentT.templateSwastik}
              </button>
            </div>
          </div>
        </div>

        {/* Center / Right: Interactive Rangoli Canvas */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center bg-amber-950/70 border border-amber-700/40 rounded-2xl p-3 md:p-6 shadow-2xl relative">
          <div className="relative w-full max-w-[620px] aspect-square rounded-2xl overflow-hidden border-2 border-amber-700/60 shadow-inner">
            <canvas
              ref={canvasRef}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
              className="w-full h-full cursor-crosshair touch-none"
            />
          </div>

          <div className="mt-3 text-center text-xs text-amber-300/70 flex items-center justify-center gap-2">
            <CircleDot className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {lang === 'gu'
                ? '૮-ગણી સંમિતિ મોડમાં તમે જે પણ દોરશો તે આપમેળે સુંદર વર્તુળાકાર મંડલા રંગોળી બની જશે!'
                : 'In 8-Fold Mandala mode, every stroke radiates into balanced circular geometric art!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
