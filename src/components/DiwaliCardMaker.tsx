import React, { useState, useRef } from 'react';
import { Language } from '../types/game';
import { t } from '../utils/translations';
import { sound } from '../utils/audio';
import { Download, Copy, Check, Sparkles, Heart } from 'lucide-react';

interface DiwaliCardMakerProps {
  lang: Language;
}

export const DiwaliCardMaker: React.FC<DiwaliCardMakerProps> = ({ lang }) => {
  const currentT = t[lang].greetingsCard;
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [recipient, setRecipient] = useState<string>(
    lang === 'gu' ? 'આદરણીય સ્નેહીજન' : 'Dear Friend & Family'
  );
  const [sender, setSender] = useState<string>(
    lang === 'gu' ? 'આપનો હિતેચ્છુ પરિવાર' : 'Warmest Regards'
  );
  const [message, setMessage] = useState<string>(currentT.preset1);
  const [themeColor, setThemeColor] = useState<string>('royal-gold');
  const [copied, setCopied] = useState<boolean>(false);

  const presets = [currentT.preset1, currentT.preset2, currentT.preset3];

  const handleCopy = () => {
    sound.playDiyaLight();
    const fullText = `🪔 *${currentT.title}* 🪔\n\nસ્નેહી: ${recipient}\n\n"${message}"\n\nશુભેચ્છક: ${sender}\n✨ શુભ દીપાવલી અને નૂતન વર્ષાભિનંદન! ✨`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = () => {
    sound.playDiyaLight();
    // Render the card directly to a clean HTML5 canvas and download
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 700);
    grad.addColorStop(0, '#381604');
    grad.addColorStop(0.5, '#5c2207');
    grad.addColorStop(1, '#240c02');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 700);

    // Decorative golden double border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1140, 640);

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 1110, 610);

    // Corner decorative corner ornaments
    const corners = [
      { x: 50, y: 50 },
      { x: 1150, y: 50 },
      { x: 50, y: 650 },
      { x: 1150, y: 650 },
    ];
    ctx.fillStyle = '#f59e0b';
    corners.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // Festive Title
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 44px "Noto Sans Gujarati", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ ૐ શ્રી મહાલક્ષ્મ્યૈ નમઃ ✨', 600, 120);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 52px "Noto Sans Gujarati", "Cinzel", sans-serif';
    ctx.fillText(lang === 'gu' ? '॥ શુભ દીપાવલી અને સાલ મુબારક ॥' : 'Happy Diwali & Saal Mubarak', 600, 190);

    // Recipient
    ctx.fillStyle = '#fef3c7';
    ctx.font = '32px "Noto Sans Gujarati", sans-serif';
    ctx.fillText(`પ્રિય: ${recipient}`, 600, 260);

    // Message (multi-line wrapping)
    ctx.fillStyle = '#ffffff';
    ctx.font = '28px "Noto Sans Gujarati", sans-serif';
    wrapText(ctx, `"${message}"`, 600, 340, 950, 44);

    // Sender
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 32px "Noto Sans Gujarati", sans-serif';
    ctx.fillText(`શુભેચ્છક: ${sender}`, 600, 560);

    // Bottom blessings
    ctx.fillStyle = '#fde68a';
    ctx.font = '24px "Noto Sans Gujarati", sans-serif';
    ctx.fillText('નવું વર્ષ આપના જીવનમાં સુખ, શાંતિ, સ્વાસ્થ્ય અને સમૃદ્ધિ લઈને આવે.', 600, 610);

    const link = document.createElement('a');
    link.download = `diwali-greeting-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-amber-900/30 border border-amber-700/40 rounded-2xl p-5 backdrop-blur-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-amber-200 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>{currentT.title}</span>
          </h2>
          <p className="text-xs md:text-sm text-amber-300/80 mt-1 max-w-2xl">
            {currentT.desc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-800/60 text-xs font-semibold text-amber-300 hover:text-amber-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? currentT.copied : currentT.copyWish}</span>
          </button>

          <button
            onClick={handleDownloadCard}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-amber-950 text-xs font-bold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{currentT.downloadCard}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form Inputs */}
        <div className="space-y-4 bg-amber-950/60 border border-amber-800/40 p-5 rounded-2xl">
          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
              {currentT.recipient}
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-amber-900/40 border border-amber-700/60 rounded-xl px-3.5 py-2 text-sm text-amber-100 focus:outline-none focus:border-amber-400"
              placeholder={lang === 'gu' ? 'દા.ત. રમેશભાઈ અને પરિવાર' : 'e.g. Dear Family'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
              {currentT.sender}
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full bg-amber-900/40 border border-amber-700/60 rounded-xl px-3.5 py-2 text-sm text-amber-100 focus:outline-none focus:border-amber-400"
              placeholder={lang === 'gu' ? 'દા.ત. પટેલ પરિવાર' : 'e.g. Patel Family'}
            />
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
              {currentT.presets}
            </label>
            <div className="space-y-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMessage(p);
                    sound.playDiyaLight();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors ${
                    message === p
                      ? 'bg-amber-600/30 border-amber-400 text-amber-100 font-medium'
                      : 'bg-amber-900/20 border-amber-800/40 text-amber-300 hover:bg-amber-900/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
              {currentT.message}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-amber-900/40 border border-amber-700/60 rounded-xl px-3.5 py-2 text-sm text-amber-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Live Card Preview */}
        <div
          ref={cardRef}
          className="relative rounded-2xl overflow-hidden border-2 border-amber-500/70 p-6 md:p-8 bg-gradient-to-br from-[#3b1704] via-[#522108] to-[#250d03] text-amber-50 shadow-2xl flex flex-col justify-between min-h-[360px]"
        >
          {/* Ornate corner borders */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/80 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 rounded-br-lg" />

          {/* Top invocation */}
          <div className="text-center space-y-1">
            <span className="text-xs text-amber-400 font-serif tracking-widest uppercase">
              ✨ ૐ શ્રી મહાલક્ષ્મ્યૈ નમઃ ✨
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-amber-200 tracking-tight font-display">
              {lang === 'gu' ? '॥ શુભ દીપાવલી અને સાલ મુબારક ॥' : 'Happy Diwali & Saal Mubarak'}
            </h3>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-1" />
          </div>

          {/* Card Body */}
          <div className="my-6 text-center space-y-3">
            <div className="text-sm md:text-base font-semibold text-amber-300">
              {lang === 'gu' ? 'પ્રિય' : 'Dear'} {recipient},
            </div>
            <p className="text-xs md:text-sm text-amber-100/90 leading-relaxed max-w-md mx-auto italic">
              "{message}"
            </p>
          </div>

          {/* Bottom Sender & Diya */}
          <div className="flex items-end justify-between border-t border-amber-600/40 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-diya-flicker">🪔</span>
              <div>
                <div className="text-[10px] text-amber-400 uppercase font-semibold">
                  {lang === 'gu' ? 'શુભેચ્છક' : 'From'}
                </div>
                <div className="text-sm font-bold text-amber-200">{sender}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-amber-300/80">સંવત ૨૦૮૩</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
