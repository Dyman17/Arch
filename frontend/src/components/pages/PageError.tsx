import React from 'react';
import { motion } from 'motion/react';
import { Mic, RefreshCw, VolumeX } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface PageErrorProps {
  lang: string;
  onRetry: () => void;
  onShowHelp: () => void;
}

export const PageError: React.FC<PageErrorProps> = ({ lang, onRetry, onShowHelp }) => {
  const errorTexts: Record<string, { title: string; subtitle: string; retryBtn: string }> = {
    kk: {
      title: 'Сөзіңіз анық естілмеді',
      subtitle: 'Желдің немесе теңіз толқынының дыбысы кедергі келтірді. Сұрағыңызды қайталаңызшы.',
      retryBtn: 'Қайтадан айту',
    },
    ru: {
      title: 'Не совсем расслышал вас',
      subtitle: 'Шум морского ветра мог помешать. Пожалуйста, повторите вопрос или назовите место.',
      retryBtn: 'Повторить вопрос голосом',
    },
    en: {
      title: 'Could not catch that clearly',
      subtitle: 'The sea breeze might have interfered. Please speak again or name a destination.',
      retryBtn: 'Speak again',
    },
  };

  const text = errorTexts[lang] || errorTexts.ru;

  return (
    <div className="clean-page-root flex-center flex-col p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="clean-error-card text-center"
      >
        <div className="flex-center mb-5">
          <div className="clean-error-icon-box">
            <VolumeX size={34} className="text-zinc-400" />
          </div>
        </div>

        <Badge variant="warning" className="mb-3">
          {lang === 'kk' ? 'Дыбыс анықталмады' : 'Шум моря'}
        </Badge>

        <h1 className="clean-hero-heading text-2xl">{text.title}</h1>
        <p className="clean-sub-heading mt-2 max-w-md">{text.subtitle}</p>

        <div className="flex-center gap-3 mt-8">
          <Button
            variant="primary"
            size="lg"
            onClick={onRetry}
            icon={<Mic size={16} />}
          >
            {text.retryBtn}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onShowHelp}
            icon={<RefreshCw size={15} />}
          >
            {lang === 'kk' ? 'Көмек' : 'Примеры вопросов'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
