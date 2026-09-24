import React, { useEffect, useRef } from 'react';
import { Mic, Globe, X } from 'lucide-react';

interface PageListeningProps {
  lang: string;
  userSpokenText: string;
  audioDbLevel?: number;
  onSimulateUtterance: (text: string) => void;
  onCancel?: () => void;
}

export const PageListening: React.FC<PageListeningProps> = ({
  lang,
  userSpokenText,
  audioDbLevel = -22,
  onSimulateUtterance,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Soft Caspian water waves animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const freq = 0.012 + layer * 0.006;
        const amp = (24 + layer * 14) * Math.min(1.6, Math.max(0.3, (audioDbLevel + 60) / 35));
        const color =
          layer === 0
            ? 'rgba(74, 144, 226, 0.6)'
            : layer === 1
            ? 'rgba(212, 163, 115, 0.45)'
            : 'rgba(255, 255, 255, 0.25)';

        ctx.strokeStyle = color;
        ctx.lineWidth = 3 - layer * 0.7;

        for (let x = 0; x < width; x += 4) {
          const y =
            centerY +
            Math.sin(x * freq + phase + layer * 1.2) *
              amp *
              Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += 0.04;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [audioDbLevel]);

  const quickPrompts: Record<string, string[]> = {
    kk: [
      'Жартасты соқпаққа қалай барады?',
      'Жақын жерде не бар?',
      'Тарихын көрсетші',
      'Телефонға жібер',
    ],
    ru: [
      'Как пройти к Скальной тропе?',
      'Что интересного есть рядом?',
      'Покажи историю набережной',
      'Отправь маршрут на телефон',
    ],
    en: [
      'How to get to the Rock Trail?',
      'What places are nearby?',
      'Show historical photos',
      'Send route to my phone',
    ],
  };

  const sampleChips = quickPrompts[lang] || quickPrompts.ru;

  return (
    <div className="page-stage page-listening">
      <div className="listening-warm-backdrop" />

      {/* Top Header */}
      <div className="listening-top-bar">
        <div className="listening-status-pill">
          <span className="listening-active-dot" />
          <span>Слушаю вас...</span>
        </div>

        <div className="listening-languages">
          <Globe size={14} className="text-amber-200" />
          <span className={lang === 'kk' ? 'lang-pill active' : 'lang-pill'}>Қазақша</span>
          <span className={lang === 'ru' ? 'lang-pill active' : 'lang-pill'}>Русский</span>
          <span className={lang === 'en' ? 'lang-pill active' : 'lang-pill'}>English</span>

          {onCancel && (
            <button className="lang-pill close-btn" onClick={onCancel} title="Назад к карте">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Center Stage: Friendly Ripple & Microphone */}
      <div className="listening-center-content">
        <div className="listening-ripple-box">
          <div className="water-wave-ring r1" />
          <div className="water-wave-ring r2" />
          <div className="mic-warm-center">
            <Mic size={52} className="text-slate-800" />
          </div>
        </div>

        {/* Soft Waveform */}
        <div className="listening-wave-wrapper">
          <canvas ref={canvasRef} width={760} height={110} className="natural-wave-canvas" />
        </div>

        {/* Live Speech Caption Box */}
        <div className="listening-caption-card">
          <p className="caption-sublabel">
            {userSpokenText ? 'Вы говорите:' : 'Говорите вслух на вашем родном языке:'}
          </p>
          <p className={userSpokenText ? 'caption-main-text active' : 'caption-main-text placeholder'}>
            {userSpokenText ? `«${userSpokenText}»` : '«Как пройти к морю?» • «Где погулять?» • «Покажи историю»'}
          </p>
        </div>

        {/* Popular Tourist Questions */}
        <div className="listening-sample-suggestions">
          <span className="suggestions-headline">Частые вопросы гостей города:</span>
          <div className="suggestions-grid">
            {sampleChips.map((chip, idx) => (
              <button
                key={idx}
                className="friendly-prompt-btn"
                onClick={() => onSimulateUtterance(chip)}
              >
                <span>«{chip}»</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
