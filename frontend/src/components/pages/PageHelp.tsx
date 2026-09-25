import React from 'react';
import { ArrowLeft, Mic } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PageHelpProps {
  lang: string;
  onBack: () => void;
  onStartListening: () => void;
}

export const PageHelp: React.FC<PageHelpProps> = ({ lang, onBack, onStartListening }) => {
  return (
    <div className="clean-page-root flex flex-col justify-between p-8">
      {/* Top Header */}
      <div className="clean-page-header">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          icon={<ArrowLeft size={15} />}
        >
          {lang === 'kk' ? 'Артқа' : 'Назад'}
        </Button>

        <span className="text-sm font-medium text-zinc-600">
          Подсказки
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto w-full my-auto">
        <div className="text-center mb-8">
          <h1 className="clean-hero-heading text-3xl">Как общаться со стелой?</h1>
          <p className="clean-sub-heading mt-2">
            Стела понимает живую речь на казахском, русском и английском языках.
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Kazakh */}
          <Card className="p-6">
            <h3 className="font-serif text-zinc-900 text-lg mb-3">Қазақ тілінде</h3>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="clean-help-pill">«Жартасты соқпақ қайда?»</div>
              <div className="clean-help-pill">«Жақын маңда не бар?»</div>
              <div className="clean-help-pill">«Тарихын көрсетші»</div>
              <div className="clean-help-pill">«Телефонға жібер»</div>
            </div>
          </Card>

          {/* Russian */}
          <Card className="p-6">
            <h3 className="font-serif text-zinc-900 text-lg mb-3">На русском</h3>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="clean-help-pill">«Как пройти к Скальной тропе?»</div>
              <div className="clean-help-pill">«Где находится маяк?»</div>
              <div className="clean-help-pill">«Покажи историю места»</div>
              <div className="clean-help-pill">«Отправь на телефон»</div>
            </div>
          </Card>

          {/* English */}
          <Card className="p-6">
            <h3 className="font-serif text-zinc-900 text-lg mb-3">In English</h3>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="clean-help-pill">"Where is the Rock Trail?"</div>
              <div className="clean-help-pill">"What places are nearby?"</div>
              <div className="clean-help-pill">"Show historic photos"</div>
              <div className="clean-help-pill">"Send route to mobile"</div>
            </div>
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            variant="primary"
            size="lg"
            onClick={onStartListening}
            icon={<Mic size={16} />}
          >
            {lang === 'kk' ? 'Дауыспен бастау' : 'Начать голосовой диалог'}
          </Button>
        </div>
      </div>

      <div />
    </div>
  );
};
