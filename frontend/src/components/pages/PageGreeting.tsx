import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mic } from 'lucide-react';
import { Button } from '../ui/Button';

interface PageGreetingProps {
  lang: string;
  onProceedToListening: () => void;
  kioskDistrict?: string;
}

export const PageGreeting: React.FC<PageGreetingProps> = ({
  lang,
  onProceedToListening,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onProceedToListening();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onProceedToListening]);

  const greetings: Record<string, { title: string; subtitle: string; hint: string }> = {
    kk: {
      title: 'Қош келдіңіз!',
      subtitle: 'Мен BaGdar цифрлық гидімін. Қай орынға барғыңыз келеді?',
      hint: 'Сұрағыңызды дауыстап айтыңыз',
    },
    ru: {
      title: 'Добро пожаловать в Актау!',
      subtitle: 'Я помогу найти интересные места и проложить удобный пеший маршрут.',
      hint: 'Задайте вопрос вслух или выберите опрос касанием',
    },
    en: {
      title: 'Welcome to Aktau!',
      subtitle: 'I can guide you through the best scenic walking paths and places.',
      hint: 'Ask a question aloud or select with touch',
    },
  };

  const text = greetings[lang] || greetings.ru;

  return (
    <div className="clean-page-root flex-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="clean-greeting-card"
      >
        {/* Soft Voice Resonator */}
        <div className="clean-voice-orb-wrapper">
          <motion.div
            className="clean-voice-orb-pulse"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="clean-voice-orb-core">
            <Mic size={28} className="text-zinc-700" />
          </div>
        </div>

        <h1 className="clean-hero-heading mt-6">{text.title}</h1>
        <p className="clean-sub-heading mt-3 max-w-md mx-auto">{text.subtitle}</p>

        {/* Clean Soft Prompt */}
        <div className="clean-prompt-pill mt-6">
          <span>{text.hint}</span>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onProceedToListening}
            icon={<ArrowRight size={15} />}
          >
            {lang === 'kk' ? 'Дауыспен бастау' : lang === 'en' ? 'Start speaking' : 'Спросить голосом'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
