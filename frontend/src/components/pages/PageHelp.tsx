import React from 'react';
import { HelpCircle, Mic, Globe, Navigation, History, QrCode, ArrowLeft } from 'lucide-react';

interface PageHelpProps {
  lang: string;
  onBack: () => void;
  onStartListening: () => void;
}

export const PageHelp: React.FC<PageHelpProps> = ({ lang, onBack, onStartListening }) => {
  return (
    <div className="page-stage page-help">
      <div className="help-warm-backdrop" />

      <div className="help-top-bar">
        <button className="friendly-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>

        <div className="help-friendly-badge">
          <HelpCircle size={15} className="text-amber-300" />
          <span>Подсказки для гостей стелы</span>
        </div>
      </div>

      <div className="help-content-container">
        <div className="help-hero-block">
          <h1 className="help-title">Как общаться со стелой?</h1>
          <p className="help-subtitle">
            Стела понимает обычную человеческую речь на любом языке. Просто подойдите и спросите о городе.
          </p>
        </div>

        {/* 3 Language Command Columns */}
        <div className="help-columns-grid">
          {/* Kazakh */}
          <div className={`help-col ${lang === 'kk' ? 'highlight' : ''}`}>
            <div className="help-col-header">
              <span className="lang-flag">🇰🇿</span>
              <h3>Қазақ тілінде</h3>
            </div>
            <div className="help-chips-list">
              <div className="help-chip">
                <Mic size={14} className="text-amber-300" />
                <span>«Жартасты соқпаққа қалай барады?»</span>
              </div>
              <div className="help-chip">
                <History size={14} className="text-cyan-300" />
                <span>«Осы жердің тарихын көрсетші»</span>
              </div>
              <div className="help-chip">
                <QrCode size={14} className="text-emerald-300" />
                <span>«Маршрутты телефоныма жібер»</span>
              </div>
              <div className="help-chip">
                <Navigation size={14} className="text-amber-200" />
                <span>«Жақын маңда қандай орындар бар?»</span>
              </div>
            </div>
          </div>

          {/* Russian */}
          <div className={`help-col ${lang === 'ru' ? 'highlight' : ''}`}>
            <div className="help-col-header">
              <span className="lang-flag">🇷🇺</span>
              <h3>На русском языке</h3>
            </div>
            <div className="help-chips-list">
              <div className="help-chip">
                <Mic size={14} className="text-amber-300" />
                <span>«Как пройти к Скальной тропе?»</span>
              </div>
              <div className="help-chip">
                <Navigation size={14} className="text-cyan-300" />
                <span>«Где находится маяк на крыше?»</span>
              </div>
              <div className="help-chip">
                <History size={14} className="text-amber-300" />
                <span>«Покажи как это место выглядело раньше»</span>
              </div>
              <div className="help-chip">
                <QrCode size={14} className="text-emerald-300" />
                <span>«Отправь маршрут на телефон»</span>
              </div>
            </div>
          </div>

          {/* English */}
          <div className={`help-col ${lang === 'en' ? 'highlight' : ''}`}>
            <div className="help-col-header">
              <span className="lang-flag">🇬🇧</span>
              <h3>In English</h3>
            </div>
            <div className="help-chips-list">
              <div className="help-chip">
                <Mic size={14} className="text-amber-300" />
                <span>"How do I walk to the Rock Trail?"</span>
              </div>
              <div className="help-chip">
                <History size={14} className="text-cyan-300" />
                <span>"Show historic photos"</span>
              </div>
              <div className="help-chip">
                <QrCode size={14} className="text-emerald-300" />
                <span>"Send the route to my phone"</span>
              </div>
              <div className="help-chip">
                <Globe size={14} className="text-amber-200" />
                <span>"What places are nearby?"</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to start speaking */}
        <div className="help-bottom-cta">
          <button className="help-listen-btn" onClick={onStartListening}>
            <Mic size={18} className="animate-pulse" />
            <span>Начать говорить</span>
          </button>
        </div>
      </div>
    </div>
  );
};
