import React from 'react';
import { Sparkles, MapPin, Compass, ArrowRight, Mic } from 'lucide-react';
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
  // Take up to 3 or 4 places
  const displayPlaces = places.slice(0, 3);

  const prompts: Record<string, { title: string; subtitle: string; voiceHint: string }> = {
    kk: {
      title: 'Бірнеше қолайлы орын табылды',
      subtitle: 'Қайсысын көрсету керек? Нөмірін немесе атауын айтыңыз',
      voiceHint: '«Біріншісі», «Екіншісі» немесе «Үшіншісі» деп айтыңыз',
    },
    ru: {
      title: 'Найдено несколько мест рядом',
      subtitle: 'Какое место показать подробнее? Назовите номер или имя',
      voiceHint: 'Скажите: «Первое», «Второе» или «Третье»',
    },
    en: {
      title: 'Several matching locations found',
      subtitle: 'Which place would you like to explore? Say number or name',
      voiceHint: 'Say: "First one", "Second one" or "Third one"',
    },
  };

  const text = prompts[lang] || prompts.ru;

  return (
    <div className="page-stage page-variants">
      <div className="variants-top-header">
        <div className="variants-badge">
          <Sparkles size={16} className="text-amber-400" />
          <span>ПОДБОРКА ИИ BAGDAR • ВАРИАНТЫ ДЛЯ ВАС</span>
        </div>

        <h1 className="variants-title">{text.title}</h1>
        <p className="variants-subtitle">{text.subtitle}</p>

        <div className="variants-voice-hint">
          <Mic size={16} className="text-cyan-400 animate-pulse" />
          <span>{text.voiceHint}</span>
        </div>
      </div>

      {/* 3 Large Luxury Cards */}
      <div className="variants-cards-grid">
        {displayPlaces.map((place, idx) => (
          <div
            key={place.id}
            className="variant-card"
            onClick={() => onSelectPlace(place)}
            style={{ animationDelay: `${idx * 120}ms` }}
          >
            {/* Card Index Badge (1, 2, 3) */}
            <div className="variant-num-badge">
              <span>{idx + 1}</span>
            </div>

            {/* Photo with zoom effect */}
            <div className="variant-photo-box">
              <img
                src={place.thumb_url}
                alt={place.name}
                className="variant-photo"
              />
              <div className="variant-photo-gradient" />
              <span className="variant-category-tag">
                {place.category.toUpperCase()}
              </span>
            </div>

            {/* Card Text & Meta */}
            <div className="variant-info">
              <h3 className="variant-name">{place.name}</h3>
              <p className="variant-summary">{place.summary}</p>

              <div className="variant-specs">
                <div className="spec-item">
                  <MapPin size={14} className="text-cyan-400" />
                  <span>~{(idx + 1) * 350 + 400} м от стелы</span>
                </div>
                <div className="spec-item">
                  <Compass size={14} className="text-amber-400" />
                  <span>{place.has_scene ? 'TarihSky архив' : 'Пеший путь'}</span>
                </div>
              </div>

              <div className="variant-cta">
                <span>Выбрать место</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
