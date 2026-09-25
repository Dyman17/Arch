import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';

interface PageFarewellProps {
  lang: string;
  onFinishFarewell: () => void;
}

export const PageFarewell: React.FC<PageFarewellProps> = ({ lang, onFinishFarewell }) => {
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinishFarewell();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinishFarewell]);

  const farewellTexts: Record<string, { title: string; subtitle: string; blessing: string }> = {
    kk: {
      title: 'Рахмет. Көріскенше.',
      subtitle: 'Маңғыстау мен Каспий жағалауында сапарыңыз сәтті өтсін.',
      blessing: 'Ақ жол! Сапарыңыз сәтті болсын!',
    },
    ru: {
      title: 'Счастливого пути',
      subtitle: 'Приятной прогулки по побережью Каспия и земле Мангистау.',
      blessing: 'Ақ жол! Счастливого пути!',
    },
    en: {
      title: 'Safe Travels',
      subtitle: 'Have a peaceful journey along the Caspian coast.',
      blessing: 'Aq zhol! May your voyage be blessed.',
    },
  };

  const text = farewellTexts[lang] || farewellTexts.ru;

  return (
    <div className="clean-page-root flex-center flex-col p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="clean-farewell-card text-center"
      >
        <div className="flex-center mb-5">
          <div className="clean-farewell-icon-box">
            <Compass size={32} className="text-stone-300" />
          </div>
        </div>

        <h1 className="clean-hero-heading text-3xl">{text.title}</h1>
        <p className="clean-sub-heading mt-2">{text.subtitle}</p>

        <div className="clean-blessing-pill mt-6">
          <span>«{text.blessing}»</span>
        </div>

        <div className="mt-8 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Режим ожидания через {countdown} сек...
        </div>
      </motion.div>
    </div>
  );
};
