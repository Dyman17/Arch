import React from 'react';
import { motion } from 'motion/react';
import {
  Navigation,
  History,
  QrCode,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Footprints,
} from 'lucide-react';
import type { Place } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

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
  const localized = place.texts?.[lang] || {
    name: place.name,
    summary: place.summary,
    description: place.description || place.summary,
    address: place.address || 'г. Актау, побережье Каспия',
  };

  const heroPhoto =
    place.photos && place.photos.length > 0 ? place.photos[0] : place.thumb_url;

  return (
    <div className="clean-page-root flex-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="clean-place-bento"
      >
        {/* Navigation Top Row */}
        <div className="clean-bento-top">
          {onBackToNearby ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToNearby}
              icon={<ArrowLeft size={14} />}
            >
              {lang === 'kk' ? 'Барлық орындар' : 'Каталог мест'}
            </Button>
          ) : (
            <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              MONOGRAPH · № {place.id < 10 ? `0${place.id}` : place.id}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Badge variant="neutral">
              {place.category.toUpperCase()}
            </Badge>
            <Badge variant="neutral">
              {place.is_open_now !== false ? 'ОТКРЫТО · 24/7' : 'ЗАКРЫТО'}
            </Badge>
          </div>
        </div>

        {/* Content Split: Image + Details */}
        <div className="clean-bento-grid">
          {/* Photo Frame */}
          <div className="clean-bento-photo-wrap">
            <img
              src={heroPhoto}
              alt={localized.name}
              className="clean-bento-photo"
            />
          </div>

          {/* Place Info */}
          <div className="clean-bento-info">
            <h1 className="clean-place-title">{localized.name}</h1>
            <p className="clean-place-desc">{localized.summary}</p>

            {/* Architectural Specs */}
            <div className="clean-specs-row">
              <div className="clean-spec-pill">
                <Footprints size={14} className="text-zinc-400" />
                <span>~850 М · 10–12 МИН</span>
              </div>
              <div className="clean-spec-pill">
                <MapPin size={14} className="text-zinc-400" />
                <span>{localized.address}</span>
              </div>
              <div className="clean-spec-pill">
                <Clock size={14} className="text-zinc-400" />
                <span>24/7 ДОСТУП</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="clean-actions-row">
              <Button
                variant="primary"
                size="lg"
                onClick={onGoToRoute}
                icon={<Navigation size={16} />}
              >
                {lang === 'kk' ? 'Бағытты көрсету' : 'Как пройти?'}
                <ArrowRight size={14} className="ml-2 inline" />
              </Button>

              {place.has_scene && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onGoToHistory}
                  icon={<History size={16} />}
                >
                  {lang === 'kk' ? 'Тарихы (TarihSky)' : 'История TarihSky'}
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={onGoToQr}
                icon={<QrCode size={16} />}
              >
                {lang === 'kk' ? 'Телефонға' : 'QR на телефон'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
