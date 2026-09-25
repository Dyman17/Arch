import React from 'react';
import { Footprints, ArrowRight } from 'lucide-react';
import type { Place } from '../../types';
import { Card } from '../ui/Card';

interface PageNearbyProps {
  places: Place[];
  lang: string;
  onSelectPlace: (place: Place) => void;
}

export const PageNearby: React.FC<PageNearbyProps> = ({ places, lang, onSelectPlace }) => {
  const nearbyPlaces = places.slice(0, 4);

  return (
    <div className="clean-page-root flex flex-col justify-center items-center p-8">
      {/* Header */}
      <div className="text-center mb-8 max-w-xl">
        <h1 className="clean-hero-heading text-3xl">
          {lang === 'kk' ? 'Айналадағы қызықты орындар' : 'Что посмотреть поблизости?'}
        </h1>
        <p className="clean-sub-heading mt-2">
          {lang === 'kk'
            ? 'Жаяу бірнеше минуттық қашықтықта орналасқан орындар'
            : 'В нескольких минутах приятной пешей прогулки'}
        </p>
      </div>

      {/* Grid of 4 Cards */}
      <div className="clean-nearby-grid">
        {nearbyPlaces.map((place, idx) => (
          <Card
            key={place.id}
            hoverable
            onClick={() => onSelectPlace(place)}
            className="clean-nearby-card"
          >
            <div className="clean-nearby-thumb-wrap">
              <img src={place.thumb_url} alt={place.name} className="clean-nearby-thumb" />
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1.5">
                  <Footprints size={13} />
                  <span>~{(idx + 1) * 280} м · {(idx + 1) * 3} мин</span>
                </div>
                <h3 className="clean-card-title text-base">{place.name}</h3>
                <p className="clean-card-desc text-xs mt-1">{place.summary}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400">У моря</span>
                <span className="text-zinc-900 font-medium flex items-center gap-1">
                  Подробнее <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
