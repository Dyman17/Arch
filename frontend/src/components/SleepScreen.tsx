import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Wind, MapPin, Eye } from 'lucide-react';
import { Badge } from './ui/Badge';

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

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Subtle architectural sea-depth oscillation in bone-ivory hairline
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
      step += 0.006;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      // Architectural horizon hairlines
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        const opacity = 0.04 + j * 0.03;
        ctx.strokeStyle = `rgba(18, 18, 20, ${opacity})`;
        ctx.lineWidth = 1;

        for (let x = 0; x < w; x += 24) {
          const y =
            h * 0.58 +
            Math.sin(x * 0.0018 + step + j * 1.8) * 22 +
            Math.cos(x * 0.0008 - step * 0.8) * 14;
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
    <div className="clean-sleep-screen" onClick={onWake}>
      <canvas ref={canvasRef} className="clean-sleep-canvas" />

      {/* Top Monumental Header */}
      <header className="clean-sleep-header">
        <div className="flex items-center gap-2">
          <Badge variant="neutral">
            <MapPin size={11} className="mr-1 inline text-zinc-400" />
            43°39′11″ N · 51°09′00″ E · АҚТАУ
          </Badge>
        </div>

        <div className="clean-sleep-weather">
          <Wind size={13} className="text-zinc-400" />
          <span>САМАЛ: 4 М/С</span>
          <span className="text-zinc-700">·</span>
          <span>АУА: +26°C</span>
          <span className="text-zinc-700">·</span>
          <span>КАСПИЙ: +21°C</span>
        </div>
      </header>

      {/* Monumental Architectural Center */}
      <main className="clean-sleep-center">
        <div className="clean-brand-tag">
          <span className="clean-brand-super">ARCHIVUM MANĠYSTAÝ · CASPIUM</span>
          <h1 className="clean-brand-logo">BAĠDAR</h1>
          <p className="clean-brand-sub">
            {lang === 'kk'
              ? 'Ақтау мен Маңғыстау түбегінің цифрлық стеласы'
              : 'Интерактивная стела города Актау и побережья Каспия'}
          </p>
        </div>

        {/* Monumental Clock */}
        <div className="clean-sleep-clock">
          <div className="flex items-baseline justify-center">
            <span className="clean-clock-main">{timeString}</span>
            <span className="clean-clock-seconds">:{secondsString}</span>
          </div>
          <p className="clean-clock-date">{dateString}</p>
        </div>

        {/* Approach Callout Monolith */}
        <motion.div
          whileHover={{ y: -2 }}
          className="clean-approach-pill"
        >
          <div className="clean-approach-icon">
            <Eye size={18} className="text-zinc-600" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
              <span>
                {lang === 'kk'
                  ? 'Стелаға жақындаңыз немесе экранды түртіңіз'
                  : 'Подойдите к стеле или коснитесь экрана'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="clean-mini-chip">«Скальная тропа»</span>
              <span className="clean-mini-chip">«Маяк»</span>
              <span className="clean-mini-chip">«Маршрут»</span>
            </div>
          </div>
        </motion.div>

        {onSimulateApproach && (
          <button
            className="clean-approach-sim-btn mt-6"
            onClick={(e) => {
              e.stopPropagation();
              onSimulateApproach();
            }}
          >
            <span>[ Нажмите для пробуждения стелы ]</span>
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="clean-sleep-footer">
        <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase">
          15-шағынаудан · Амфитеатр жағалауы
        </span>
        <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase">
          Оптикалық камера &amp; Дауыс датчигі
        </span>
        <span className="text-zinc-500 text-xs font-mono tracking-widest">
          ҚАЗ · РУС · ENG
        </span>
      </footer>
    </div>
  );
};
