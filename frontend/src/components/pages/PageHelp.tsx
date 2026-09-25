import React from 'react';
import { HelpCircle, Mic, ArrowLeft, Navigation, History, QrCode } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
          icon={<ArrowLeft size={16} />}
        >
          {lang === 'kk' ? 'Артқа' : 'Назад'}
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="accent">
            <HelpCircle size={13} className="mr-1 inline text-sky-400" />
            Подсказки и команды
          </Badge>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kazakh */}
          <Card className="p-5 border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🇰🇿</span>
              <h3 className="font-semibold text-white text-sm">Қазақ тілінде</h3>
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="clean-help-pill">
                <Mic size={13} className="text-sky-400 shrink-0" />
                <span>«Жартасты соқпақ қайда?»</span>
              </div>
              <div className="clean-help-pill">
                <Navigation size={13} className="text-emerald-400 shrink-0" />
                <span>«Жақын маңда не бар?»</span>
              </div>
              <div className="clean-help-pill">
                <History size={13} className="text-amber-400 shrink-0" />
                <span>«Тарихын көрсетші»</span>
              </div>
              <div className="clean-help-pill">
                <QrCode size={13} className="text-purple-400 shrink-0" />
                <span>«Телефонға жібер»</span>
              </div>
            </div>
          </Card>

          {/* Russian */}
          <Card className="p-5 border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🇷🇺</span>
              <h3 className="font-semibold text-white text-sm">На русском</h3>
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="clean-help-pill">
                <Mic size={13} className="text-sky-400 shrink-0" />
                <span>«Как пройти к Скальной тропе?»</span>
              </div>
              <div className="clean-help-pill">
                <Navigation size={13} className="text-emerald-400 shrink-0" />
                <span>«Где маяк на крыше?»</span>
              </div>
              <div className="clean-help-pill">
                <History size={13} className="text-amber-400 shrink-0" />
                <span>«Покажи историю места»</span>
              </div>
              <div className="clean-help-pill">
                <QrCode size={13} className="text-purple-400 shrink-0" />
                <span>«Отправь на телефон»</span>
              </div>
            </div>
          </Card>

          {/* English */}
          <Card className="p-5 border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🇬🇧</span>
              <h3 className="font-semibold text-white text-sm">In English</h3>
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="clean-help-pill">
                <Mic size={13} className="text-sky-400 shrink-0" />
                <span>"Where is the Rock Trail?"</span>
              </div>
              <div className="clean-help-pill">
                <Navigation size={13} className="text-emerald-400 shrink-0" />
                <span>"What places are nearby?"</span>
              </div>
              <div className="clean-help-pill">
                <History size={13} className="text-amber-400 shrink-0" />
                <span>"Show historic photos"</span>
              </div>
              <div className="clean-help-pill">
                <QrCode size={13} className="text-purple-400 shrink-0" />
                <span>"Send route to mobile"</span>
              </div>
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
