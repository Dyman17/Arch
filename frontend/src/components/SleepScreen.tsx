import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

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

  // Subtle gentle sea waves
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
      step += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      for (let j = 0; j < 2; j++) {
        ctx.beginPath();
        const opacity = 0.03 + j * 0.02;
        ctx.strokeStyle = `rgba(28, 28, 30, ${opacity})`;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < w; x += 30) {
          const y =
            h * 0.6 +
            Math.sin(x * 0.0015 + step + j * 1.5) * 20 +
            Math.cos(x * 0.0008 - step * 0.8) * 12;
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
    }
  );

  return (
    <div className="clean-sleep-screen" onClick={onWake}>
      <canvas ref={canvasRef} className="clean-sleep-canvas" />

      {/* Clean Top Bar */}
      <header className="clean-sleep-header">
        <span className="text-sm font-medium text-zinc-600">
          Ақтау · Каспий жағалауы
        </span>
        <div className="clean-sleep-weather">
          <span>+26°C</span>
          <span className="text-zinc-400">·</span>
          <span>Жел: 4 м/с</span>
        </div>
      </header>

      {/* Centerpiece */}
      <main className="clean-sleep-center">
        <div className="clean-brand-tag">
          <h1 className="clean-brand-logo">BaGdar</h1>
          <p className="clean-brand-sub">
            {lang === 'kk'
              ? 'Қала мен жағалаудың цифрлық гиді'
              : 'Интерактивный цифровой гид по городу'}
          </p>
        </div>

        {/* Calm Clock */}
        <div className="clean-sleep-clock">
          <div className="flex items-baseline justify-center">
            <span className="clean-clock-main">{timeString}</span>
            <span className="clean-clock-seconds">:{secondsString}</span>
          </div>
          <p className="clean-clock-date">{dateString}</p>
        </div>

        {/* Approach Callout */}
        <motion.div
          whileHover={{ y: -2 }}
          className="clean-approach-pill"
        >
          <div className="clean-approach-icon">
            <MessageCircle size={20} className="text-zinc-700" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-zinc-900">
              {lang === 'kk'
                ? 'Сұрағыңызды дауыстап айтыңыз немесе экранды түртіңіз'
                : 'Спросите голосом или коснитесь экрана'}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="clean-mini-chip">«Скальная тропа»</span>
              <span className="clean-mini-chip">«Маяк»</span>
              <span className="clean-mini-chip">«Где погулять?»</span>
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
            <span>Разбудить стелу</span>
          </button>
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="clean-sleep-footer">
        <span className="text-xs text-zinc-400">
          15-шағынаудан · Амфитеатр
        </span>
        <span className="text-xs text-zinc-400">
          Қазақша · Русский · English
        </span>
      </footer>
    </div>
  );
};
