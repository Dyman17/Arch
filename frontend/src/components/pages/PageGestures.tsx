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
    },
    {
      id: 'gesture-palm',
      name: 'Открытая ладонь (✋)',
      meaning: '«Стоп / Вернуться назад»',
      icon: Hand,
    },
    {
      id: 'gesture-one',
      name: 'Один палец (☝️)',
      meaning: '«Выбрать первое место»',
      icon: CheckCircle,
    },
    {
      id: 'gesture-two',
      name: 'Два пальца (✌️)',
      meaning: '«Выбрать второе место»',
      icon: CheckCircle,
    },
    {
      id: 'gesture-route',
      name: 'Жест пути (🤙)',
      meaning: '«Показать пеший маршрут»',
      icon: Navigation,
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
          icon={<ArrowLeft size={15} />}
        >
          Вернуться к голосу
        </Button>

        <span className="text-sm font-medium text-zinc-600">
          Жестовое управление
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full my-auto">
        {/* Exact Alert Requirement */}
        <div className="clean-gestures-alert mb-8">
          <div className="clean-gesture-alert-icon">
            <Hand size={24} className="text-zinc-700" />
          </div>
          <div>
            <h1 className="clean-hero-heading text-2xl">
              Вы общаетесь жестами? Показывайте!
            </h1>
            <p className="clean-sub-heading mt-1 text-sm">
              Камера стелы считывает движения рук. Покажите жест перед экраном.
            </p>
          </div>
        </div>

        {/* 2-Column Soft Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Camera Frame */}
          <div className="clean-camera-view">
            <div className="clean-camera-inner">
              <Hand size={72} className="text-zinc-300 stroke-1 animate-pulse" />
            </div>
            <div className="clean-camera-status">
              <Camera size={14} className="text-zinc-500" />
              <span>Камера активна · Держите руку перед экраном</span>
            </div>
          </div>

          {/* Gestures List */}
          <div className="space-y-2.5">
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
                    <Icon size={18} className="text-zinc-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-900">{g.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{g.meaning}</div>
                  </div>
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
