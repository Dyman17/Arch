import React from 'react';
import { Cpu, Sparkles, Compass, Layers } from 'lucide-react';

interface PageThinkingProps {
  userSpokenText: string;
  lang: string;
}

export const PageThinking: React.FC<PageThinkingProps> = ({ userSpokenText, lang }) => {
  const statusTexts: Record<string, { main: string; sub: string }> = {
    kk: {
      main: 'Сұранысыңызды өңдеп, ақпаратты іздеудемін...',
      sub: 'Каспий білім базасы және навигациялық граф қосылды',
    },
    ru: {
      main: 'Осмысливаю запрос и рассчитываю маршрут...',
      sub: 'Поиск по каталогу Мангистау и расчет пешего азимута',
    },
    en: {
      main: 'Processing query and calculating trajectory...',
      sub: 'Scanning Mangystau cultural atlas & azimuth bearings',
    },
  };

  const status = statusTexts[lang] || statusTexts.ru;

  return (
    <div className="page-stage page-thinking">
      {/* Dynamic Cosmic Glow Backdrop */}
      <div className="thinking-radiance-aura" />

      <div className="thinking-center-stage">
        {/* Hypnotic Multi-Ring Gyroscope */}
        <div className="thinking-gyro-wrapper">
          <div className="gyro-ring gyro-1" />
          <div className="gyro-ring gyro-2" />
          <div className="gyro-ring gyro-3" />
          <div className="gyro-core">
            <Cpu size={56} className="text-cyan-300 animate-pulse" />
          </div>
        </div>

        {/* Query Echo Block */}
        {userSpokenText && (
          <div className="thinking-query-pill">
            <span className="query-pill-tag">ВАШ ЗАПРОС</span>
            <span className="query-pill-text">«{userSpokenText}»</span>
          </div>
        )}

        {/* Status text */}
        <div className="thinking-text-block">
          <div className="thinking-hero-label">
            <Sparkles size={18} className="text-amber-400 animate-spin-slow" />
            <span>AI DIALOG SYSTEM 2026</span>
          </div>
          <h2 className="thinking-title">{status.main}</h2>
          <p className="thinking-subtitle">{status.sub}</p>
        </div>

        {/* Floating Semantic Tags */}
        <div className="thinking-tags-stream">
          <span className="stream-tag">
            <Compass size={13} />
            <span>Азимут стелы (45°)</span>
          </span>
          <span className="stream-tag">
            <Layers size={13} />
            <span>Каталог мест Актау</span>
          </span>
          <span className="stream-tag">
            <Sparkles size={13} />
            <span>TarihSky Архивы</span>
          </span>
        </div>
      </div>
    </div>
  );
};
