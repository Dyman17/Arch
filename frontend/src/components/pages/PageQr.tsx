import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import type { Place, QrResponse } from '../../types';
import { Button } from '../ui/Button';
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
  )}&bgcolor=FFFFFF&color=1C1C1E&margin=1`;

  const progressPercent = (secondsLeft / 60) * 100;

  return (
    <div className="clean-page-root flex-center flex-col p-8">
      {/* Top Header */}
      <div className="clean-page-header">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToRoute}
          icon={<ArrowLeft size={15} />}
        >
          К карте маршрута
        </Button>

        <span className="text-sm font-medium text-zinc-600">
          Синхронизация
        </span>
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

        {/* Right: Destination info */}
        <div className="clean-qr-info">
          <div>
            <h2 className="clean-qr-title">{place.name}</h2>
            <p className="clean-qr-summary">{place.summary}</p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-3">
            <Smartphone size={24} className="text-zinc-600 shrink-0" />
            <div className="text-xs text-zinc-600 leading-relaxed">
              Маршрут откроется в браузере вашего телефона без установки приложений.
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
              <span>Автозакрытие</span>
              <span>{secondsLeft} с</span>
            </div>
            <Progress value={progressPercent} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
