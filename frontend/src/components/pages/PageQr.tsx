import React, { useEffect, useState } from 'react';
import {
  Timer,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';
import type { Place, QrResponse } from '../../types';

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

  // 60-second countdown timer
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

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(
    qrUrl
  )}&bgcolor=FFFFFF&color=1E293B&margin=1`;

  const progressPercent = (secondsLeft / 60) * 100;

  return (
    <div className="page-stage page-qr">
      <div className="qr-warm-backdrop" />

      {/* Top Header */}
      <div className="qr-top-bar">
        <button className="friendly-back-btn" onClick={onBackToRoute}>
          <ArrowLeft size={16} />
          <span>К карте маршрута</span>
        </button>

        <div className="qr-header-badge">
          <Smartphone size={15} className="text-amber-300" />
          <span>Маршрут с собой на телефон</span>
        </div>

        {/* Timer */}
        <div className="qr-timer-badge">
          <Timer size={14} className="text-amber-300" />
          <span>{secondsLeft} сек</span>
        </div>
      </div>

      {/* Main QR Presentation Stage */}
      <div className="qr-center-container">
        <div className="qr-friendly-card">
          {/* Left Side: Clean Crisp QR Code */}
          <div className="qr-box-frame">
            <div className="qr-image-wrapper">
              <img
                src={qrImageUrl}
                alt={`QR код для ${place.name}`}
                className="qr-image"
              />
            </div>
            <p className="qr-box-hint">Наведите камеру смартфона</p>
          </div>

          {/* Right Side: Simple Tourist Steps */}
          <div className="qr-info-frame">
            <div className="qr-destination-header">
              <span className="qr-dest-tag">Место назначения:</span>
              <h2 className="qr-dest-title">{place.name}</h2>
              <p className="qr-dest-summary">{place.summary}</p>
            </div>

            <div className="qr-friendly-steps">
              <div className="friendly-step">
                <span className="step-circle">1</span>
                <p>Откройте фотокамеру на вашем смартфоне</p>
              </div>
              <div className="friendly-step">
                <span className="step-circle">2</span>
                <p>Направьте на QR-код с расстояния 1–2 метров</p>
              </div>
              <div className="friendly-step">
                <span className="step-circle">3</span>
                <p>Маршрут и подсказки откроются в браузере телефона</p>
              </div>
            </div>

            {/* Bottom Progress */}
            <div className="qr-timer-progress-block">
              <div className="progress-labels">
                <span>Экран закроется через {secondsLeft} сек</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
