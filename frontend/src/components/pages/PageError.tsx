import React from 'react';
import { Mic, RefreshCw, Volume2 } from 'lucide-react';

interface PageErrorProps {
  lang: string;
  onRetry: () => void;
  onShowHelp: () => void;
}

export const PageError: React.FC<PageErrorProps> = ({ lang, onRetry, onShowHelp }) => {
  const errorTexts: Record<string, { title: string; subtitle: string; retryBtn: string }> = {
    kk: {
      title: 'Сөзіңіз анық естілмеді',
      subtitle: 'Желдің немесе теңіз толқынының дыбысы кедергі келтірді. Сұрағыңызды қайталаңызшы.',
      retryBtn: 'Қайтадан айту',
    },
    ru: {
      title: 'Не совсем расслышал вас',
      subtitle: 'Возможно, помешал шум морского ветра. Пожалуйста, повторите громче или назовите место.',
      retryBtn: 'Повторить вопрос голосом',
    },
    en: {
      title: 'Could not catch that clearly',
      subtitle: 'The sea breeze might have interfered. Please speak a bit louder or name a place.',
      retryBtn: 'Speak again',
    },
  };

  const text = errorTexts[lang] || errorTexts.ru;

  return (
    <div className="page-stage page-error">
      <div className="error-warm-backdrop" />

      <div className="error-center-card">
        <div className="error-icon-box">
          <Volume2 size={44} className="text-amber-300" />
        </div>

        <h1 className="error-title">{text.title}</h1>
        <p className="error-subtitle">{text.subtitle}</p>

        <div className="error-sample-hints">
          <span className="sample-hint-label">Например, можно сказать:</span>
          <div className="sample-chips">
            <span className="sample-chip">«Скальная тропа»</span>
            <span className="sample-chip">«Набережная»</span>
            <span className="sample-chip">«Что есть рядом?»</span>
          </div>
        </div>

        <div className="error-actions-group">
          <button className="error-retry-btn" onClick={onRetry}>
            <Mic size={18} className="animate-pulse" />
            <span>{text.retryBtn}</span>
          </button>

          <button className="error-help-btn" onClick={onShowHelp}>
            <RefreshCw size={16} />
            <span>Примеры вопросов</span>
          </button>
        </div>
      </div>
    </div>
  );
};
