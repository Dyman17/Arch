import React from 'react';
import { Compass, MapPin, Footprints } from 'lucide-react';

interface PageThinkingProps {
  userSpokenText: string;
  lang: string;
}

export const PageThinking: React.FC<PageThinkingProps> = ({ userSpokenText, lang }) => {
  const statusTexts: Record<string, { main: string; sub: string }> = {
    kk: {
      main: 'Бір сәт, ең ыңғайлы жолды қарастырудамын...',
      sub: 'Ақтау мен Маңғыстаудың нақты бағыттарын тексеремін',
    },
    ru: {
      main: 'Секунду, подбираю для вас лучший маршрут...',
      sub: 'Сверяю расстояние по набережной и время пешей прогулки',
    },
    en: {
      main: 'One moment, finding the best route for you...',
      sub: 'Checking walking paths along the Caspian shoreline',
    },
  };

  const status = statusTexts[lang] || statusTexts.ru;

  return (
    <div className="page-stage page-thinking">
      <div className="thinking-warm-radiance" />

      <div className="thinking-center-stage">
        {/* Warm lighthouse beacon pulse */}
        <div className="thinking-beacon-wrapper">
          <div className="beacon-breathing-ring r1" />
          <div className="beacon-breathing-ring r2" />
          <div className="thinking-compass-center">
            <Compass size={48} className="text-amber-200 animate-spin-slow" />
          </div>
        </div>

        {/* User query card */}
        {userSpokenText && (
          <div className="thinking-query-bubble">
            <span className="query-subtext">Ваш вопрос:</span>
            <p className="query-text">«{userSpokenText}»</p>
          </div>
        )}

        {/* Status text */}
        <div className="thinking-status-block">
          <h2 className="thinking-title">{status.main}</h2>
          <p className="thinking-subtitle">{status.sub}</p>
        </div>

        {/* Natural friendly tags */}
        <div className="thinking-friendly-badges">
          <span className="friendly-badge">
            <MapPin size={13} className="text-amber-300" />
            <span>Побережье Актау</span>
          </span>
          <span className="friendly-badge">
            <Footprints size={13} className="text-cyan-300" />
            <span>Пешая доступность</span>
          </span>
        </div>
      </div>
    </div>
  );
};
