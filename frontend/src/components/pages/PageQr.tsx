import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Timer, ArrowLeft, Smartphone, Check } from 'lucide-react';
import type { Place, QrResponse } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

interface PageQrProps {
  place: Place;
  qrData: QrResponse | null;
  onBackToRoute: () => void;
  onBackToPlace: () => void;
}

export const PageQr: React.FC<PageQrProps> = ({
  place,
  qrData,
  onBackToRoute,
  onBackToPlace,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(60);

  useEffect(() => {
    setSecondsLeft(60);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onBackToPlace();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onBackToPlace]);

  const qrUrl =
    qrData?.url ||
    `https://bagdar.kz/route/${place.id}?origin=amphitheater&lat=${place.lat}&lng=${place.lng}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    qrUrl
  )}&bgcolor=FFFFFF&color=030304&margin=1`;

  const progressPercent = (secondsLeft / 60) * 100;

  return (
    <div className="clean-page-root flex-center flex-col p-8">
      {/* Top Header */}
      <div className="clean-page-header">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToRoute}
          icon={<ArrowLeft size={14} />}
        >
          К карте маршрута
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="accent">
            <Smartphone size={12} className="mr-1 inline text-zinc-300" />
            СИНХРОНИЗАЦИЯ С ТЕЛЕФОНОМ
          </Badge>
          <Badge variant="neutral">
            <Timer size={12} className="mr-1 inline text-zinc-400" />
            ТАЙМЕР: {secondsLeft} СЕК
          </Badge>
        </div>
      </div>

      {/* Main QR Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="clean-qr-card"
      >
        {/* Left: QR Code in crisp frame */}
        <div className="clean-qr-image-box">
          <img
            src={qrImageUrl}
            alt={`QR код для ${place.name}`}
            className="clean-qr-img"
          />
          <span className="clean-qr-caption">Наведите камеру смартфона</span>
        </div>

        {/* Right: Instructions & Destination */}
        <div className="clean-qr-info">
          <div>
            <Badge variant="neutral" className="mb-2">
              ТОЧКА НАЗНАЧЕНИЯ
            </Badge>
            <h2 className="clean-qr-title">{place.name}</h2>
            <p className="clean-qr-summary">{place.summary}</p>
          </div>

          <div className="clean-qr-steps">
            <div className="clean-qr-step">
              <span className="clean-step-dot">I</span>
              <p>Откройте штатную камеру на смартфоне</p>
            </div>
            <div className="clean-qr-step">
              <span className="clean-step-dot">II</span>
              <p>Наведите объектив на QR-код на экране</p>
            </div>
            <div className="clean-qr-step">
              <span className="clean-step-dot">
                <Check size={11} />
              </span>
              <p>Маршрут откроется в браузере телефона без установки приложений</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-mono text-zinc-500 mb-1.5 uppercase">
              <span>Автозакрытие сессии</span>
              <span>{secondsLeft} с</span>
            </div>
            <Progress value={progressPercent} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
