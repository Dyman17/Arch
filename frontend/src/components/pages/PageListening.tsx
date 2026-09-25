import React from 'react';
import { motion } from 'motion/react';
import { Mic, ArrowLeft } from 'lucide-react';
import { VoiceWave } from '../ui/VoiceWave';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface PageListeningProps {
  lang: string;
  userSpokenText: string;
  audioDbLevel?: number;
  onSimulateUtterance: (text: string) => void;
  onCancel?: () => void;
}

export const PageListening: React.FC<PageListeningProps> = ({
  lang,
  userSpokenText,
  onSimulateUtterance,
  onCancel,
}) => {
  const quickPrompts: Record<string, string[]> = {
    kk: [
      'Жартасты соқпақ қайда?',
      'Маякты көрсетші',
      'Жақын маңда не бар?',
      'Телефонға жібер',
    ],
    ru: [
      'Как пройти к Скальной тропе?',
      'Где находится маяк?',
      'Что интересного есть рядом?',
      'Отправь маршрут на телефон',
    ],
    en: [
      'How to get to the Rock Trail?',
      'Where is the Lighthouse?',
      'What places are nearby?',
      'Send route to my phone',
    ],
  };

  const sampleChips = quickPrompts[lang] || quickPrompts.ru;

  return (
    <div className="clean-page-root flex-center flex-col p-8">
      {/* Top Header */}
      <div className="clean-page-header">
        {onCancel ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            icon={<ArrowLeft size={14} />}
          >
            {lang === 'kk' ? 'Артқа' : 'Назад'}
          </Button>
        ) : (
          <div />
        )}

        <Badge variant="accent">
          <span className="w-1.5 h-1.5 bg-stone-300 inline-block mr-1.5" />
          {lang === 'kk' ? 'Тыңдап тұрмын...' : lang === 'en' ? 'Listening...' : 'Слушаю вас...'}
        </Badge>
      </div>

      {/* Main Voice Centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="clean-listening-box"
      >
        <div className="clean-mic-circle">
          <Mic size={32} className="text-stone-200" />
        </div>

        {/* Razor Acoustic Waveform */}
        <div className="my-6">
          <VoiceWave active={true} bars={32} />
        </div>

        {/* Live Speech Caption Box */}
        <div className="clean-caption-card">
          <span className="clean-caption-label">
            {userSpokenText
              ? (lang === 'kk' ? 'СІЗ АЙТТЫҢЫЗ:' : 'ВЫ ГОВОРИТЕ:')
              : (lang === 'kk' ? 'СӨЙЛЕҢІЗ:' : 'ГОВОРИТЕ ВСЛУХ:')}
          </span>
          <p className={`clean-caption-text ${userSpokenText ? 'active' : 'placeholder'}`}>
            {userSpokenText ? `«${userSpokenText}»` : '«Как пройти к Скальной тропе?» · «Где погулять?»'}
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="clean-suggestions-block mt-8">
          <div className="clean-suggestions-title">
            <span>{lang === 'kk' ? 'СҰРАҚ ҮЛГІЛЕРІ:' : 'ПРИМЕРЫ ВОПРОСОВ:'}</span>
          </div>

          <div className="clean-chips-wrap">
            {sampleChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSimulateUtterance(chip)}
                className="clean-prompt-chip"
              >
                <span>[ {chip} ]</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
