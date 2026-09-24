import React, { useEffect, useState } from 'react';
import { Sun } from 'lucide-react';

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
      title: 'Спасибо! Приятной прогулки!',
      subtitle: 'Желаем вам теплого дня на побережье Каспийского моря!',
      blessing: 'Ақ жол! Счастливого пути!',
    },
    en: {
      title: 'Thank you! Enjoy your day!',
      subtitle: 'Have a wonderful walk along the Caspian Sea in Aktau!',
      blessing: 'Safe travels and warm memories!',
    },
  };

  const text = farewellTexts[lang] || farewellTexts.ru;

  return (
    <div className="page-stage page-farewell">
      <div className="farewell-warm-backdrop" />

      <div className="farewell-content">
        <div className="farewell-icon-box">
          <Sun size={44} className="text-amber-300 animate-spin-slow" />
        </div>

        <h1 className="farewell-title">{text.title}</h1>
        <p className="farewell-subtitle">{text.subtitle}</p>
        <p className="farewell-blessing">«{text.blessing}»</p>

        <div className="farewell-timer-badge">
          <span>Стелла переходит в режим ожидания через {countdown} сек...</span>
        </div>
      </div>
    </div>
  );
};
