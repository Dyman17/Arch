import React, { useEffect } from 'react';
import { Compass, ArrowRight, Mic, Sun } from 'lucide-react';

interface PageGreetingProps {
  lang: string;
  onProceedToListening: () => void;
  kioskDistrict?: string;
}

export const PageGreeting: React.FC<PageGreetingProps> = ({
  lang,
  onProceedToListening,
}) => {
  // Auto proceed to listening after 3.2 seconds if tourist doesn't speak first
  useEffect(() => {
    const timer = setTimeout(() => {
      onProceedToListening();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onProceedToListening]);

  const greetings: Record<string, { welcome: string; title: string; subtitle: string; hint: string }> = {
    kk: {
      welcome: 'Маңғыстау • Каспий жағалауы',
      title: 'Қош келдіңіз!',
      subtitle: 'BaGdar — Ақтау қаласы мен Маңғыстаудың ыңғайлы гиді',
      hint: 'Қай жерге барғыңыз келеді? Сұрағыңызды жай ғана дауыстап айтыңыз...',
    },
    ru: {
      welcome: 'Мангистау • Побережье Каспия',
      title: 'Добро пожаловать!',
      subtitle: 'BaGdar — ваш теплый и удобный гид по Актау и побережью',
      hint: 'Какое место вас интересует? Просто спросите меня голосом...',
    },
    en: {
      welcome: 'Mangystau • Caspian Coastline',
      title: 'Welcome to Aktau!',
      subtitle: 'BaGdar — your friendly guide to the city and the Caspian Sea',
      hint: 'Where would you like to explore? Feel free to ask with your voice...',
    },
  };

  const text = greetings[lang] || greetings.ru;

  return (
    <div className="page-stage page-greeting">
      {/* Warm Sun & Sea Ambient Backdrop */}
      <div className="greeting-ambient-warmth" />

      <div className="greeting-content-container">
        {/* Friendly Location Badge */}
        <div className="greeting-location-badge">
          <Sun size={15} className="text-amber-300" />
          <span>{text.welcome}</span>
        </div>

        {/* Central Lighthouse / Compass Symbol */}
        <div className="greeting-compass-anchor">
          <div className="compass-pulse-ring" />
          <div className="compass-core-circle">
            <Compass size={44} className="text-amber-200" />
          </div>
        </div>

        {/* Welcoming Text Block */}
        <div className="greeting-text-block">
          <h1 className="greeting-hero-title">{text.title}</h1>
          <p className="greeting-hero-subtitle">{text.subtitle}</p>

          <div className="greeting-prompt-bubble">
            <div className="mic-warm-icon">
              <Mic size={20} className="text-amber-300 animate-pulse" />
            </div>
            <p className="greeting-prompt-text">{text.hint}</p>
          </div>
        </div>

        {/* Simple tactile button */}
        <button
          className="greeting-friendly-button"
          onClick={onProceedToListening}
          title="Начать диалог"
        >
          <span>Спросить голосом</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
