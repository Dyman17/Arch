import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navigation,
  History,
  QrCode,
  Footprints,
  Wind,
  MapPin,
  Mic,
  ArrowRight,
  Sparkles,
  Volume2,
  Clock,
  Compass,
  Check,
} from 'lucide-react';
import type { Place, RouteResponse, SceneResponse, QrResponse } from '../types';
import { fetchRoute, fetchScene, fetchQr } from '../api';
import { speakText, stopSpeaking } from '../utils/tts';
import { VoiceWave } from './ui/VoiceWave';

interface EmbankmentMasterScreenProps {
  places: Place[];
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  onVoicePrompt?: (text: string) => void;
}

export const EmbankmentMasterScreen: React.FC<EmbankmentMasterScreenProps> = ({
  places,
  currentLang,
  onLanguageChange,
  onVoicePrompt,
}) => {
  // Current active place on the embankment
  const [selectedPlaceId, setSelectedPlaceId] = useState<number>(() => places[0]?.id || 1);
  const activePlace: Place = places.find((p) => p.id === selectedPlaceId) || places[0] || {
    id: 1,
    name: 'Скальная тропа',
    category: 'walking',
    lat: 43.642,
    lng: 51.155,
    thumb_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    summary: 'Пешеходная освещенная тропа вдоль скального берега Каспия протяженностью 1.5 км.',
    has_scene: true,
    access: 'walk',
    hours: null,
  };

  // Local state for modals & sub-panels
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'route' | 'history' | 'qr'>('none');
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [sceneData, setSceneData] = useState<SceneResponse | null>(null);
  const [qrData, setQrData] = useState<QrResponse | null>(null);
  const [historySlider, setHistorySlider] = useState<number>(50);
  const [isListeningActive, setIsListeningActive] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');

  // Clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateStr = currentTime.toLocaleDateString(
    currentLang === 'kk' ? 'kk-KZ' : currentLang === 'en' ? 'en-US' : 'ru-RU',
    {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }
  );

  // Active place localized texts
  const localized = activePlace.texts?.[currentLang] || {
    name: activePlace.name,
    summary: activePlace.summary,
    description: activePlace.description || activePlace.summary,
    address: activePlace.address || 'Ақтау, 15-шағынаудан жағалауы',
  };

  // Load Route on demand
  const handleOpenRoute = async () => {
    try {
      const r = await fetchRoute(activePlace.id, currentLang);
      setRouteData(r);
      setActiveOverlay('route');
    } catch {
      setActiveOverlay('route');
    }
  };

  // Load Scene on demand
  const handleOpenHistory = async () => {
    try {
      const s = await fetchScene(activePlace.id);
      setSceneData(s);
      setActiveOverlay('history');
    } catch {
      setActiveOverlay('history');
    }
  };

  // Load QR on demand
  const handleOpenQr = async () => {
    try {
      const q = await fetchQr(activePlace.id, currentLang, 'sess-master');
      setQrData(q);
      setActiveOverlay('qr');
    } catch {
      setActiveOverlay('qr');
    }
  };

  // Voice simulation
  const handleTriggerVoice = (promptText?: string) => {
    if (promptText) {
      setSpeechTranscript(promptText);
      setIsListeningActive(false);
      onVoicePrompt?.(promptText);

      // Auto-match place
      const matched = places.find(
        (p) =>
          p.name.toLowerCase().includes(promptText.toLowerCase()) ||
          promptText.toLowerCase().includes(p.name.toLowerCase())
      );
      if (matched) {
        setSelectedPlaceId(matched.id);
      }
    } else {
      setIsListeningActive((prev) => !prev);
    }
  };

  // Speak place summary
  const handleSpeakSummary = () => {
    const textToSpeak = `${localized.name}. ${localized.summary}`;
    speakText(textToSpeak, currentLang);
  };

  return (
    <div className="embankment-screen-root">
      {/* 1. TOP STATUS BAR (Набережная Актау · Барометр Каспия · Время · Язык) */}
      <header className="embankment-header">
        <div className="embankment-brand-block">
          <span className="embankment-brand-name">BAĠDAR</span>
          <span className="embankment-brand-dot">·</span>
          <span className="embankment-brand-location">
            15-шағынаудан жағалауы · Амфитеатр
          </span>
        </div>

        {/* Caspian Marine Weather & Current Local Time */}
        <div className="embankment-marine-weather">
          <div className="weather-pill">
            <Wind size={14} className="text-stone-500" />
            <span>Каспий самалы: 4 м/с</span>
            <span className="divider">·</span>
            <span>Су: +21°C</span>
            <span className="divider">·</span>
            <span>Ауа: +26°C</span>
          </div>

          <div className="clock-pill">
            <Clock size={13} className="text-stone-500" />
            <span className="clock-time">{timeStr}</span>
            <span className="clock-date">{dateStr}</span>
          </div>
        </div>

        {/* Multilingual Switcher */}
        <div className="embankment-lang-selector" role="group" aria-label="Тіл таңдау / Выбор языка">
          {[
            { code: 'kk', label: 'ҚАЗ' },
            { code: 'ru', label: 'РУС' },
            { code: 'en', label: 'ENG' },
          ].map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onLanguageChange(l.code)}
              className={`lang-btn ${currentLang === l.code ? 'is-active' : ''}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      {/* 2. MAIN HORIZONTAL PROMENADE SLIDER (Лента ключевых объектов набережной) */}
      <nav className="embankment-places-strip" aria-label="Орындар тізімі">
        {places.slice(0, 6).map((p) => {
          const isSelected = p.id === activePlace.id;
          const pName = p.texts?.[currentLang]?.name || p.name;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                stopSpeaking();
                setSelectedPlaceId(p.id);
                setActiveOverlay('none');
              }}
              className={`strip-place-tab ${isSelected ? 'is-selected' : ''}`}
            >
              <span className="strip-tab-thumb-wrap">
                <img src={p.thumb_url} alt={pName} className="strip-tab-thumb" />
              </span>
              <span className="strip-tab-title">{pName}</span>
              {isSelected && (
                <motion.div
                  layoutId="active-strip-indicator"
                  className="strip-tab-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. CENTER HERO MONOGRAPH (Главный блок: Аутентичное фото, описание, расстояние, действия) */}
      <main className="embankment-hero-stage">
        <motion.div
          key={activePlace.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="embankment-monograph-card"
        >
          {/* Left Column: Authentic Photography of Embankment Landmark */}
          <div className="monograph-photo-column">
            <div className="monograph-photo-wrapper">
              <img
                src={activePlace.thumb_url}
                alt={localized.name}
                className="monograph-photo"
              />

              {/* Natural Coastal Badge */}
              <div className="monograph-photo-badge">
                <MapPin size={12} className="text-stone-700" />
                <span>{activePlace.category === 'culture' ? 'Мәдени мұра' : 'Табиғи жағалау'}</span>
              </div>
            </div>

            {/* Quick coastal context tags */}
            <div className="monograph-photo-footer">
              <div className="meta-tag">
                <Footprints size={13} className="text-stone-500" />
                <span>~850 м (10–12 мин жаяу)</span>
              </div>
              <div className="meta-tag">
                <Compass size={13} className="text-stone-500" />
                <span>Солтүстік-шығыс бағыт</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Walking Context, and Primary Actions */}
          <div className="monograph-details-column">
            <div className="monograph-header-row">
              <div>
                <span className="monograph-kicker">
                  {currentLang === 'kk'
                    ? 'Ақтау қаласының көрнекті орны'
                    : 'Достопримечательность набережной Актау'}
                </span>
                <h1 className="monograph-title">{localized.name}</h1>
              </div>

              {/* Audio reading trigger */}
              <button
                type="button"
                onClick={handleSpeakSummary}
                className="audio-read-btn"
                title="Озвучить описание"
              >
                <Volume2 size={18} />
              </button>
            </div>

            {/* Narrative Paragraph */}
            <p className="monograph-summary">{localized.summary}</p>
            {localized.description && (
              <p className="monograph-description">{localized.description}</p>
            )}

            {/* Street Address */}
            <div className="monograph-address-pill">
              <MapPin size={14} className="text-stone-400 shrink-0" />
              <span>{localized.address}</span>
            </div>

            {/* The 3 Core Kiosk Action Buttons */}
            <div className="monograph-actions-row">
              <button
                type="button"
                onClick={handleOpenRoute}
                className="monograph-btn-primary"
              >
                <Navigation size={17} />
                <span>
                  {currentLang === 'kk' ? 'Бағытты көру' : 'Как пройти?'}
                </span>
                <ArrowRight size={15} className="ml-1 opacity-70" />
              </button>

              {activePlace.has_scene && (
                <button
                  type="button"
                  onClick={handleOpenHistory}
                  className="monograph-btn-secondary"
                >
                  <History size={17} />
                  <span>
                    {currentLang === 'kk' ? 'Тарихы (TarihSky)' : 'История места'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleOpenQr}
                className="monograph-btn-outline"
              >
                <QrCode size={17} />
                <span>
                  {currentLang === 'kk' ? 'Телефонға алу' : 'QR на телефон'}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 4. BOTTOM DOCK — VOICE ASSISTANT & QUICK SUGGESTIONS (Голосовой диалог на набережной) */}
      <footer className="embankment-voice-dock">
        <div className="voice-dock-inner">
          {/* Tactile Mic Button */}
          <button
            type="button"
            onClick={() => handleTriggerVoice()}
            className={`voice-mic-trigger ${isListeningActive ? 'is-active' : ''}`}
            title="Голосовой ввод"
          >
            <Mic size={20} />
          </button>

          {/* Voice Prompt & Status */}
          <div className="voice-status-block">
            {isListeningActive ? (
              <div className="flex items-center gap-3">
                <VoiceWave active={true} bars={16} />
                <span className="voice-status-text active">
                  {currentLang === 'kk' ? 'Тыңдап тұрмын, айтыңыз...' : 'Слушаю вас, говорите...'}
                </span>
              </div>
            ) : (
              <div className="voice-status-content">
                <span className="voice-hint-title">
                  {speechTranscript ? `«${speechTranscript}»` : (currentLang === 'kk' ? 'Стеладан дауыспен сұраңыз:' : 'Спросите стелу голосом:')}
                </span>
                <span className="voice-hint-subtitle">
                  {currentLang === 'kk'
                    ? '«Жартасты соқпаққа қалай барады?» · «Жақын жерде не бар?»'
                    : '«Как пройти к Скальной тропе?» · «Где встретить закат?»'}
                </span>
              </div>
            )}
          </div>

          {/* Quick Promenade Topic Chips */}
          <div className="voice-quick-chips">
            {[
              { kk: 'Жартасты соқпақ', ru: 'Скальная тропа', en: 'Rock Trail' },
              { kk: 'Маяк', ru: 'Маяк на крыше', en: 'Lighthouse' },
              { kk: 'Жақын маңда', ru: 'Что рядом?', en: 'Nearby' },
            ].map((chip, idx) => {
              const chipLabel = chip[currentLang as keyof typeof chip] || chip.ru;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTriggerVoice(chipLabel)}
                  className="voice-mini-chip"
                >
                  <Sparkles size={11} className="text-stone-400" />
                  <span>{chipLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* 5. SLIDE-OVER OVERLAY MODAL (Route / TarihSky / QR) — Clean & Integrated */}
      <AnimatePresence>
        {activeOverlay !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="embankment-modal-backdrop"
            onClick={() => setActiveOverlay('none')}
          >
            <motion.div
              initial={{ y: 24, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="embankment-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Overlay Top Bar */}
              <div className="modal-dialog-header">
                <div className="flex items-center gap-2">
                  <span className="modal-type-badge">
                    {activeOverlay === 'route'
                      ? 'МАРШРУТ'
                      : activeOverlay === 'history'
                      ? 'TARIHSKY · ИСТОРИЯ'
                      : 'QR НА СМАРТФОН'}
                  </span>
                  <h3 className="modal-title">{localized.name}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveOverlay('none')}
                  className="modal-close-btn"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="modal-dialog-body">
                {activeOverlay === 'route' && (
                  <div className="modal-route-layout">
                    <div className="route-summary-box">
                      <div className="route-metric">
                        <Footprints size={18} className="text-stone-600" />
                        <div>
                          <div className="metric-value">{routeData?.distance_m || 850} м</div>
                          <div className="metric-label">пешая прогулка</div>
                        </div>
                      </div>

                      <div className="route-metric">
                        <Clock size={18} className="text-stone-600" />
                        <div>
                          <div className="metric-value">~{routeData?.duration_min || 11} мин</div>
                          <div className="metric-label">время в пути</div>
                        </div>
                      </div>
                    </div>

                    <div className="route-step-card">
                      <div className="step-num">1</div>
                      <p className="step-instruction">
                        {routeData?.direction_text ||
                          'Идите вдоль набережной 15-го микрорайона на северо-восток в сторону моря.'}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleOpenQr}
                        className="monograph-btn-primary"
                      >
                        <QrCode size={16} />
                        <span>Открыть маршрут на смартфоне</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeOverlay === 'history' && (
                  <div className="modal-history-layout">
                    {/* Split comparison */}
                    <div className="modal-split-box">
                      <div className="split-img-layer modern">
                        <img
                          src={sceneData?.modern_url || activePlace.thumb_url}
                          alt="Сегодня"
                          className="split-img"
                        />
                        <span className="split-tag right">Бүгін · Сегодня</span>
                      </div>

                      <div
                        className="split-img-layer historic"
                        style={{ clipPath: `inset(0 ${100 - historySlider}% 0 0)` }}
                      >
                        <img
                          src={
                            sceneData?.historic_url ||
                            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85'
                          }
                          alt="1968"
                          className="split-img grayscale"
                        />
                        <span className="split-tag left">1968 жыл · Мұрағат</span>
                      </div>

                      <div className="split-handle-line" style={{ left: `${historySlider}%` }}>
                        <div className="split-handle-knob">◀ ▶</div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={historySlider}
                        onChange={(e) => setHistorySlider(Number(e.target.value))}
                        className="split-slider-input"
                      />
                    </div>

                    <p className="modal-history-text">
                      {sceneData?.texts?.[currentLang]?.body ||
                        'В 1968 году город Шевченко (ныне Актау) закладывался на побережье Каспия. Уникальная архитектура белого ракушечника и каскадные спуски к морю стали визитной карточкой города первопроходцев.'}
                    </p>
                  </div>
                )}

                {activeOverlay === 'qr' && (
                  <div className="modal-qr-layout">
                    <div className="modal-qr-box">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                          qrData?.url || `https://bagdar.kz/route/${activePlace.id}`
                        )}&bgcolor=FFFFFF&color=1C1C1E&margin=1`}
                        alt="QR код"
                        className="modal-qr-code"
                      />
                      <span className="qr-caption">Наведите камеру смартфона</span>
                    </div>

                    <div className="modal-qr-desc">
                      <h4>{localized.name}</h4>
                      <p>Маршрут откроется в браузере телефона без установки приложений.</p>
                      <div className="flex items-center gap-2 mt-4 text-xs text-stone-500">
                        <Check size={14} className="text-emerald-600" />
                        <span>Геолокация и пошаговая навигация</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
