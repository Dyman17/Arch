import React from 'react';
import {
  Hand,
  CheckCircle,
  Navigation,
  ThumbsUp,
  ArrowLeft,
  Camera,
} from 'lucide-react';

interface PageGesturesProps {
  onSelectGesture: (gestureName: string) => void;
  onReturnToVoice: () => void;
}

export const PageGestures: React.FC<PageGesturesProps> = ({
  onSelectGesture,
  onReturnToVoice,
}) => {
  const gestures = [
    {
      id: 'gesture-thumbs-up',
      name: 'Большой палец вверх (👍)',
      meaning: '«Да, показать подробнее»',
      icon: ThumbsUp,
      color: 'text-amber-300',
    },
    {
      id: 'gesture-palm',
      name: 'Открытая ладонь (✋)',
      meaning: '«Стоп / Вернуться назад»',
      icon: Hand,
      color: 'text-rose-300',
    },
    {
      id: 'gesture-one',
      name: 'Один палец (☝️)',
      meaning: '«Выбрать первое место»',
      icon: CheckCircle,
      color: 'text-cyan-300',
    },
    {
      id: 'gesture-two',
      name: 'Два пальца (✌️)',
      meaning: '«Выбрать второе место»',
      icon: CheckCircle,
      color: 'text-emerald-300',
    },
    {
      id: 'gesture-route',
      name: 'Жест пути (🤙)',
      meaning: '«Показать пеший маршрут»',
      icon: Navigation,
      color: 'text-amber-200',
    },
  ];

  return (
    <div className="page-stage page-gestures">
      {/* Warm Ambient Backdrop */}
      <div className="gestures-warm-backdrop" />

      {/* Top Header */}
      <div className="gestures-top-bar">
        <button className="friendly-back-btn" onClick={onReturnToVoice}>
          <ArrowLeft size={16} />
          <span>Вернуться к голосу</span>
        </button>

        <div className="gestures-header-badge">
          <Hand size={15} className="text-amber-300" />
          <span>Управление жестами рук</span>
        </div>
      </div>

      <div className="gestures-content-container">
        {/* User Required Alert Text: Exact specification */}
        <div className="gestures-alert-card">
          <div className="alert-hand-icon-wrap">
            <Hand size={36} className="text-amber-300 animate-bounce" />
          </div>
          <div className="alert-text-block">
            <h1 className="alert-hero-title">Вы общаетесь жестами? Показывайте!</h1>
            <p className="alert-hero-sub">
              Камера стелы считывает движения рук. Покажите нужный жест на расстоянии шага от экрана.
            </p>
          </div>
        </div>

        {/* Center Stage: Friendly Camera Frame + Gestures List */}
        <div className="gestures-friendly-layout">
          {/* Left: Clean Friendly Camera Box */}
          <div className="gesture-camera-box">
            <div className="camera-view-window">
              <div className="camera-soft-illustration">
                <Hand size={90} className="text-amber-200/50 stroke-1 animate-pulse" />
              </div>

              <div className="camera-bottom-badge">
                <Camera size={13} className="text-emerald-400" />
                <span>Камера активна • Держите руку перед экраном</span>
              </div>
            </div>
            <p className="camera-guide-text">
              Удобно на расстоянии 0.5 – 1.5 метра от стелы
            </p>
          </div>

          {/* Right: Gesture Cards */}
          <div className="gesture-options-panel">
            <h3 className="options-headline">Понятные жесты для управления:</h3>
            <div className="options-list">
              {gestures.map((g) => {
                const Icon = g.icon;
                return (
                  <button
                    key={g.id}
                    className="gesture-choice-btn"
                    onClick={() => onSelectGesture(g.meaning)}
                  >
                    <div className="choice-icon-wrap">
                      <Icon size={22} className={g.color} />
                    </div>
                    <div className="choice-text-wrap">
                      <span className="choice-title">{g.name}</span>
                      <span className="choice-meaning">{g.meaning}</span>
                    </div>
                    <span className="choice-tap-hint">Выбрать</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
