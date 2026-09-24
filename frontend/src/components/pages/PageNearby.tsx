import React from 'react';
import { MapPin, Footprints, ArrowRight, Sun } from 'lucide-react';
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
      <div className="nearby-warm-backdrop" />

      <div className="nearby-container">
        {/* Header */}
        <div className="nearby-header">
          <div className="nearby-friendly-badge">
            <Sun size={14} className="text-amber-300" />
            <span>Набережная 15-го микрорайона</span>
          </div>

          <h1 className="nearby-hero-title">Что посмотреть рядом со стелой?</h1>
          <p className="nearby-hero-subtitle">
            Интересные места в нескольких минутах приятной прогулки вдоль Каспийского моря
          </p>
        </div>

        {/* Nearby Places Grid */}
        <div className="nearby-cards-grid">
          {nearbyPlaces.map((place, idx) => (
            <div
              key={place.id}
              className="nearby-card"
              onClick={() => onSelectPlace(place)}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="nearby-card-thumb">
                <img src={place.thumb_url} alt={place.name} />
                <span className="nearby-category-tag">{place.category}</span>
              </div>

              <div className="nearby-card-body">
                <div className="nearby-meta-row">
                  <span className="nearby-distance">
                    <Footprints size={14} className="text-cyan-400" />
                    <span>~{(idx + 1) * 300} м • {(idx + 1) * 4} мин</span>
                  </span>
                  <span className="nearby-open">
                    <MapPin size={13} className="text-amber-300" />
                    <span>У моря</span>
                  </span>
                </div>

                <h3 className="nearby-place-title">{place.name}</h3>
                <p className="nearby-place-desc">{place.summary}</p>

                <div className="nearby-card-action">
                  <span>Подробнее</span>
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
