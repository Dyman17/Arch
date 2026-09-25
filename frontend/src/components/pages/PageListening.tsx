import React from 'react';
import { motion } from 'motion/react';
import { Mic, ArrowLeft, Sparkles } from 'lucide-react';
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
            icon={<ArrowLeft size={15} />}
          >
            {lang === 'kk' ? 'Артқа' : 'Назад'}
          </Button>
        ) : (
          <div />
        )}

        <Badge variant="accent" dot>
          {lang === 'kk' ? 'Тыңдап тұрмын...' : lang === 'en' ? 'Listening...' : 'Слушаю вас...'}
        </Badge>
      </div>

      {/* Main Voice Centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="clean-listening-box"
      >
        <div className="clean-mic-circle">
          <Mic size={36} className="text-sky-400" />
        </div>

        {/* Clean Voice Waveform */}
        <div className="my-6">
          <VoiceWave active={true} bars={28} />
        </div>

        {/* Live Speech Caption Box */}
        <div className="clean-caption-card">
          <span className="clean-caption-label">
            {userSpokenText
              ? (lang === 'kk' ? 'Сіз айттыңыз:' : 'Вы говорите:')
              : (lang === 'kk' ? 'Сөйлеңіз:' : 'Говорите вслух:')}
          </span>
          <p className={`clean-caption-text ${userSpokenText ? 'active' : 'placeholder'}`}>
            {userSpokenText ? `«${userSpokenText}»` : '«Как пройти к морю?» • «Где погулять?»'}
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="clean-suggestions-block mt-8">
          <div className="clean-suggestions-title">
            <Sparkles size={13} className="text-zinc-400" />
            <span>{lang === 'kk' ? 'Сұрақ үлгілері:' : 'Примеры вопросов:'}</span>
          </div>

          <div className="clean-chips-wrap">
            {sampleChips.map((chip, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSimulateUtterance(chip)}
                className="clean-prompt-chip"
              >
                <span>«{chip}»</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
