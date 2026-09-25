import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mic, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
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
    }, 3800);
    return () => clearTimeout(timer);
  }, [onProceedToListening]);

  const greetings: Record<string, { welcome: string; title: string; subtitle: string; hint: string }> = {
    kk: {
      welcome: 'Каспий жағалауы · Ақтау',
      title: 'Қош келдіңіз!',
      subtitle: 'BaGdar — қала мен Маңғыстаудың интерактивті гиді',
      hint: 'Қай орынды көрсету керек? Сұрағыңызды дауыстап айтыңыз',
    },
    ru: {
      welcome: 'Побережье Каспия · Актау',
      title: 'Добро пожаловать!',
      subtitle: 'BaGdar — интерактивный путеводитель по городу и побережью',
      hint: 'Какое место вас интересует? Просто спросите меня голосом',
    },
    en: {
      welcome: 'Caspian Coast · Aktau',
      title: 'Welcome to Aktau!',
      subtitle: 'BaGdar — your interactive digital guide to the city',
      hint: 'Where would you like to explore? Feel free to ask with voice',
    },
  };

  const text = greetings[lang] || greetings.ru;

  return (
    <div className="clean-page-root flex-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="clean-greeting-card"
      >
        <div className="flex-center mb-6">
          <Badge variant="accent" dot>
            {text.welcome}
          </Badge>
        </div>

        {/* Minimalist Glowing Voice Orb */}
        <div className="clean-voice-orb-wrapper">
          <motion.div
            className="clean-voice-orb-pulse"
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="clean-voice-orb-core">
            <Mic size={32} className="text-white" />
          </div>
        </div>

        <h1 className="clean-hero-heading mt-6">{text.title}</h1>
        <p className="clean-sub-heading mt-2">{text.subtitle}</p>

        {/* Clean Prompt Pill */}
        <div className="clean-prompt-pill mt-6">
          <Sparkles size={15} className="text-sky-400 shrink-0" />
          <span>{text.hint}</span>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onProceedToListening}
            icon={<ArrowRight size={16} />}
          >
            {lang === 'kk' ? 'Дауыспен сұрау' : lang === 'en' ? 'Start speaking' : 'Спросить голосом'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
