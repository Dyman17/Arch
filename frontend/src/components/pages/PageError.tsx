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
      title: 'Не удалось распознать речь',
      subtitle: 'Шум морского ветра мог заглушить голос. Пожалуйста, повторите вопрос или выберите объект касанием.',
      retryBtn: 'Повторить вопрос голосом',
    },
    en: {
      title: 'Could not recognize speech',
      subtitle: 'The Caspian wind noise may have interfered. Please repeat your query or select by touch.',
      retryBtn: 'Speak again',
    },
  };

  const text = errorTexts[lang] || errorTexts.ru;

  return (
    <div className="clean-page-root flex-center flex-col p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="clean-error-card text-center"
      >
        <div className="flex-center mb-5">
          <div className="clean-error-icon-box">
            <VolumeX size={30} className="text-stone-300" />
          </div>
        </div>

        <Badge variant="neutral" className="mb-3">
          {lang === 'kk' ? 'ДЫБЫС КЕДЕРГІСІ' : 'АКУСТИЧЕСКАЯ ПОМЕХА'}
        </Badge>

        <h1 className="clean-hero-heading text-2xl">{text.title}</h1>
        <p className="clean-sub-heading mt-2 max-w-md">{text.subtitle}</p>

        <div className="flex-center gap-3 mt-8">
          <Button
            variant="primary"
            size="lg"
            onClick={onRetry}
            icon={<Mic size={15} />}
          >
            {text.retryBtn}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onShowHelp}
            icon={<RefreshCw size={14} />}
          >
            {lang === 'kk' ? 'Көмек' : 'Подсказки'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
