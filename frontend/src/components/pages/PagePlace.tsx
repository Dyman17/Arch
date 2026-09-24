import React from 'react';
import {
  Navigation,
  History,
  QrCode,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  ArrowLeft,
  Footprints,
} from 'lucide-react';
import type { Place } from '../../types';

interface PagePlaceProps {
  place: Place;
  lang: string;
  onGoToRoute: () => void;
  onGoToHistory: () => void;
  onGoToQr: () => void;
  onBackToNearby?: () => void;
}

export const PagePlace: React.FC<PagePlaceProps> = ({
  place,
  lang,
  onGoToRoute,
  onGoToHistory,
  onGoToQr,
  onBackToNearby,
}) => {
  // Localized texts
  const localized = place.texts?.[lang] || {
    name: place.name,
    summary: place.summary,
    description: place.description || place.summary,
    address: place.address || 'г. Актау, побережье Каспийского моря',
  };

  const heroPhoto =
    place.photos && place.photos.length > 0 ? place.photos[0] : place.thumb_url;

  return (
    <div className="page-stage page-place">
      {/* Immersive Photo Background with Natural Warm Gradient */}
      <div className="place-backdrop-layer">
        <img src={heroPhoto} alt={localized.name} className="place-backdrop-img" />
        <div className="place-backdrop-gradient" />
      </div>

      <div className="place-editorial-container">
        {/* Top bar */}
        <div className="place-top-nav">
          <div className="flex items-center gap-3">
            {onBackToNearby && (
              <button
                className="friendly-back-btn"
                onClick={onBackToNearby}
                title="Назад к списку мест"
              >
                <ArrowLeft size={16} />
                <span>Все места рядом</span>
              </button>
            )}
            <div className="place-category-badge">
              <span>{place.category.toUpperCase()} • АҚТАУ</span>
            </div>
          </div>

          <div className="place-status-badge">
            <Clock size={13} className="text-emerald-400" />
            <span>
              {place.is_open_now !== false ? 'Открыто сейчас' : 'Закрыто'}
            </span>
            <span className="status-separator">•</span>
            <span>Круглосуточно</span>
          </div>
        </div>

        {/* Main Editorial Hero Section */}
        <div className="place-main-section">
          <div className="place-header-block">
            <h1 className="place-hero-title">{localized.name}</h1>
            <p className="place-hero-quote">«{localized.summary}»</p>
          </div>

          {/* Details & Specs Bar */}
          <div className="place-specs-strip">
            <div className="spec-card">
              <div className="spec-icon-box">
                <MapPin size={18} className="text-amber-400" />
              </div>
              <div className="spec-details">
                <span className="spec-label">Адрес</span>
                <span className="spec-val">{localized.address}</span>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-icon-box">
                <Footprints size={18} className="text-cyan-400" />
              </div>
              <div className="spec-details">
                <span className="spec-label">Пешком от стелы</span>
                <span className="spec-val">~850 метров • 10-12 минут</span>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-icon-box">
                <Compass size={18} className="text-amber-300" />
              </div>
              <div className="spec-details">
                <span className="spec-label">Направление</span>
                <span className="spec-val">Вдоль набережной Каспия</span>
              </div>
            </div>
          </div>

          {/* Voice Prompt Suggestions & Action Buttons */}
          <div className="place-actions-footer">
            <div className="voice-prompt-banner">
              <span className="banner-wave-dot" />
              <span className="voice-banner-label">
                Скажите вслух или выберите действие:
              </span>
            </div>

            <div className="action-buttons-group">
              <button
                className="action-pill-btn primary-route"
                onClick={onGoToRoute}
              >
                <Navigation size={18} />
                <div className="btn-texts-box">
                  <span className="btn-text">«Как пройти?»</span>
                  <span className="btn-subtext">Показать маршрут на карте</span>
                </div>
                <ArrowRight size={16} className="btn-arrow" />
              </button>

              {place.has_scene && (
                <button
                  className="action-pill-btn secondary-history"
                  onClick={onGoToHistory}
                >
                  <History size={18} />
                  <div className="btn-texts-box">
                    <span className="btn-text">«Покажи как было»</span>
                    <span className="btn-subtext">Архивные фото 1968 г.</span>
                  </div>
                </button>
              )}

              <button
                className="action-pill-btn secondary-qr"
                onClick={onGoToQr}
              >
                <QrCode size={18} />
                <div className="btn-texts-box">
                  <span className="btn-text">«Отправь на телефон»</span>
                  <span className="btn-subtext">Забрать маршрут в дорогу</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
