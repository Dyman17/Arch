import React from 'react';
import {
  Hand,
  CheckCircle,
  Navigation,
  ThumbsUp,
  ArrowLeft,
  Camera,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

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
      color: 'text-amber-400',
    },
    {
      id: 'gesture-palm',
      name: 'Открытая ладонь (✋)',
      meaning: '«Стоп / Вернуться назад»',
      icon: Hand,
      color: 'text-rose-400',
    },
    {
      id: 'gesture-one',
      name: 'Один палец (☝️)',
      meaning: '«Выбрать первое место»',
      icon: CheckCircle,
      color: 'text-sky-400',
    },
    {
      id: 'gesture-two',
      name: 'Два пальца (✌️)',
      meaning: '«Выбрать второе место»',
      icon: CheckCircle,
      color: 'text-emerald-400',
    },
    {
      id: 'gesture-route',
      name: 'Жест пути (🤙)',
      meaning: '«Показать пеший маршрут»',
      icon: Navigation,
      color: 'text-amber-300',
    },
  ];

  return (
    <div className="clean-page-root flex flex-col justify-between p-8">
      {/* Top Header */}
      <div className="clean-page-header">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReturnToVoice}
          icon={<ArrowLeft size={16} />}
        >
          Вернуться к голосу
        </Button>

        <Badge variant="accent">
          <Hand size={13} className="mr-1 inline text-sky-400" />
          Жестовое управление
        </Badge>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full my-auto">
        {/* Exact Alert Requirement */}
        <div className="clean-gestures-alert mb-8">
          <div className="clean-gesture-alert-icon">
            <Hand size={32} className="text-sky-400 animate-bounce" />
          </div>
          <div>
            <h1 className="clean-hero-heading text-2xl">Вы общаетесь жестами? Показывайте!</h1>
            <p className="clean-sub-heading mt-1 text-sm">
              Камера стелы считывает движения рук. Покажите жест на расстоянии 1 метра от экрана.
            </p>
          </div>
        </div>

        {/* 2-Column Clean Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Camera Frame */}
          <div className="clean-camera-view">
            <div className="clean-camera-inner">
              <Hand size={80} className="text-zinc-600 stroke-1 animate-pulse" />
            </div>
            <div className="clean-camera-status">
              <Camera size={13} className="text-emerald-400" />
              <span>Камера активна · Держите руку перед экраном</span>
            </div>
          </div>

          {/* Gestures List */}
          <div className="space-y-2.5">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider block mb-2">
              Доступные жесты:
            </span>

            {gestures.map((g) => {
              const Icon = g.icon;
              return (
                <Card
                  key={g.id}
                  hoverable
                  onClick={() => onSelectGesture(g.name)}
                  className="clean-gesture-row"
                >
                  <div className="clean-gesture-icon-wrap">
                    <Icon size={18} className={g.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{g.name}</div>
                    <div className="text-xs text-zinc-400">{g.meaning}</div>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">Выбрать</span>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div />
    </div>
  );
};
