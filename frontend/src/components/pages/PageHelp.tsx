import React from 'react';
import { HelpCircle, Mic, Globe, Sparkles, Navigation, History, QrCode, ArrowLeft } from 'lucide-react';

interface PageHelpProps {
  lang: string;
  onBack: () => void;
  onStartListening: () => void;
}

export const PageHelp: React.FC<PageHelpProps> = ({ lang, onBack, onStartListening }) => {
  return (
    <div className="page-stage page-help">
      <div className="help-top-bar">
        <button className="help-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Назад</span>
        </button>

        <div className="help-badge">
          <HelpCircle size={16} className="text-amber-400" />
          <span>СПРАВКА ПО ГОЛОСОВОМУ УПРАВЛЕНИЮ • BAGDAR KIOSK</span>
        </div>
      </div>

      <div className="help-content-container">
        <div className="help-hero-block">
          <h1 className="help-title">Как пользоваться цифровой стелой?</h1>
          <p className="help-subtitle">
            Стела полностью управляется голосом на любом языке. Просто подойдите и спросите.
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
                <Mic size={14} className="text-cyan-400" />
                <span>«Жартасты соқпаққа қалай барады?»</span>
              </div>
              <div className="help-chip">
                <History size={14} className="text-amber-400" />
                <span>«Осы жердің тарихын көрсетші»</span>
              </div>
              <div className="help-chip">
                <QrCode size={14} className="text-emerald-400" />
                <span>«Маршрутты телефоныма жібер»</span>
              </div>
              <div className="help-chip">
                <Sparkles size={14} className="text-purple-400" />
                <span>«Жақын маңда қандай қызықты орындар бар?»</span>
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
                <Mic size={14} className="text-cyan-400" />
                <span>«Как пройти к Скальной тропе?»</span>
              </div>
              <div className="help-chip">
                <Navigation size={14} className="text-cyan-400" />
                <span>«Где находится маяк на крыше?»</span>
              </div>
              <div className="help-chip">
                <History size={14} className="text-amber-400" />
                <span>«Покажи как это место выглядело в 1968 году»</span>
              </div>
              <div className="help-chip">
                <QrCode size={14} className="text-emerald-400" />
                <span>«Отправь маршрут на телефон»</span>
              </div>
              <div className="help-chip">
                <Sparkles size={14} className="text-purple-400" />
                <span>«Что интересного есть рядом со стелой?»</span>
              </div>
            </div>
          </div>

          {/* English */}
          <div className={`help-col ${lang === 'en' ? 'highlight' : ''}`}>
            <div className="help-col-header">
              <span className="lang-flag">🇬🇧</span>
              <h3>In English (or any language)</h3>
            </div>
            <div className="help-chips-list">
              <div className="help-chip">
                <Mic size={14} className="text-cyan-400" />
                <span>"How do I walk to the Rock Trail?"</span>
              </div>
              <div className="help-chip">
                <History size={14} className="text-amber-400" />
                <span>"Show TarihSky archival comparison"</span>
              </div>
              <div className="help-chip">
                <QrCode size={14} className="text-emerald-400" />
                <span>"Send the route to my mobile phone"</span>
              </div>
              <div className="help-chip">
                <Globe size={14} className="text-cyan-400" />
                <span>"What cafes or parks are nearby?"</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to start speaking */}
        <div className="help-bottom-cta">
          <button className="help-listen-btn" onClick={onStartListening}>
            <Mic size={20} className="animate-pulse" />
            <span>Начать говорить сейчас</span>
          </button>
        </div>
      </div>
    </div>
  );
};
