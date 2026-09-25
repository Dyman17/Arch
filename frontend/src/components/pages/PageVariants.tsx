import React from 'react';
import { MapPin, ArrowRight, Mic } from 'lucide-react';
import type { Place } from '../../types';
import { Badge } from '../ui/Badge';
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
  const romanNumbers = ['I', 'II', 'III'];

  const prompts: Record<string, { title: string; subtitle: string; voiceHint: string }> = {
    kk: {
      title: 'Бірнеше орын табылды',
      subtitle: 'Қайсысын көрсетейін? Нөмірін немесе атауын айтыңыз',
      voiceHint: '«Біріншісі», «Екіншісі» немесе «Үшіншісі» деп айтыңыз',
    },
    ru: {
      title: 'Найдено несколько мест',
      subtitle: 'Какое вас интересует? Назовите номер или выберите касанием',
      voiceHint: 'Скажите: «Первое», «Второе» или «Третье»',
    },
    en: {
      title: 'Several places found',
      subtitle: 'Which one would you like to view? Say the number or tap',
      voiceHint: 'Say: "First", "Second" or "Third"',
    },
  };

  const text = prompts[lang] || prompts.ru;

  return (
    <div className="clean-page-root flex flex-col justify-center items-center p-8">
      {/* Header */}
      <div className="text-center mb-8 max-w-xl">
        <Badge variant="accent" className="mb-3">
          {lang === 'kk' ? 'ТАҢДАУ' : 'ВЫБОР ОБЪЕКТА'}
        </Badge>
        <h1 className="clean-hero-heading text-3xl">{text.title}</h1>
        <p className="clean-sub-heading mt-2">{text.subtitle}</p>

        <div className="clean-voice-hint-pill mt-4">
          <Mic size={13} className="text-zinc-300" />
          <span>{text.voiceHint}</span>
        </div>
      </div>

      {/* 3 Architectural Monolith Cards */}
      <div className="clean-variants-grid">
        {displayPlaces.map((place, idx) => (
          <Card
            key={place.id}
            hoverable
            onClick={() => onSelectPlace(place)}
            className="clean-variant-card"
          >
            {/* Roman Numeral */}
            <div className="clean-card-num-badge">
              <span>{romanNumbers[idx]}</span>
            </div>

            {/* Photo */}
            <div className="clean-card-thumb-wrap">
              <img
                src={place.thumb_url}
                alt={place.name}
                className="clean-card-thumb"
              />
              <span className="clean-card-category">{place.category}</span>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="clean-card-title">{place.name}</h3>
                <p className="clean-card-desc">{place.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono uppercase">
                <span className="text-zinc-400 flex items-center gap-1">
                  <MapPin size={11} className="text-zinc-500" />
                  ~{(idx + 1) * 350 + 400} М
                </span>
                <span className="text-white font-medium flex items-center gap-1">
                  ВЫБРАТЬ <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
