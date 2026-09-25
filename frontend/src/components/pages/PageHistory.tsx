import React, { useState } from 'react';
import { motion } from 'motion/react';
import { History, ArrowLeft, Navigation, QrCode, BookOpen } from 'lucide-react';
import type { Place, SceneResponse } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

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
    title: 'Тогда и сейчас — Архивы Мангистау',
    body: 'В 1968 году город Шевченко (ныне Актау) закладывался на известняковом плато Каспия. Уникальная монументальная архитектура белого ракушечника и каскадные спуски к воде стали визитной карточкой города первопроходцев.',
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
          icon={<ArrowLeft size={14} />}
        >
          {lang === 'kk' ? 'Орынға қайту' : 'К описанию'}
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="accent">
            <History size={12} className="mr-1 inline text-zinc-300" />
            TARIHSKY · {place.name.toUpperCase()}
          </Badge>
          <Badge variant="neutral">
            1968 ШЕВЧЕНКО ⟷ 2026 АҚТАУ
          </Badge>
        </div>
      </div>

      {/* Split Comparison Viewport */}
      <div className="clean-split-stage">
        {/* Modern Image */}
        <div className="clean-split-layer">
          <img src={modernUrl} alt="2026" className="clean-split-img" />
          <div className="clean-split-badge right">2026 · ҚАЗІРГІ КӨРІНІС</div>
        </div>

        {/* Historic Image */}
        <div
          className="clean-split-layer historic"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img src={historicUrl} alt="1968" className="clean-split-img sepia-toned" />
          <div className="clean-split-badge left">1968 · МҰРАҒАТ ФОТОСЫ</div>
        </div>

        {/* Split Divider */}
        <div className="clean-split-divider" style={{ left: `${sliderPos}%` }}>
          <div className="clean-split-handle">
            <span>◇</span>
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
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={15} className="text-zinc-400" />
              <h3 className="font-serif text-lg text-white font-semibold">{texts.title}</h3>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed max-w-3xl">{texts.body}</p>
            <span className="text-zinc-500 font-mono text-xs block mt-2 uppercase tracking-wider">
              {scene?.attribution || 'Архивные фотохроники Мангистауского музея'}
            </span>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={onGoToRoute}
              icon={<Navigation size={15} />}
            >
              {lang === 'kk' ? 'Қазір бару' : 'Как пройти?'}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onGoToQr}
              icon={<QrCode size={15} />}
            >
              {lang === 'kk' ? 'QR' : 'QR на телефон'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
