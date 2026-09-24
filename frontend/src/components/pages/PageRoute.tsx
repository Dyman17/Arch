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

      {/* Floating HUD Header */}
      <div className="route-hud-header">
        <button className="route-back-btn" onClick={onGoToPlace}>
          <ArrowLeft size={18} />
          <span>К карточке места</span>
        </button>

        <div className="route-destination-tag">
          <span className="dest-dot" />
          <span className="dest-label">МАРШРУТ:</span>
          <span className="dest-title">{place.name}</span>
        </div>

        <div className="route-origin-tag">
          <span>ОТ: СТЕЛА 15 МКР (АМФИТЕАТР)</span>
        </div>
      </div>

      {/* Floating Left Panel: Turn-by-Turn Guide & Compass */}
      <div className="route-floating-cockpit">
        {/* Direction Compass */}
        <div className="cockpit-compass-box">
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
        <div className="cockpit-guide-card">
          <div className="guide-metrics-row">
            <div className="metric-pill">
              <Footprints size={18} className="text-amber-400" />
              <div className="metric-texts">
                <span className="metric-num">{distanceM} м</span>
                <span className="metric-desc">пешком</span>
              </div>
            </div>

            <div className="metric-pill">
              <Clock size={18} className="text-cyan-400" />
              <div className="metric-texts">
                <span className="metric-num">~{durationMin} мин</span>
                <span className="metric-desc">время в пути</span>
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

          {/* Quick Voice Handover Bar */}
          <div className="cockpit-action-buttons">
            <button className="cockpit-btn qr-btn" onClick={onGoToQr}>
              <QrCode size={18} />
              <span>«Отправь на телефон»</span>
            </button>

            {place.has_scene && (
              <button className="cockpit-btn scene-btn" onClick={onGoToHistory}>
                <History size={18} />
                <span>«Покажи историю»</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
