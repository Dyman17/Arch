import React, { useEffect, useRef } from 'react';
import { Mic, Sparkles, Globe, X } from 'lucide-react';

interface PageListeningProps {
  lang: string;
  userSpokenText: string;
  audioDbLevel?: number; // -100 to 0 dBFS
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

  // Dynamic sound wave animation on canvas
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

      // Draw 3 layered sine waves
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const freq = 0.015 + layer * 0.008;
        const amp = (30 + layer * 15) * Math.min(1.5, Math.max(0.2, (audioDbLevel + 60) / 40));
        const color =
          layer === 0
            ? 'rgba(0, 212, 255, 0.7)'
            : layer === 1
            ? 'rgba(99, 102, 241, 0.5)'
            : 'rgba(234, 179, 8, 0.4)';

        ctx.strokeStyle = color;
        ctx.lineWidth = 3 - layer * 0.6;

        for (let x = 0; x < width; x += 4) {
          const y =
            centerY +
            Math.sin(x * freq + phase + layer) *
              amp *
              Math.sin((x / width) * Math.PI); // Envelope at edges
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += 0.06;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [audioDbLevel]);

  const quickPrompts: Record<string, string[]> = {
    kk: [
      'Қалай Жартасты соқпаққа жетуге болады?',
      'Жақын маңда қандай қызықты жерлер бар?',
      'Тарихын көрсетші',
      'Телефонға маршрутты жібер',
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
      'Show historical view',
      'Send route to my phone',
    ],
  };

  const sampleChips = quickPrompts[lang] || quickPrompts.ru;

  return (
    <div className="page-stage page-listening">
      <div className="listening-glow-orbit" />

      {/* Top Header telemetry */}
      <div className="listening-top-bar">
        <div className="telemetry-pill">
          <span className="live-mic-pulse" />
          <Mic size={14} className="text-cyan-400" />
          <span>МИКРОФОН АКТИВЕН • ПОРОГ СРАБАТЫВАНИЯ: &gt; −30 dBFS</span>
        </div>

        <div className="language-indicator-badges">
          <Globe size={14} className="text-amber-400" />
          <span className={lang === 'kk' ? 'lang-badge active' : 'lang-badge'}>KZ Қазақша</span>
          <span className={lang === 'ru' ? 'lang-badge active' : 'lang-badge'}>RU Русский</span>
          <span className={lang === 'en' ? 'lang-badge active' : 'lang-badge'}>EN English</span>
          <span className="lang-badge ai-auto">AI Auto (All)</span>

          {onCancel && (
            <button className="lang-badge cursor-pointer" onClick={onCancel} title="Закрыть">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Center Stage: The Sound Waveform & Orb */}
      <div className="listening-center-cockpit">
        <div className="listening-orb-wrapper">
          <div className="orb-halo halo-3" />
          <div className="orb-halo halo-2" />
          <div className="orb-halo halo-1" />
          <div className="listening-mic-orb">
            <Mic size={54} className="orb-mic-icon" />
          </div>
        </div>

        {/* Real-time Canvas Waveform */}
        <div className="wave-canvas-container">
          <canvas ref={canvasRef} width={800} height={140} className="sound-canvas" />
        </div>

        {/* Live Audio Level Meter */}
        <div className="sound-meter-bar-container">
          <div className="meter-label">
            <span>Тишина</span>
            <span className="threshold-tag">Порог −30 dBFS</span>
            <span>Громко</span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{ width: `${Math.min(100, Math.max(5, (audioDbLevel + 70) * 1.5))}%` }}
            />
            <div className="threshold-line" style={{ left: '60%' }} />
          </div>
        </div>

        {/* Live Speech Caption Box */}
        <div className="listening-caption-box">
          <div className="caption-status">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span>
              {userSpokenText ? 'РАСПОЗНАЁТСЯ РЕЧЬ:' : 'СЛУШАЮ ВАС... ГОВОРИТЕ НА СВОЁМ ЯЗЫКЕ'}
            </span>
          </div>
          <div className="caption-content">
            {userSpokenText ? (
              <p className="caption-text-active">«{userSpokenText}»</p>
            ) : (
              <p className="caption-placeholder">
                «Как пройти к музею?» • «Что посмотреть рядом?» • «Покажи как было раньше»
              </p>
            )}
          </div>
        </div>

        {/* Sample Voice Utterance Buttons */}
        <div className="quick-prompts-container">
          <span className="quick-prompts-title">Подсказки голосовых запросов (нажмите для проверки):</span>
          <div className="quick-prompts-grid">
            {sampleChips.map((chip, idx) => (
              <button
                key={idx}
                className="quick-chip-button"
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
