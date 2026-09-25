import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Wind, MessageCircle, MapPin, Sparkles } from 'lucide-react';
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

  // Subtle clean ambient wave line
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
      step += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      for (let j = 0; j < 2; j++) {
        ctx.beginPath();
        const opacity = 0.04 + j * 0.03;
        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < w; x += 16) {
          const y =
            h * 0.6 +
            Math.sin(x * 0.002 + step + j * 1.5) * 25 +
            Math.cos(x * 0.001 - step) * 15;
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

      {/* Top Bar */}
      <header className="clean-sleep-header">
        <div className="flex items-center gap-2">
          <Badge variant="accent" dot>
            <MapPin size={12} className="mr-1 inline text-sky-400" />
            Ақтау · 15-ш/а жағалауы
          </Badge>
        </div>

        <div className="clean-sleep-weather">
          <Wind size={14} className="text-sky-400" />
          <span>Каспий самалы: 4 м/с</span>
          <span className="text-zinc-600">·</span>
          <span>Ауа: +26°C</span>
          <span className="text-zinc-600">·</span>
          <span>Теңіз: +21°C</span>
        </div>
      </header>

      {/* Monumental Clean Center */}
      <main className="clean-sleep-center">
        <div className="clean-brand-tag">
          <span className="clean-brand-super">SMART CASPIAN GUIDE</span>
          <h1 className="clean-brand-logo">BAĠDAR</h1>
          <p className="clean-brand-sub">
            {lang === 'kk'
              ? 'Ақтау мен Маңғыстаудың интерактивті бағдаршамы'
              : 'Интерактивный путеводитель по Актау и побережью Каспия'}
          </p>
        </div>

        {/* Clean Clock */}
        <div className="clean-sleep-clock">
          <div className="flex items-baseline justify-center gap-2">
            <span className="clean-clock-main">{timeString}</span>
            <span className="clean-clock-seconds">{secondsString}</span>
          </div>
          <p className="clean-clock-date">{dateString}</p>
        </div>

        {/* Approach Callout Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="clean-approach-pill"
        >
          <div className="clean-approach-icon">
            <MessageCircle size={20} className="text-sky-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-sky-400" />
              <span>
                {lang === 'kk'
                  ? 'Стелаға жақындап, сұрағыңызды қойыңыз'
                  : 'Подойдите к стеле и спросите голосом'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="clean-mini-chip">«Жартасты соқпақ»</span>
              <span className="clean-mini-chip">«Ақтау маягы»</span>
              <span className="clean-mini-chip">«Қайда тамақтануға болады?»</span>
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
            <Sparkles size={13} className="text-sky-400" />
            <span>Нажмите, чтобы разбудить стелу</span>
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="clean-sleep-footer">
        <span className="text-zinc-500 text-xs">
          15-шағынаудан · Амфитеатр жаны
        </span>
        <span className="text-zinc-500 text-xs">
          Дауыспен немесе қол қимылымен басқарылады
        </span>
        <span className="text-zinc-500 text-xs font-mono">
          ҚАЗАҚША · РУССКИЙ · ENGLISH
        </span>
      </footer>
    </div>
  );
};
