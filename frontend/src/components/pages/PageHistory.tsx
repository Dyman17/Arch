import React, { useState } from 'react';
import { History, ArrowLeft, Navigation, QrCode, BookOpen } from 'lucide-react';
import type { Place, SceneResponse } from '../../types';

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
    title: 'Тогда и сейчас — Архивы Актау',
    body: 'В 1968 году город Шевченко (ныне Актау) закладывался на пустынном берегу Каспия. Уникальная архитектура белого ракушечника и каскадные спуски к морю стали визитной карточкой города нефтяников и первопроходцев.',
  };

  const modernUrl = scene?.modern_url || place.thumb_url;
  const historicUrl =
    scene?.historic_url ||
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80';

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="page-stage page-history">
      {/* Top Header */}
      <div className="history-top-bar">
        <button className="history-back-btn" onClick={onBackToPlace}>
          <ArrowLeft size={18} />
          <span>К карточке места</span>
        </button>

        <div className="history-title-badge">
          <History size={16} className="text-amber-400" />
          <span>TARIHSKY • ИСТОРИЧЕСКИЙ РЕЖИМ • {place.name.toUpperCase()}</span>
        </div>

        <div className="history-year-pills">
          <span className="year-pill past">1968 г. ШЕВЧЕНКО</span>
          <span className="year-separator">⟷</span>
          <span className="year-pill present">2026 г. АҚТАУ</span>
        </div>
      </div>

      {/* Split Comparison Viewport */}
      <div className="history-split-stage">
        {/* Modern Image (Background) */}
        <div className="split-layer modern-layer">
          <img src={modernUrl} alt="Современный вид" className="split-img" />
          <div className="split-label modern-tag">2026: СОВРЕМЕННЫЙ ВИД</div>
        </div>

        {/* Historic Image (Clipped Overlay) */}
        <div
          className="split-layer historic-layer"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img src={historicUrl} alt="Исторический архив" className="split-img sepia-toned" />
          <div className="split-label historic-tag">1968: АРХИВ ШЕВЧЕНКО</div>
        </div>

        {/* Vertical Divider Line & Handle */}
        <div className="split-divider-line" style={{ left: `${sliderPos}%` }}>
          <div className="split-divider-handle">
            <span className="handle-arrow">◀</span>
            <span className="handle-dot" />
            <span className="handle-arrow">▶</span>
          </div>
        </div>

        {/* Invisible Range Input for Dragging */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={handleSliderChange}
          className="split-range-input"
          aria-label="Сравнение исторического и современного вида"
        />
      </div>

      {/* Bottom Historical Information Card */}
      <div className="history-bottom-card">
        <div className="history-card-header">
          <BookOpen size={20} className="text-amber-400" />
          <h3 className="history-card-title">{texts.title}</h3>
          <span className="history-archive-attribution">
            {scene?.attribution || 'Архивные фотохроники Мангистауского областного музея'}
          </span>
        </div>

        <p className="history-card-body">{texts.body}</p>

        {/* Navigation Handover */}
        <div className="history-actions-row">
          <button className="history-action-btn" onClick={onGoToRoute}>
            <Navigation size={18} />
            <span>«Как пройти туда сейчас?»</span>
          </button>
          <button className="history-action-btn" onClick={onGoToQr}>
            <QrCode size={18} />
            <span>«Отправь на телефон»</span>
          </button>
        </div>
      </div>
    </div>
  );
};
