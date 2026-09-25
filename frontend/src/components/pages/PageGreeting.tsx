import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mic } from 'lucide-react';
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
    }, 4200);
    return () => clearTimeout(timer);
  }, [onProceedToListening]);

  const greetings: Record<string, { welcome: string; title: string; subtitle: string; hint: string }> = {
    kk: {
      welcome: 'КАСПИЙ ЖАҒАЛАУЫ · АҚТАУ',
      title: 'Қош келдіңіз',
      subtitle: 'BaGdar — Маңғыстау мен қаланың архитектуралық сандық гиді',
      hint: 'Қай орынды көрсету керек? Сұрағыңызды дауыстап айтыңыз',
    },
    ru: {
      welcome: 'ПОБЕРЕЖЬЕ КАСПИЯ · АКТАУ',
      title: 'Добро пожаловать',
      subtitle: 'BaGdar — цифровой архитектурный путеводитель по городу и побережью',
      hint: 'Какое место вас интересует? Просто задайте вопрос вслух',
    },
    en: {
      welcome: 'CASPIAN SHORELINE · AKTAU',
      title: 'Welcome',
      subtitle: 'BaGdar — digital architectural guide to Aktau and Mangystau',
      hint: 'Where would you like to explore? Feel free to speak aloud',
    },
  };

  const text = greetings[lang] || greetings.ru;

  return (
    <div className="clean-page-root flex-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="clean-greeting-card"
      >
        <div className="flex-center mb-6">
          <Badge variant="accent">
            {text.welcome}
          </Badge>
        </div>

        {/* Monolithic Voice Resonator */}
        <div className="clean-voice-orb-wrapper">
          <motion.div
            className="clean-voice-orb-pulse"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="clean-voice-orb-core">
            <Mic size={28} className="text-stone-200" />
          </div>
        </div>

        <h1 className="clean-hero-heading mt-6">{text.title}</h1>
        <p className="clean-sub-heading mt-3">{text.subtitle}</p>

        {/* Clean Prompt Slab */}
        <div className="clean-prompt-pill mt-6">
          <span className="font-mono text-xs text-stone-400">✦</span>
          <span>{text.hint}</span>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onProceedToListening}
            icon={<ArrowRight size={15} />}
          >
            {lang === 'kk' ? 'Дауыспен сұрау' : lang === 'en' ? 'Start speaking' : 'Спросить голосом'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
