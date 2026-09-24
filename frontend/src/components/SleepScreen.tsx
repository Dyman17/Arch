import React, { useEffect, useState, useRef } from 'react';
import { Wind, Compass, Sparkles, Camera, Eye } from 'lucide-react';

interface SleepScreenProps {
  onWake: () => void;
  lang: string;
  isPersonPresent?: boolean;
  cameraActive?: boolean;
  onSimulateApproach?: () => void;
}

export const SleepScreen: React.FC<SleepScreenProps> = ({
  onWake,
  lang,
  isPersonPresent = false,
  cameraActive = false,
  onSimulateApproach,
}) => {
  const [time, setTime] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clock updates every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Ambient generative waves on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      step += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        const opacity = 0.04 + j * 0.02;
        ctx.strokeStyle = `rgba(0, 168, 255, ${opacity})`;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < w; x += 10) {
          const y =
            h * 0.65 +
            Math.sin(x * 0.003 + step + j * 1.5) * 35 +
            Math.cos(x * 0.001 - step) * 25;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const timeString = time.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const secondsString = time.toLocaleTimeString('ru-RU', {
    second: '2-digit',
  });

  const dateString = time.toLocaleDateString(
    lang === 'kk' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <div className="sleep-screen-root" onClick={onWake}>
      {/* Background Interactive Ambient Canvas */}
      <canvas ref={canvasRef} className="sleep-ambient-canvas" />

      {/* Top Telemetry Header */}
      <header className="sleep-header">
        <div className="sleep-stele-tag">
          <span className="live-indicator-dot" />
          <span className="stele-code">AKTAU-EMB-01</span>
          <span className="stele-divider">/</span>
          <span className="stele-geo">15-ШАҒЫНАУДАН ЖАҒАЛАУЫ</span>
        </div>

        {/* Optical Sensor Telemetry */}
        <div className="sleep-camera-pill">
          <Camera size={13} className={cameraActive ? 'cam-live-icon' : 'cam-idle-icon'} />
          <span>
            {isPersonPresent
              ? (lang === 'kk' ? 'АДАМ АНЫҚТАЛДЫ' : lang === 'en' ? 'PERSON DETECTED' : 'ЧЕЛОВЕК В КАДРЕ')
              : (lang === 'kk' ? 'CV КАМЕРА: КҮЗЕТТЕ' : lang === 'en' ? 'CV SENSOR: WATCHING' : 'CV КАМЕРА: СКАНИРОВАНИЕ')}
          </span>
        </div>

        <div className="sleep-weather-widget">
          <div className="weather-item">
            <Wind size={14} className="weather-icon" />
            <span>Каспий самалы: 4.2 м/с СШ</span>
          </div>
          <div className="weather-divider" />
          <div className="weather-item">
            <span>Су: +21°C · Ауа: +26°C</span>
          </div>
        </div>
      </header>

      {/* Running Kinetic Marquee Ticker */}
      <div className="sleep-ticker-container">
        <div className="sleep-ticker-track">
          <span>BAĠDAR · SMART CASPIAN GUIDE · АҚТАУ МЕН МАҢҒЫСТАУ · COMPUTER VISION KIOSK · </span>
          <span>BAĠDAR · SMART CASPIAN GUIDE · АҚТАУ МЕН МАҢҒЫСТАУ · COMPUTER VISION KIOSK · </span>
        </div>
      </div>

      {/* Monumental Hero Centerpiece */}
      <main className="sleep-hero-center">
        <div className="sleep-brand-emblem">
          <span className="brand-super-label">INTERACTIVE URBAN STELE</span>
          <h1 className="sleep-monumental-title">BAĠDAR</h1>
          <p className="sleep-editorial-sub">
            {lang === 'kk'
              ? 'Каспий жағалауының цифрлық гиді'
              : lang === 'en'
              ? 'Digital Guide to the Caspian Coast & Mangystau'
              : 'Цифровой навигатор по побережью Каспия'}
          </p>
        </div>

        {/* Large Architectural Timepiece */}
        <div className="sleep-clock-block">
          <div className="clock-digits-group">
            <span className="clock-main-digits">{timeString}</span>
            <span className="clock-seconds-digits">{secondsString}</span>
          </div>
          <p className="clock-calendar-date">{dateString}</p>
        </div>

        {/* Optical Sensor Wake Callout (Camera Detection, not Sound) */}
        <div className="sleep-wake-sensory-orb">
          <div className="orb-soundwave-ring ring-1" />
          <div className="orb-soundwave-ring ring-2" />
          <div className="orb-soundwave-ring ring-3" />
          <div className="orb-core">
            <Eye size={24} className="orb-core-icon" />
          </div>

          <div className="orb-callout-text">
            <div className="callout-heading">
              <Sparkles size={14} className="spark-accent" />
              <span>
                {lang === 'kk'
                  ? 'Стелаға жақындаңыз (камера арқылы қосылады)'
                  : lang === 'en'
                  ? 'Step in front of the kiosk (camera auto-wakes)'
                  : 'Подойдите к стеле (камера разбудит экран)'}
              </span>
            </div>
            <p className="callout-hints">
              {lang === 'kk'
                ? 'Камера адамды көргенде стела оянып, сөйлесуді бастайды'
                : lang === 'en'
                ? 'Camera detects your approach, kiosk greets you and listens'
                : 'Камера обнаружит ваше появление, стела поздоровается и начнет диалог'}
            </p>
          </div>
        </div>

        {/* Quick simulator chip for test/demo without camera */}
        {onSimulateApproach && (
          <button
            className="sleep-simulate-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSimulateApproach();
            }}
          >
            <Camera size={13} />
            <span>{lang === 'kk' ? 'Демо: Адамның жақындауын тексеру' : 'Демо: Симуляция подхода человека к камере'}</span>
          </button>
        )}
      </main>

      {/* Bottom Telemetry Footer */}
      <footer className="sleep-footer">
        <div className="footer-kiosk-spec">
          <Compass size={14} className="spec-compass" />
          <span>Ориентация стелы: 45° NE (вдоль набережной 15 мкр)</span>
        </div>

        <div className="footer-tap-hint">
          <span>Сенсорлық емес экран · Тек камера мен дауыспен басқарылады</span>
        </div>

        <div className="footer-languages-tag">
          <span>ҚАЗАҚША · РУССКИЙ · ENGLISH</span>
        </div>
      </footer>
    </div>
  );
};
