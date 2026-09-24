import React, { useEffect, useState, useRef } from 'react';
import { Wind, Compass, Sparkles, MessageCircle, MapPin } from 'lucide-react';

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
  onSimulateApproach,
}) => {
  const [time, setTime] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clock updates every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Ambient gentle sea waves on canvas
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
      step += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        const opacity = 0.035 + j * 0.02;
        ctx.strokeStyle = `rgba(227, 204, 169, ${opacity})`;
        ctx.lineWidth = 1.8;

        for (let x = 0; x < w; x += 12) {
          const y =
            h * 0.62 +
            Math.sin(x * 0.0025 + step + j * 1.6) * 32 +
            Math.cos(x * 0.001 - step) * 20;
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

      {/* Top Natural Header */}
      <header className="sleep-header">
        <div className="sleep-location-badge">
          <MapPin size={15} className="text-sand" />
          <span className="location-city">Ақтау</span>
          <span className="location-separator">·</span>
          <span className="location-spot">Каспий жағалауы (15-ш/а)</span>
        </div>

        <div className="sleep-weather-widget">
          <div className="weather-item">
            <Wind size={15} className="weather-icon" />
            <span>Каспий желі: 4 м/с</span>
          </div>
          <div className="weather-divider" />
          <div className="weather-item">
            <span>Ауа: +26°C · Теңіз суы: +21°C</span>
          </div>
        </div>
      </header>

      {/* Monumental Hero Centerpiece */}
      <main className="sleep-hero-center">
        <div className="sleep-brand-emblem">
          <span className="brand-super-label">
            {lang === 'kk'
              ? 'МАҢҒЫСТАУ САЯХАТЫ МЕН ҚАЛА БАҒДАРЫ'
              : lang === 'en'
              ? 'EXPLORE AKTAU & MANGYSTAU'
              : 'ПУТЕВОДИТЕЛЬ ПО АКТАУ И МАНГИСТАУ'}
          </span>
          <h1 className="sleep-monumental-title">BAĠDAR</h1>
          <p className="sleep-editorial-sub">
            {lang === 'kk'
              ? 'Каспий жағасындағы жайлы цифрлық серігіңіз'
              : lang === 'en'
              ? 'Your hospitable digital companion on the Caspian shore'
              : 'Ваш дружелюбный спутник на побережье Каспия'}
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

        {/* Hospitable Wake Callout */}
        <div className="sleep-wake-sensory-orb">
          <div className="orb-soundwave-ring ring-1" />
          <div className="orb-soundwave-ring ring-2" />
          <div className="orb-core">
            <MessageCircle size={22} className="orb-core-icon" />
          </div>

          <div className="orb-callout-text">
            <div className="callout-heading">
              <Sparkles size={15} className="spark-accent" />
              <span>
                {lang === 'kk'
                  ? 'Стелаға жақындап, сұрағыңызды қойыңыз'
                  : lang === 'en'
                  ? 'Approach the kiosk and ask anything'
                  : 'Подойдите к стеле и спросите голосom'}
              </span>
            </div>
            <div className="sleep-sample-prompts">
              <span className="sample-prompt-pill">«Жартасты соқпақ қайда?»</span>
              <span className="sample-prompt-pill">«Ақтау маягы»</span>
              <span className="sample-prompt-pill">«Қайда тамақтануға болады?»</span>
            </div>
          </div>
        </div>

        {/* Quick approach button for manual click/testing */}
        {onSimulateApproach && (
          <button
            className="sleep-simulate-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSimulateApproach();
            }}
          >
            <Sparkles size={13} />
            <span>{lang === 'kk' ? 'Сынақ: Жақындауды бастау' : 'Нажмите, чтобы подойти'}</span>
          </button>
        )}
      </main>

      {/* Bottom Humane Footer */}
      <footer className="sleep-footer">
        <div className="footer-kiosk-spec">
          <Compass size={15} className="spec-compass" />
          <span>Амфитеатр жанында орналасқан · Набережная 15-го микрорайона</span>
        </div>

        <div className="footer-tap-hint">
          <span>Дауыспен немесе қол қимылымен сөйлесуге болады</span>
        </div>

        <div className="footer-languages-tag">
          <span>ҚАЗАҚША · РУССКИЙ · ENGLISH</span>
        </div>
      </footer>
    </div>
  );
};
