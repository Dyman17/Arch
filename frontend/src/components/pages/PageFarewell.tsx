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
      title: 'Рахмет! Көріскенше!',
      subtitle: 'Ақтау қаласы мен Каспий жағалауында демалысыңыз жақсы өтсін!',
      blessing: 'Ақ жол! Сапарыңыз сәтті болсын!',
    },
    ru: {
      title: 'Приятной прогулки!',
      subtitle: 'Желаем отличного отдыха на побережье Каспия.',
      blessing: 'Ақ жол! Счастливого пути!',
    },
    en: {
      title: 'Enjoy your walk!',
      subtitle: 'Have a peaceful and pleasant day by the Caspian Sea.',
      blessing: 'Safe travels and warm memories!',
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
            <Compass size={28} className="text-zinc-700" />
          </div>
        </div>

        <h1 className="clean-hero-heading text-3xl">{text.title}</h1>
        <p className="clean-sub-heading mt-2">{text.subtitle}</p>

        <div className="clean-blessing-pill mt-6">
          <span>«{text.blessing}»</span>
        </div>

        <div className="mt-8 text-xs text-zinc-400">
          Стела переходит в режим ожидания через {countdown} сек...
        </div>
      </motion.div>
    </div>
  );
};
