import React, { useEffect } from 'react';
import { Sparkles, Radio, Compass, ArrowRight } from 'lucide-react';

interface PageGreetingProps {
  lang: string;
  onProceedToListening: () => void;
  kioskDistrict?: string;
}

export const PageGreeting: React.FC<PageGreetingProps> = ({
  lang,
  onProceedToListening,
}) => {
  // Auto proceed to listening after 2.8 seconds if tourist doesn't speak first
  useEffect(() => {
    const timer = setTimeout(() => {
      onProceedToListening();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onProceedToListening]);

  const greetings: Record<string, { title: string; subtitle: string; hint: string }> = {
    kk: {
      title: 'Сәлеметсіз бе!',
      subtitle: 'BaGdar — Ақтау мен Маңғыстаудың цифрлық гиді',
      hint: 'Қай жерге барғыңыз келеді? Сұрағыңызды айтыңыз...',
    },
    ru: {
      title: 'Здравствуйте!',
      subtitle: 'BaGdar — цифровой гид по Актау и Мангистау',
      hint: 'Какое место вас интересует? Просто спросите голосом...',
    },
    en: {
      title: 'Welcome to Aktau!',
      subtitle: 'BaGdar — your digital guide to Mangystau',
      hint: 'Where would you like to explore? Ask anything with your voice...',
    },
  };

  const text = greetings[lang] || greetings.ru;

  return (
    <div className="page-stage page-greeting">
      {/* Dynamic Background Radiance */}
      <div className="greeting-radiance" />
      <div className="greeting-grid-lines" />

      <div className="greeting-content-container">
        {/* Top telemetry pill */}
        <div className="greeting-badge">
          <span className="greeting-live-dot" />
          <Radio size={14} className="text-cyan-400" />
          <span>КАМЕРА ЗАФИКСИРОВАЛА ВАС • СТЕЛА 15 МКР • НАБЕРЕЖНАЯ</span>
        </div>

        {/* Central Lighthouse / Pulse Beacon */}
        <div className="greeting-beacon-anchor">
          <div className="beacon-ring-outer" />
          <div className="beacon-ring-mid" />
          <div className="beacon-core">
            <Compass size={48} className="beacon-icon animate-spin-slow" />
          </div>
        </div>

        {/* Typography */}
        <div className="greeting-text-block">
          <div className="greeting-subtag">
            <Sparkles size={16} />
            <span>AKTAU SMART KIOSK 2026</span>
          </div>

          <h1 className="greeting-hero-title">{text.title}</h1>
          <p className="greeting-hero-subtitle">{text.subtitle}</p>

          <div className="greeting-prompt-box">
            <div className="sound-mic-indicator">
              <span className="sound-mic-bar b1" />
              <span className="sound-mic-bar b2" />
              <span className="sound-mic-bar b3" />
              <span className="sound-mic-bar b4" />
            </div>
            <p className="greeting-prompt-text">{text.hint}</p>
          </div>
        </div>

        {/* Action Skip Button (Tactile / Accessibility fallback) */}
        <button
          className="greeting-action-button"
          onClick={onProceedToListening}
          title="Начать диалог"
        >
          <span>Начать диалог</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
