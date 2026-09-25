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
          <Compass size={11} className="mr-1 inline text-zinc-400" />
          {lang === 'kk' ? 'ЖАҚЫН АЙМАҚ' : 'ОКРЕСТНОСТИ СТЕЛЫ'}
        </Badge>
        <h1 className="clean-hero-heading text-3xl">
          {lang === 'kk' ? 'Айналадағы қызықты орындар' : 'Что посмотреть поблизости?'}
        </h1>
        <p className="clean-sub-heading mt-2">
          {lang === 'kk'
            ? '15-шағынаудан жағалауынан бірнеше минуттық жаяу қашықтықта'
            : 'В нескольких минутах пешей прогулки вдоль побережья Каспия'}
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
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                  <Footprints size={12} className="text-zinc-500" />
                  <span>~{(idx + 1) * 280} М · {(idx + 1) * 3} МИН</span>
                </div>
                <h3 className="clean-card-title text-base">{place.name}</h3>
                <p className="clean-card-desc text-xs mt-1">{place.summary}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-900 flex items-center justify-between text-xs font-mono uppercase">
                <span className="text-zinc-500">БЕРЕГОВАЯ ЛИНИЯ</span>
                <span className="text-zinc-900 font-medium flex items-center gap-1">
                  ИНФО <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
