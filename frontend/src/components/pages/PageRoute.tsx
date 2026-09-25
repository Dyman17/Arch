import React from 'react';
import { motion } from 'motion/react';
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
import { Button } from '../ui/Button';

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
  const directionText = route?.direction_text ?? 'Идите вдоль набережной на северо-восток';

  return (
    <div className="clean-page-root relative overflow-hidden">
      {/* Light Clean Map Viewport */}
      <div className="absolute inset-0 z-0">
        <KioskMap
          places={places}
          selectedPlace={place}
          route={route}
          origin={origin}
        />
      </div>

      {/* Floating Top Nav */}
      <div className="clean-route-top-bar">
        <Button
          variant="glass"
          size="sm"
          onClick={onGoToPlace}
          icon={<ArrowLeft size={15} />}
        >
          {lang === 'kk' ? 'Орынға қайту' : 'К описанию'}
        </Button>

        <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-sm border border-black/5 text-sm font-medium text-zinc-900">
          {place.name}
        </div>
      </div>

      {/* Floating Guidance Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="clean-route-floating-panel"
      >
        {/* Soft Compass */}
        <div className="clean-compass-card">
          <DirectionCompass
            bearingDeg={bearingDeg}
            kioskHeadingDeg={origin.heading_deg}
            distanceM={distanceM}
            durationMin={durationMin}
            directionText={directionText}
            lang={lang}
          />
        </div>

        {/* Turn-by-turn guidance card */}
        <div className="clean-guide-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="clean-metric-badge">
              <Footprints size={15} className="text-zinc-600" />
              <span className="font-semibold text-zinc-900">{distanceM} м</span>
              <span className="text-zinc-500 text-xs">пешком</span>
            </div>
            <div className="clean-metric-badge">
              <Clock size={15} className="text-zinc-600" />
              <span className="font-semibold text-zinc-900">~{durationMin} мин</span>
              <span className="text-zinc-500 text-xs">в пути</span>
            </div>
          </div>

          <div className="clean-steps-box mb-4">
            <div className="clean-step-item">
              <span className="clean-step-index">1</span>
              <p className="clean-step-instruction">{directionText}</p>
            </div>
            {route?.steps && route.steps.length > 0 && (
              <div className="clean-step-item">
                <span className="clean-step-index">2</span>
                <p className="clean-step-instruction">{route.steps[0].instruction}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={onGoToQr}
              icon={<QrCode size={16} />}
              className="flex-1"
            >
              {lang === 'kk' ? 'Телефонға алу' : 'Маршрут на телефон'}
            </Button>

            {place.has_scene && (
              <Button
                variant="secondary"
                size="md"
                onClick={onGoToHistory}
                icon={<History size={16} />}
              >
                {lang === 'kk' ? 'Тарихы' : 'История'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
