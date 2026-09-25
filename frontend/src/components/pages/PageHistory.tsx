import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Navigation, QrCode } from 'lucide-react';
import type { Place, SceneResponse } from '../../types';
import { Button } from '../ui/Button';

interface PageHistoryProps {
  place: Place;
  scene: SceneResponse | null;
  lang: string;
  onBackToPlace: () => void;
  onGoToRoute: () => void;
  onGoToQr: () => void;
}

export const PageHistory: React.FC<PageHistoryProps> = ({
  place,
  scene,
  lang,
  onBackToPlace,
  onGoToRoute,
  onGoToQr,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  const texts = scene?.texts?.[lang] || {
    title: 'История и современность',
    body: 'В 1968 году город Шевченко (ныне Актау) закладывался на побережье Каспия. Уникальная архитектура белого ракушечника и каскадные спуски к морю стали визитной карточкой города первопроходцев.',
  };

  const modernUrl = scene?.modern_url || place.thumb_url;
  const historicUrl =
    scene?.historic_url ||
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80';

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="clean-page-root flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="clean-history-top-bar">
        <Button
          variant="glass"
          size="sm"
          onClick={onBackToPlace}
          icon={<ArrowLeft size={15} />}
        >
          {lang === 'kk' ? 'Орынға қайту' : 'К описанию'}
        </Button>

        <span className="text-sm font-medium text-zinc-900">
          {place.name} · TarihSky
        </span>
      </div>

      {/* Split Comparison Viewport */}
      <div className="clean-split-stage">
        {/* Modern Image */}
        <div className="clean-split-layer">
          <img src={modernUrl} alt="2026" className="clean-split-img" />
          <div className="clean-split-badge right">Сегодня</div>
        </div>

        {/* Historic Image */}
        <div
          className="clean-split-layer historic"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img src={historicUrl} alt="1968" className="clean-split-img sepia-toned" />
          <div className="clean-split-badge left">1968 год</div>
        </div>

        {/* Split Divider */}
        <div className="clean-split-divider" style={{ left: `${sliderPos}%` }}>
          <div className="clean-split-handle">
            <span>◀ ▶</span>
          </div>
        </div>

        {/* Range slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={handleSliderChange}
          className="clean-split-range"
          aria-label="Сравнение исторического и современного вида"
        />
      </div>

      {/* Bottom Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="clean-history-bottom-card"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl text-zinc-900 font-semibold mb-1">{texts.title}</h3>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-3xl">{texts.body}</p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={onGoToRoute}
              icon={<Navigation size={15} />}
            >
              {lang === 'kk' ? 'Бару' : 'Как пройти?'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={onGoToQr}
              icon={<QrCode size={15} />}
            >
              {lang === 'kk' ? 'QR' : 'QR'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
