import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Place } from '../../types';
import { Card } from '../ui/Card';

interface PageVariantsProps {
  places: Place[];
  lang: string;
  onSelectPlace: (place: Place) => void;
}

export const PageVariants: React.FC<PageVariantsProps> = ({
  places,
  lang,
  onSelectPlace,
}) => {
  const displayPlaces = places.slice(0, 3);

  const prompts: Record<string, { title: string; subtitle: string }> = {
    kk: {
      title: 'Қай орынды таңдайсыз?',
      subtitle: 'Атауын немесе нөмірін айтыңыз, немесе басып таңдаңыз',
    },
    ru: {
      title: 'Какое место вас интересует?',
      subtitle: 'Назовите нужное место или выберите касанием',
    },
    en: {
      title: 'Which place would you like to explore?',
      subtitle: 'Say the name or tap to select',
    },
  };

  const text = prompts[lang] || prompts.ru;

  return (
    <div className="clean-page-root flex flex-col justify-center items-center p-8">
      {/* Header */}
      <div className="text-center mb-8 max-w-xl">
        <h1 className="clean-hero-heading text-3xl">{text.title}</h1>
        <p className="clean-sub-heading mt-2">{text.subtitle}</p>
      </div>

      {/* 3 Soft Cards */}
      <div className="clean-variants-grid">
        {displayPlaces.map((place, idx) => (
          <Card
            key={place.id}
            hoverable
            onClick={() => onSelectPlace(place)}
            className="clean-variant-card"
          >
            {/* Number Pill */}
            <div className="clean-card-num-badge">
              <span>{idx + 1}</span>
            </div>

            {/* Photo */}
            <div className="clean-card-thumb-wrap">
              <img
                src={place.thumb_url}
                alt={place.name}
                className="clean-card-thumb"
              />
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="clean-card-title">{place.name}</h3>
                <p className="clean-card-desc">{place.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">
                  ~{(idx + 1) * 350 + 400} м от стелы
                </span>
                <span className="text-zinc-900 font-medium flex items-center gap-1">
                  Выбрать <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
