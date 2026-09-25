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
      code: 'I',
      name: 'Большой палец вверх (👍)',
      meaning: '«Да, показать подробнее»',
      icon: ThumbsUp,
    },
    {
      id: 'gesture-palm',
      code: 'II',
      name: 'Открытая ладонь (✋)',
      meaning: '«Стоп / Вернуться назад»',
      icon: Hand,
    },
    {
      id: 'gesture-one',
      code: 'III',
      name: 'Один палец (☝️)',
      meaning: '«Выбрать первое место»',
      icon: CheckCircle,
    },
    {
      id: 'gesture-two',
      code: 'IV',
      name: 'Два пальца (✌️)',
      meaning: '«Выбрать второе место»',
      icon: CheckCircle,
    },
    {
      id: 'gesture-route',
      code: 'V',
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
          icon={<ArrowLeft size={14} />}
        >
          Вернуться к голосу
        </Button>

        <Badge variant="accent">
          <Hand size={12} className="mr-1 inline text-zinc-300" />
          ЖЕСТОВОЕ УПРАВЛЕНИЕ
        </Badge>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full my-auto">
        {/* Exact Alert Requirement in Monumental Architectural Serif */}
        <div className="clean-gestures-alert mb-8">
          <div className="clean-gesture-alert-icon">
            <Hand size={24} className="text-stone-200" />
          </div>
          <div>
            <h1 className="clean-hero-heading text-2xl tracking-wide">
              Вы общаетесь жестами? Показывайте!
            </h1>
            <p className="clean-sub-heading mt-1 text-sm">
              Оптическая камера стелы распознает движения рук на расстоянии до 1.5 метров.
            </p>
          </div>
        </div>

        {/* 2-Column Monolith Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Camera Frame with Viewfinder Crosshairs */}
          <div className="clean-camera-view">
            <div className="clean-camera-inner">
              <Hand size={72} className="text-zinc-600 stroke-1 animate-pulse" />
            </div>
            <div className="clean-camera-status">
              <Camera size={12} className="text-zinc-400" />
              <span>Оптический сенсор активен · Держите руку перед экраном</span>
            </div>
          </div>

          {/* Gestures List */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-2">
              Реестр жестов:
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
                    <Icon size={16} className="text-stone-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-white uppercase">{g.name}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{g.meaning}</div>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">[{g.code}]</span>
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
