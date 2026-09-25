import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface PageThinkingProps {
  userSpokenText: string;
  lang: string;
}

export const PageThinking: React.FC<PageThinkingProps> = ({ userSpokenText, lang }) => {
  const statusTexts: Record<string, { main: string; sub: string }> = {
    kk: {
      main: 'Бағытты дайындап жатырмын...',
      sub: 'Ақтау қаласы мен жағалаудың жолдарын тексеремін',
    },
    ru: {
      main: 'Подбираю лучший маршрут...',
      sub: 'Сверяю расстояние и удобный путь пешком',
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="clean-thinking-card text-center"
      >
        <div className="flex-center mb-6">
          <div className="clean-spinner-wrapper">
            <Loader2 size={28} className="text-zinc-700 animate-spin" />
          </div>
        </div>

        {userSpokenText && (
          <div className="clean-query-bubble mb-5">
            <p className="clean-query-text">«{userSpokenText}»</p>
          </div>
        )}

        <h2 className="clean-hero-heading text-2xl">{status.main}</h2>
        <p className="clean-sub-heading mt-2">{status.sub}</p>
      </motion.div>
    </div>
  );
};
