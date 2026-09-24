import React from 'react';
import {
  Clock,
  Footprints,
  QrCode,
  History,
  ArrowLeft,
} from 'lucide-react';
import type { Place, RouteResponse, KioskConfig } from '../../types';
import { KioskMap } from '../KioskMap';
import { DirectionCompass } from '../DirectionCompass';

interface PageRouteProps {
  place: Place;
  route: RouteResponse | null;
  config: KioskConfig | null;
  places: Place[];
  lang: string;
  onGoToPlace: () => void;
  onGoToHistory: () => void;
  onGoToQr: () => void;
}

export const PageRoute: React.FC<PageRouteProps> = ({
  place,
  route,
  config,
  places,
  lang,
  onGoToPlace,
  onGoToHistory,
  onGoToQr,
}) => {
  const origin = config?.origin || { lat: 43.6582, lng: 51.1352, heading_deg: 45 };
  const bearingDeg = route?.bearing_deg ?? 42;
  const distanceM = route?.distance_m ?? 850;
  const durationMin = route?.duration_min ?? 11;
  const directionText = route?.direction_text ?? 'Идите на северо-восток вдоль набережной';

  return (
    <div className="page-stage page-route">
      {/* Full Screen Interactive Map Background */}
      <div className="route-map-viewport">
        <KioskMap
          places={places}
          selectedPlace={place}
          route={route}
          origin={origin}
        />
      </div>

      {/* Warm Floating Navigation Header */}
      <div className="route-nav-header">
        <button className="route-back-btn" onClick={onGoToPlace}>
          <ArrowLeft size={18} />
          <span>{lang === 'kk' ? 'Орынға оралу' : 'К описанию'}</span>
        </button>

        <div className="route-destination-tag">
          <span className="dest-dot" />
          <span className="dest-label">{lang === 'kk' ? 'БАҒЫТ:' : 'МАРШРУТ:'}</span>
          <span className="dest-title">{place.name}</span>
        </div>

        <div className="route-origin-tag">
          <span>{lang === 'kk' ? 'Басталуы: 15-ш/а Амфитеатр' : 'Старт: 15 мкр (Амфитеатр)'}</span>
        </div>
      </div>

      {/* Floating Side Guide: Compass & Turn-by-Turn Card */}
      <div className="route-floating-guide">
        {/* Direction Compass */}
        <div className="guide-compass-box">
          <DirectionCompass
            bearingDeg={bearingDeg}
            kioskHeadingDeg={origin.heading_deg}
            distanceM={distanceM}
            durationMin={durationMin}
            directionText={directionText}
            lang={lang}
          />
        </div>

        {/* Turn-by-Turn Card */}
        <div className="guide-summary-card">
          <div className="guide-metrics-row">
            <div className="metric-pill">
              <Footprints size={18} className="text-sand" />
              <div className="metric-texts">
                <span className="metric-num">{distanceM} м</span>
                <span className="metric-desc">{lang === 'kk' ? 'жаяу' : 'пешком'}</span>
              </div>
            </div>

            <div className="metric-pill">
              <Clock size={18} className="text-sand" />
              <div className="metric-texts">
                <span className="metric-num">~{durationMin} мин</span>
                <span className="metric-desc">{lang === 'kk' ? 'уақыт' : 'в пути'}</span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="guide-steps-list">
            <div className="step-item active">
              <span className="step-num">1</span>
              <p className="step-text">{directionText}</p>
            </div>
            {route?.steps && route.steps.length > 0 && (
              <div className="step-item">
                <span className="step-num">2</span>
                <p className="step-text">{route.steps[0].instruction}</p>
              </div>
            )}
          </div>

          {/* Voice Prompt Buttons */}
          <div className="guide-action-buttons">
            <button className="guide-btn qr-btn" onClick={onGoToQr}>
              <QrCode size={18} />
              <span>{lang === 'kk' ? 'Телефонға жүктеу' : 'Отправить на телефон'}</span>
            </button>

            {place.has_scene && (
              <button className="guide-btn scene-btn" onClick={onGoToHistory}>
                <History size={18} />
                <span>{lang === 'kk' ? 'Тарихын көру' : 'Показать историю'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
