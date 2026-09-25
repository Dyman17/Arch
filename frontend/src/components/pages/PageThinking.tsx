import React from 'react';
import { motion } from 'motion/react';
import { Loader2, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface PageThinkingProps {
  userSpokenText: string;
  lang: string;
}

export const PageThinking: React.FC<PageThinkingProps> = ({ userSpokenText, lang }) => {
  const statusTexts: Record<string, { main: string; sub: string }> = {
    kk: {
      main: 'Бағыт есептелуде...',
      sub: 'Ақтау мен Каспий жағалауының жолдарын сәйкестендіруде',
    },
    ru: {
      main: 'Вычисление маршрута...',
      sub: 'Сверяю расстояние, рельеф и азимут движения',
    },
    en: {
      main: 'Computing path...',
      sub: 'Evaluating walking paths and bearing along the Caspian coast',
    },
  };

  const status = statusTexts[lang] || statusTexts.ru;

  return (
    <div className="clean-page-root flex-center flex-col p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="clean-thinking-card text-center"
      >
        {/* Monolithic Geometry Spinner */}
        <div className="flex-center mb-6">
          <div className="clean-spinner-wrapper">
            <Loader2 size={32} className="text-stone-300 animate-spin" />
          </div>
        </div>

        {userSpokenText && (
          <div className="clean-query-bubble mb-5">
            <span className="clean-query-label">
              {lang === 'kk' ? 'СҰРАҒЫҢЫЗ:' : 'ВАШ ЗАПРОС:'}
            </span>
            <p className="clean-query-text">«{userSpokenText}»</p>
          </div>
        )}

        <h2 className="clean-hero-heading text-2xl">{status.main}</h2>
        <p className="clean-sub-heading mt-2">{status.sub}</p>

        <div className="flex-center gap-3 mt-6">
          <Badge variant="neutral">
            <MapPin size={11} className="mr-1 inline text-zinc-400" />
            АКТАУ · КАСПИЙ
          </Badge>
          <Badge variant="neutral">
            43°39′N 51°09′E
          </Badge>
        </div>
      </motion.div>
    </div>
  );
};
