import React from 'react';
import { MapPin, ArrowRight, Mic, Sun } from 'lucide-react';
import type { Place } from '../../types';

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

  const prompts: Record<string, { title: string; subtitle: string; voiceHint: string }> = {
    kk: {
      title: 'Бірнеше қызықты орын табылды',
      subtitle: 'Қайсысын көрсету керек? Нөмірін немесе атауын айтыңыз',
      voiceHint: '«Біріншісі», «Екіншісі» немесе «Үшіншісі» деп айтыңыз',
    },
    ru: {
      title: 'Найдено несколько мест рядом',
      subtitle: 'Какое место вас интересует? Назовите номер или название',
      voiceHint: 'Скажите вслух: «Первое», «Второе» или «Третье»',
    },
    en: {
      title: 'Several places found nearby',
      subtitle: 'Which one would you like to see? Say the number or name',
      voiceHint: 'Say: "First one", "Second one" or "Third one"',
    },
  };

  const text = prompts[lang] || prompts.ru;

  return (
    <div className="page-stage page-variants">
      <div className="variants-warm-backdrop" />

      <div className="variants-top-header">
        <div className="variants-badge">
          <Sun size={14} className="text-amber-300" />
          <span>Подборка для прогулки</span>
        </div>

        <h1 className="variants-title">{text.title}</h1>
        <p className="variants-subtitle">{text.subtitle}</p>

        <div className="variants-voice-hint">
          <Mic size={15} className="text-amber-300 animate-pulse" />
          <span>{text.voiceHint}</span>
        </div>
      </div>

      {/* 3 Large Natural Cards */}
      <div className="variants-cards-grid">
        {displayPlaces.map((place, idx) => (
          <div
            key={place.id}
            className="variant-card"
            onClick={() => onSelectPlace(place)}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Card Index Badge (1, 2, 3) */}
            <div className="variant-num-badge">
              <span>{idx + 1}</span>
            </div>

            {/* Photo */}
            <div className="variant-photo-box">
              <img
                src={place.thumb_url}
                alt={place.name}
                className="variant-photo"
              />
              <span className="variant-category-tag">
                {place.category}
              </span>
            </div>

            {/* Card Text & Meta */}
            <div className="variant-info">
              <h3 className="variant-name">{place.name}</h3>
              <p className="variant-summary">{place.summary}</p>

              <div className="variant-specs">
                <div className="spec-item">
                  <MapPin size={13} className="text-amber-300" />
                  <span>~{(idx + 1) * 350 + 400} м от стелы</span>
                </div>
              </div>

              <div className="variant-cta">
                <span>Выбрать это место</span>
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
