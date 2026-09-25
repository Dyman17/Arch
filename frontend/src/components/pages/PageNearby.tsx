import React from 'react';
import { Footprints, ArrowRight, Compass } from 'lucide-react';
import type { Place } from '../../types';
import { Badge } from '../ui/Badge';
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
        <Badge variant="accent" className="mb-3">
          <Compass size={12} className="mr-1 inline text-sky-400" />
          {lang === 'kk' ? 'Жақын жерлер' : 'Рядом со стелой'}
        </Badge>
        <h1 className="clean-hero-heading text-3xl">
          {lang === 'kk' ? 'Айналадағы қызықты орындар' : 'Что посмотреть поблизости?'}
        </h1>
        <p className="clean-sub-heading mt-2">
          {lang === 'kk'
            ? '15-шағынаудан жағалауынан бірнеше минуттық жаяу қашықтықта'
            : 'В нескольких минутах пешей прогулки вдоль набережной 15-го микрорайона'}
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
              <span className="clean-card-category">{place.category}</span>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-sky-400 font-medium mb-1.5">
                  <Footprints size={13} />
                  <span>~{(idx + 1) * 280} м · {(idx + 1) * 3} мин</span>
                </div>
                <h3 className="clean-card-title text-base">{place.name}</h3>
                <p className="clean-card-desc text-xs mt-1">{place.summary}</p>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs text-zinc-400">
                <span>У моря</span>
                <span className="text-sky-400 font-medium flex items-center gap-1">
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
