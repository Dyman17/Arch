import React from 'react';
import { Compass, MapPin, Footprints, ArrowRight } from 'lucide-react';
import type { Place } from '../../types';

interface PageNearbyProps {
  places: Place[];
  lang: string;
  onSelectPlace: (place: Place) => void;
}

export const PageNearby: React.FC<PageNearbyProps> = ({ places, onSelectPlace }) => {
  const nearbyPlaces = places.slice(0, 4);

  return (
    <div className="page-stage page-nearby">
      {/* Background Radiance & Concentric Radar Rings */}
      <div className="nearby-radar-rings">
        <div className="radar-circle ring-3" />
        <div className="radar-circle ring-2" />
        <div className="radar-circle ring-1" />
        <div className="radar-sweeper-beam" />
      </div>

      <div className="nearby-container">
        {/* Header */}
        <div className="nearby-header">
          <div className="nearby-badge">
            <Compass size={16} className="text-cyan-400" />
            <span>РАДАР СТЕЛЫ 15 МКР • НАБЕРЕЖНАЯ КАСПИЯ</span>
          </div>

          <h1 className="nearby-hero-title">Что находится рядом со стелой?</h1>
          <p className="nearby-hero-subtitle">
            Достопримечательности в радиусе 15 минут пешей прогулки вдоль побережья
          </p>
        </div>

        {/* Center Origin Beacon Tag */}
        <div className="nearby-origin-pill">
          <span className="origin-ping" />
          <MapPin size={14} className="text-amber-400" />
          <span>ТОЧКА ОТСЧЁТА: АМФИТЕАТР 15-ГО МИКРОРАЙОНА</span>
        </div>

        {/* Nearby Places Grid */}
        <div className="nearby-cards-grid">
          {nearbyPlaces.map((place, idx) => (
            <div
              key={place.id}
              className="nearby-card"
              onClick={() => onSelectPlace(place)}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="nearby-card-thumb">
                <img src={place.thumb_url} alt={place.name} />
                <span className="nearby-category-tag">{place.category}</span>
              </div>

              <div className="nearby-card-body">
                <div className="nearby-meta-row">
                  <span className="nearby-distance">
                    <Footprints size={14} className="text-cyan-400" />
                    <span>~{(idx + 1) * 320} м • {(idx + 1) * 4} мин</span>
                  </span>
                  <span className="nearby-bearing">
                    <Compass size={14} className="text-amber-400" />
                    <span>Азимут {idx * 45 + 30}°</span>
                  </span>
                </div>

                <h3 className="nearby-place-title">{place.name}</h3>
                <p className="nearby-place-desc">{place.summary}</p>

                <div className="nearby-card-action">
                  <span>Узнать больше</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
