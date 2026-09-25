import React from 'react';
import { motion } from 'motion/react';
import { Loader2, MapPin, Footprints } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface PageThinkingProps {
  userSpokenText: string;
  lang: string;
}

export const PageThinking: React.FC<PageThinkingProps> = ({ userSpokenText, lang }) => {
  const statusTexts: Record<string, { main: string; sub: string }> = {
    kk: {
      main: 'Ыңғайлы жолды қарастырудамын...',
      sub: 'Ақтау мен жағалаудың бағыттарын тексеремін',
    },
    ru: {
      main: 'Подбираю лучший маршрут...',
      sub: 'Сверяю расстояние и время пешей прогулки',
    },
    en: {
      main: 'Finding the best route...',
      sub: 'Checking walking paths along the Caspian shoreline',
    },
  };

  const status = statusTexts[lang] || statusTexts.ru;

  return (
    <div className="clean-page-root flex-center flex-col p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="clean-thinking-card text-center"
      >
        {/* Sleek Minimal Spinner */}
        <div className="flex-center mb-6">
          <div className="clean-spinner-wrapper">
            <Loader2 size={40} className="text-sky-400 animate-spin" />
          </div>
        </div>

        {userSpokenText && (
          <div className="clean-query-bubble mb-5">
            <span className="clean-query-label">
              {lang === 'kk' ? 'Сұрағыңыз:' : 'Ваш запрос:'}
            </span>
            <p className="clean-query-text">«{userSpokenText}»</p>
          </div>
        )}

        <h2 className="clean-hero-heading text-2xl">{status.main}</h2>
        <p className="clean-sub-heading mt-2">{status.sub}</p>

        <div className="flex-center gap-3 mt-6">
          <Badge variant="neutral">
            <MapPin size={12} className="mr-1 inline text-sky-400" />
            Ақтау жағалауы
          </Badge>
          <Badge variant="neutral">
            <Footprints size={12} className="mr-1 inline text-emerald-400" />
            Пешком
          </Badge>
        </div>
      </motion.div>
    </div>
  );
};
