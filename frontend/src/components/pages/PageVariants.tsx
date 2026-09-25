import React from 'react';
import { MapPin, ArrowRight, Mic, Sparkles } from 'lucide-react';
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
          <Sparkles size={12} className="mr-1 inline text-sky-400" />
          {lang === 'kk' ? 'Таңдау' : 'Выбор места'}
        </Badge>
        <h1 className="clean-hero-heading text-3xl">{text.title}</h1>
        <p className="clean-sub-heading mt-2">{text.subtitle}</p>

        <div className="clean-voice-hint-pill mt-4">
          <Mic size={14} className="text-sky-400 animate-pulse" />
          <span>{text.voiceHint}</span>
        </div>
      </div>

      {/* 3 Animate UI Cards */}
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
              <span className="clean-card-category">{place.category}</span>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="clean-card-title">{place.name}</h3>
                <p className="clean-card-desc">{place.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1">
                  <MapPin size={12} className="text-sky-400" />
                  ~{(idx + 1) * 350 + 400} м от стелы
                </span>
                <span className="text-sky-400 font-medium flex items-center gap-1">
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
