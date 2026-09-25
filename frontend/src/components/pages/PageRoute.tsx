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
import { Badge } from '../ui/Badge';

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
    <div className="clean-page-root relative overflow-hidden">
      {/* Interactive Map Viewport */}
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
          icon={<ArrowLeft size={16} />}
        >
          {lang === 'kk' ? 'Орынға қайту' : 'К описанию'}
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="accent">
            {lang === 'kk' ? 'БАҒЫТ:' : 'МАРШРУТ:'} {place.name}
          </Badge>
          <Badge variant="neutral">
            15-ш/а Амфитеатр
          </Badge>
        </div>
      </div>

      {/* Floating Guidance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="clean-route-floating-panel"
      >
        {/* Minimal Compass */}
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
              <Footprints size={15} className="text-sky-400" />
              <span className="font-semibold text-white">{distanceM} м</span>
              <span className="text-zinc-400 text-xs">пешком</span>
            </div>
            <div className="clean-metric-badge">
              <Clock size={15} className="text-emerald-400" />
              <span className="font-semibold text-white">~{durationMin} мин</span>
              <span className="text-zinc-400 text-xs">в пути</span>
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
