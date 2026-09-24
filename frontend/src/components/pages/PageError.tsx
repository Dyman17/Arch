import React from 'react';
import { AlertCircle, Mic, RefreshCw } from 'lucide-react';

interface PageErrorProps {
  lang: string;
  onRetry: () => void;
  onShowHelp: () => void;
}

export const PageError: React.FC<PageErrorProps> = ({ lang, onRetry, onShowHelp }) => {
  const errorTexts: Record<string, { title: string; subtitle: string; retryBtn: string }> = {
    kk: {
      title: 'Сөзіңіз анық естілмеді',
      subtitle: 'Өтініш, сұрағыңызды қайталаңыз немесе қысқарақ сөйлеммен айтыңыз',
      retryBtn: 'Қайтадан айту',
    },
    ru: {
      title: 'Не совсем расслышал вас',
      subtitle: 'Пожалуйста, повторите фразу громче или назовите конкретное место',
      retryBtn: 'Повторить вопрос голосом',
    },
    en: {
      title: 'Could not catch that clearly',
      subtitle: 'Please speak a bit louder or name a specific landmark',
      retryBtn: 'Try speaking again',
    },
  };

  const text = errorTexts[lang] || errorTexts.ru;

  return (
    <div className="page-stage page-error">
      <div className="error-backdrop-radiance" />

      <div className="error-center-card">
        <div className="error-icon-box">
          <AlertCircle size={52} className="text-amber-400 animate-pulse" />
        </div>

        <span className="error-tag">ОШИБКА РАСПОЗНАВАНИЯ РЕЧИ (ПОПЫТКА 1)</span>
        <h1 className="error-title">{text.title}</h1>
        <p className="error-subtitle">{text.subtitle}</p>

        <div className="error-sample-hints">
          <span className="sample-hint-label">Попробуйте сказать:</span>
          <div className="sample-chips">
            <span className="sample-chip">«Где находится скальная тропа?»</span>
            <span className="sample-chip">«Покажи набережную»</span>
            <span className="sample-chip">«Что рядом?»</span>
          </div>
        </div>

        <div className="error-actions-group">
          <button className="error-retry-btn" onClick={onRetry}>
            <Mic size={20} className="animate-pulse" />
            <span>{text.retryBtn}</span>
          </button>

          <button className="error-help-btn" onClick={onShowHelp}>
            <RefreshCw size={18} />
            <span>Посмотреть примеры команд</span>
          </button>
        </div>
      </div>
    </div>
  );
};
