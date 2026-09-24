import React, { useEffect, useState } from 'react';
import {
  QrCode,
  Timer,
  ArrowLeft,
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

  // Generate fallback QR URL using SVG generator API or mock
  const qrUrl =
    qrData?.url ||
    `https://bagdar.kz/route/${place.id}?origin=AKTAU-EMB-01&lat=${place.lat}&lng=${place.lng}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(
    qrUrl
  )}&bgcolor=FFFFFF&color=090D16&margin=1`;

  const progressPercent = (secondsLeft / 60) * 100;

  return (
    <div className="page-stage page-qr">
      {/* Background Radiance */}
      <div className="qr-radiance-backdrop" />

      {/* Top Header */}
      <div className="qr-top-bar">
        <button className="qr-back-btn" onClick={onBackToRoute}>
          <ArrowLeft size={18} />
          <span>К маршруту</span>
        </button>

        <div className="qr-badge">
          <QrCode size={16} className="text-cyan-400" />
          <span>МОБИЛЬНАЯ НАВИГАЦИЯ • ПЕРЕДАЧА НА СМАРТФОН</span>
        </div>

        {/* 60s Timer */}
        <div className="qr-timer-pill">
          <Timer size={16} className="text-amber-400 animate-pulse" />
          <span>{secondsLeft} сек</span>
        </div>
      </div>

      {/* Main QR Presentation Stage */}
      <div className="qr-center-container">
        <div className="qr-card-hero">
          {/* Left Side: Massive Crisp QR Code */}
          <div className="qr-code-frame">
            <div className="qr-code-wrapper">
              <img
                src={qrImageUrl}
                alt={`QR код для ${place.name}`}
                className="qr-image"
              />
              <div className="qr-scanner-line" />
            </div>
            <div className="qr-code-caption">
              <span>СКАНИРУЙТЕ КАМЕРОЙ ТЕЛЕФОНА</span>
            </div>
          </div>

          {/* Right Side: Step-by-Step Instructions & Place Context */}
          <div className="qr-details-frame">
            <div className="qr-place-header">
              <span className="qr-place-tag">ТОЧКА НАЗНАЧЕНИЯ</span>
              <h2 className="qr-place-title">{place.name}</h2>
              <p className="qr-place-summary">{place.summary}</p>
            </div>

            <div className="qr-steps-list">
              <div className="qr-step">
                <div className="qr-step-num">1</div>
                <div className="qr-step-text">
                  <strong>Откройте камеру смартфона</strong>
                  <span>(или сканер QR в любом мессенджере)</span>
                </div>
              </div>

              <div className="qr-step">
                <div className="qr-step-num">2</div>
                <div className="qr-step-text">
                  <strong>Наведите объектив на QR-код</strong>
                  <span>Считывание происходит мгновенно с расстояния до 2 метров</span>
                </div>
              </div>

              <div className="qr-step">
                <div className="qr-step-num">3</div>
                <div className="qr-step-text">
                  <strong>Маршрут откроется в вашем телефоне</strong>
                  <span>Пеший азимут, пошаговая карта и аудиогид будут с вами</span>
                </div>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="qr-timeout-progress">
              <div className="progress-labels">
                <span>Автозакрытие через {secondsLeft} сек</span>
                <span>Сеанс защищён</span>
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
