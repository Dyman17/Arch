import React from 'react';
import {
  Hand,
  CheckCircle,
  Navigation,
  ThumbsUp,
  ArrowLeft,
  Scan,
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
      meaning: '«Да / Подтвердить выбор»',
      icon: ThumbsUp,
      color: 'text-emerald-400',
    },
    {
      id: 'gesture-palm',
      name: 'Открытая ладонь (✋)',
      meaning: '«Стоп / Отмена / Назад»',
      icon: Hand,
      color: 'text-rose-400',
    },
    {
      id: 'gesture-one',
      name: 'Один палец (☝️)',
      meaning: '«Выбрать 1-й вариант»',
      icon: CheckCircle,
      color: 'text-cyan-400',
    },
    {
      id: 'gesture-two',
      name: 'Два пальца (✌️)',
      meaning: '«Выбрать 2-й вариант»',
      icon: CheckCircle,
      color: 'text-amber-400',
    },
    {
      id: 'gesture-route',
      name: 'Жест Шаг / Путь (🤙)',
      meaning: '«Показать пеший маршрут»',
      icon: Navigation,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="page-stage page-gestures">
      {/* Background Cyber Laser Sweep */}
      <div className="gesture-scan-laser" />
      <div className="gesture-grid-backdrop" />

      {/* Top Header */}
      <div className="gestures-top-bar">
        <button className="gestures-back-btn" onClick={onReturnToVoice}>
          <ArrowLeft size={18} />
          <span>Вернуться к голосовому вводу</span>
        </button>

        <div className="gestures-badge">
          <Scan size={16} className="text-cyan-400 animate-pulse" />
          <span>СИСТЕМА ДОСТУПНОСТИ • РАСПОЗНАВАНИЕ ЯЗЫКА ЖЕСТОВ</span>
        </div>
      </div>

      <div className="gestures-container">
        {/* Strict User Required Alert Text */}
        <div className="gestures-alert-banner">
          <div className="alert-pulsing-icon">
            <Hand size={32} className="text-amber-400 animate-bounce" />
          </div>
          <div className="alert-text-block">
            <h1 className="alert-hero-title">Вы общаетесь жестами? Показывайте!</h1>
            <p className="alert-hero-sub">
              Камера стелы сканирует 21 точку кисти руки (MediaPipe Hands). Покажите жест перед камерой.
            </p>
          </div>
        </div>

        {/* Center Stage: Camera Scanner HUD + Gesture Dictionary */}
        <div className="gestures-split-cockpit">
          {/* Left: Camera Scanner HUD Frame */}
          <div className="gesture-camera-frame">
            <div className="camera-hud-overlay">
              {/* Corner crosshairs */}
              <div className="hud-corner top-left" />
              <div className="hud-corner top-right" />
              <div className="hud-corner bottom-left" />
              <div className="hud-corner bottom-right" />

              {/* Hand landmark simulation wireframe */}
              <div className="hud-hand-skeleton">
                <div className="hand-center-palm">
                  <Hand size={110} className="text-cyan-400 stroke-1 opacity-70 animate-pulse" />
                </div>
              </div>

              <div className="hud-status-line">
                <span className="hud-live-tag">● КАМЕРА АКТИВНА</span>
                <span className="hud-fps-tag">30 FPS • 21 КЛЮЧЕВАЯ ТОЧКА</span>
              </div>
            </div>
            <p className="camera-subhint">
              Держите руку на расстоянии 0.5–1.5 м перед экраном
            </p>
          </div>

          {/* Right: Recognized Gesture Quick Actions */}
          <div className="gesture-actions-panel">
            <h3 className="panel-title">Доступные жестовые команды:</h3>
            <div className="gestures-list">
              {gestures.map((g) => {
                const Icon = g.icon;
                return (
                  <button
                    key={g.id}
                    className="gesture-card-btn"
                    onClick={() => onSelectGesture(g.meaning)}
                  >
                    <div className="gesture-icon-frame">
                      <Icon size={24} className={g.color} />
                    </div>
                    <div className="gesture-text-frame">
                      <span className="gesture-title">{g.name}</span>
                      <span className="gesture-meaning">{g.meaning}</span>
                    </div>
                    <div className="gesture-click-tag">Имитировать</div>
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
