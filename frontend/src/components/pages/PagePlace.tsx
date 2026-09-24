import React from 'react';
import {
  Navigation,
  History,
  QrCode,
  MapPin,
  Clock,
  Compass,
  Sparkles,
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
      {/* Immersive Photo Background with Editorial Vignette */}
      <div className="place-backdrop-layer">
        <img src={heroPhoto} alt={localized.name} className="place-backdrop-img" />
        <div className="place-backdrop-gradient" />
      </div>

      <div className="place-editorial-container">
        {/* Top bar with category & status */}
        <div className="place-top-nav">
          <div className="flex items-center gap-3">
            {onBackToNearby && (
              <button
                className="route-back-btn mr-2"
                onClick={onBackToNearby}
                title="Назад к списку рядом"
              >
                <ArrowLeft size={16} />
                <span>Что рядом</span>
              </button>
            )}
            <div className="place-category-pill">
              <span className="category-dot" />
              <span className="category-text">
                {place.category.toUpperCase()} • МАНГИСТАУ
              </span>
            </div>
          </div>

          <div className="place-status-pill">
            <Clock size={13} className="text-emerald-400" />
            <span>
              {place.is_open_now !== false ? 'ОТКРЫТО СЕЙЧАС' : 'ЗАКРЫТО'}
            </span>
            <span className="status-separator">•</span>
            <span>КРУГЛОСУТОЧНО</span>
          </div>
        </div>

        {/* Main Editorial Hero Section */}
        <div className="place-main-section">
          <div className="place-header-block">
            <span className="place-curated-badge">
              <Sparkles size={14} className="text-amber-400" />
              <span>РЕКОМЕНДОВАНО ЦИФРОВЫМ ГИДОМ BAGDAR</span>
            </span>

            <h1 className="place-hero-title">{localized.name}</h1>
            <p className="place-hero-quote">«{localized.summary}»</p>
          </div>

          {/* Details & Specs Bar */}
          <div className="place-specs-strip">
            <div className="spec-card">
              <div className="spec-icon-box">
                <MapPin size={18} className="text-cyan-400" />
              </div>
              <div className="spec-details">
                <span className="spec-label">ЛОКАЦИЯ</span>
                <span className="spec-val">{localized.address}</span>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-icon-box">
                <Footprints size={18} className="text-amber-400" />
              </div>
              <div className="spec-details">
                <span className="spec-label">РАССТОЯНИЕ ОТ СТЕЛЫ</span>
                <span className="spec-val">~850 м • 11 мин пешком</span>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-icon-box">
                <Compass size={18} className="text-purple-400" />
              </div>
              <div className="spec-details">
                <span className="spec-label">НАПРАВЛЕНИЕ</span>
                <span className="spec-val">Северо-Восток (42°)</span>
              </div>
            </div>
          </div>

          {/* Voice Prompt Suggestions & Instant Action Buttons */}
          <div className="place-actions-footer">
            <div className="voice-prompt-banner">
              <span className="mic-listening-dot" />
              <span className="voice-banner-label">
                Голосовые команды (скажите вслух или нажмите):
              </span>
            </div>

            <div className="action-buttons-group">
              <button
                className="action-pill-btn primary-route"
                onClick={onGoToRoute}
              >
                <Navigation size={18} />
                <span className="btn-text">«Как пройти?»</span>
                <span className="btn-subtext">Показать маршрут на карте</span>
                <ArrowRight size={16} className="btn-arrow" />
              </button>

              {place.has_scene && (
                <button
                  className="action-pill-btn secondary-history"
                  onClick={onGoToHistory}
                >
                  <History size={18} />
                  <span className="btn-text">«Покажи как было»</span>
                  <span className="btn-subtext">TarihSky: Тогда и сейчас</span>
                </button>
              )}

              <button
                className="action-pill-btn secondary-qr"
                onClick={onGoToQr}
              >
                <QrCode size={18} />
                <span className="btn-text">«Отправь на телефон»</span>
                <span className="btn-subtext">QR-код навигации</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
