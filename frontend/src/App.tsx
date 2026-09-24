import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  Hand,
  HelpCircle,
  Camera,
  UserCheck,
  UserX,
} from 'lucide-react';

import type {
  KioskConfig,
  Place,
  RouteResponse,
  SceneResponse,
  QrResponse,
} from './types';
import {
  fetchConfig,
  fetchPlaces,
  fetchPlaceById,
  fetchRoute,
  fetchScene,
  fetchQr,
  sendDialogTurn,
  endSession,
} from './api';
import { speakText, stopSpeaking } from './utils/tts';
import { useVoiceListener } from './hooks/useVoiceListener';
import { useCameraPresence } from './hooks/useCameraPresence';
import { KioskMap } from './components/KioskMap';
import { PlaceEditorialDrawer } from './components/PlaceEditorialDrawer';
import { AtlasStrip } from './components/AtlasStrip';
import { TarihSkyModal } from './components/TarihSkyModal';
import { QrModal } from './components/QrModal';
import { SleepScreen } from './components/SleepScreen';

export const App: React.FC = () => {
  // Config & Session
  const [config, setConfig] = useState<KioskConfig | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => 'sess-' + Math.random().toString(36).substring(2, 10));
  const [lang, setLang] = useState<string>('kk'); // Default to Kazakh

  // App States
  const [isAsleep, setIsAsleep] = useState<boolean>(true);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [scene, setScene] = useState<SceneResponse | null>(null);
  const [qrData, setQrData] = useState<QrResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Modals & Triggers
  const [showTarihSky, setShowTarihSky] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);
  const [gestureAlert, setGestureAlert] = useState<boolean>(false);

  // AI Dialogue
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [aiSpeaking, setAiSpeaking] = useState<boolean>(false);
  const [aiSpeechText, setAiSpeechText] = useState<string>('');
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [unrecognizedSpeechCount, setUnrecognizedSpeechCount] = useState<number>(0);

  // Timers
  const idleTimerRef = useRef<number>(0);

  // 1. Initial Load
  useEffect(() => {
    async function init() {
      const cfg = await fetchConfig();
      setConfig(cfg);
      const initialLang = cfg.default_lang || 'kk';
      setLang(initialLang);
      const data = await fetchPlaces(initialLang);
      setPlaces(data.places);
    }
    init();
  }, []);

  // Update places when language changes
  useEffect(() => {
    if (!config) return;
    fetchPlaces(lang, activeCategory).then((data) => {
      setPlaces(data.places);
      if (selectedPlace) {
        const updated = data.places.find((p) => p.id === selectedPlace.id);
        if (updated) setSelectedPlace(updated);
      }
    });
  }, [lang, activeCategory]);

  const touchActivity = useCallback(() => {
    idleTimerRef.current = 0;
  }, []);

  // Wake up action (triggered when camera detects person arriving)
  const handleWakeUp = useCallback(() => {
    setIsAsleep(false);
    touchActivity();

    const greeting =
      lang === 'kk'
        ? 'Сәлеметсіз бе! Мен BaGdar цифрлық гидімін. Қай жерге барғыңыз келеді?'
        : lang === 'en'
        ? 'Welcome! I am BaGdar, your digital guide to Aktau. Where would you like to explore?'
        : 'Здравствуйте! Я цифровой гид BaGdar. Какое место в Актау вас интересует?';

    setAiSpeechText(greeting);
    speakText(greeting, lang, () => setAiSpeaking(true), () => setAiSpeaking(false));
  }, [lang, touchActivity]);

  // Reset Session
  const handleResetSession = useCallback(() => {
    stopSpeaking();
    endSession(sessionId);
    setSessionId('sess-' + Math.random().toString(36).substring(2, 10));
    setIsAsleep(true);
    setSelectedPlace(null);
    setRoute(null);
    setShowTarihSky(false);
    setShowQr(false);
    setGestureAlert(false);
    setUnrecognizedSpeechCount(0);
    setAiSpeechText('');
    setUserSpokenText('');
    setAiSpeaking(false);
    setAiThinking(false);
    idleTimerRef.current = 0;
  }, [sessionId]);

  // 2. Camera Presence Hook (Optical Person Detection)
  // Rule 1: Presence is strictly determined by camera. Main screen shows when person is in frame.
  const {
    isPersonPresent,
    cameraActive,
    simulatePersonApproach,
    simulatePersonDeparture,
  } = useCameraPresence({
    onPersonArrived: () => {
      // Camera sees person -> wake up to main screen!
      handleWakeUp();
    },
    onPersonDeparted: () => {
      // Person left camera view -> return to sleep screen!
      handleResetSession();
    },
    enabled: true,
  });

  // Select Place & Load Route
  const handleSelectPlace = useCallback(
    async (place: Place) => {
      touchActivity();
      setSelectedPlace(place);

      try {
        const routeData = await fetchRoute(place.id, lang);
        setRoute(routeData);
      } catch (err) {
        console.warn('Could not fetch route:', err);
      }
    },
    [lang, touchActivity]
  );

  // TarihSky
  const handleOpenTarihSky = useCallback(
    async (placeId?: number) => {
      touchActivity();
      const targetId = placeId || selectedPlace?.id || 1;
      const sceneData = await fetchScene(targetId);
      if (sceneData) {
        setScene(sceneData);
        setShowTarihSky(true);
        setShowQr(false);
      }
    },
    [selectedPlace, touchActivity]
  );

  // QR
  const handleOpenQr = useCallback(
    async (placeId?: number) => {
      touchActivity();
      const targetId = placeId || selectedPlace?.id || 1;
      const targetPlace = places.find((p) => p.id === targetId) || selectedPlace || places[0];
      if (targetPlace) {
        setSelectedPlace(targetPlace);
        const qrRes = await fetchQr(targetId, lang, sessionId);
        setQrData(qrRes);
        setShowQr(true);
        setShowTarihSky(false);
      }
    },
    [selectedPlace, places, lang, sessionId, touchActivity]
  );

  // Core Voice Dialogue Turn
  const handleVoiceUtterance = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text) return;

      touchActivity();
      setUserSpokenText(text);
      setAiThinking(true);
      stopSpeaking();

      // Language Switch Commands
      if (/қазақ|қазақша/i.test(text)) {
        setLang('kk');
      } else if (/english/i.test(text)) {
        setLang('en');
      } else if (/русский|по-русски/i.test(text)) {
        setLang('ru');
      }

      try {
        const response = await sendDialogTurn({
          session_id: sessionId,
          lang: 'auto',
          text,
          context: {
            screen: showTarihSky ? 'scene' : showQr ? 'qr' : selectedPlace ? 'place' : 'map',
            last_place_id: selectedPlace?.id || null,
          },
        });

        setAiThinking(false);

        if (response.lang && ['kk', 'ru', 'en'].includes(response.lang) && response.lang !== lang) {
          setLang(response.lang);
        }

        setAiSpeechText(response.say);
        speakText(response.say, response.lang || lang, () => setAiSpeaking(true), () => setAiSpeaking(false));

        // Check if dialogue recognized speech or fell back to prompt
        if (response.debug?.via === 'fallback_prompt' || response.intent === 'speech_unrecognized') {
          // Sound was present, but speech was not recognized into a place/command
          setUnrecognizedSpeechCount((prev) => {
            const next = prev + 1;
            if (next >= 2) {
              setGestureAlert(true);
            }
            return next;
          });
        } else {
          // Valid speech successfully recognized! Reset counter & dismiss gesture alert
          setUnrecognizedSpeechCount(0);
          setGestureAlert(false);
        }

        for (const action of response.actions) {
          if (action.show === 'sleep') {
            handleResetSession();
            return;
          }

          if (action.show === 'map') {
            setSelectedPlace(null);
            setRoute(null);
            setShowTarihSky(false);
            setShowQr(false);
          }

          if (action.show === 'route' && action.place_id) {
            setShowTarihSky(false);
            setShowQr(false);
            const foundPlace = places.find((p) => p.id === action.place_id);
            if (foundPlace) {
              handleSelectPlace(foundPlace);
            } else {
              fetchPlaceById(action.place_id, lang).then(handleSelectPlace);
            }
          }

          if (action.show === 'scene') {
            handleOpenTarihSky(action.place_id || selectedPlace?.id);
          }

          if (action.show === 'qr') {
            handleOpenQr(action.place_id || selectedPlace?.id);
          }
        }
      } catch (err) {
        setAiThinking(false);
        console.error('Error handling dialog turn:', err);
      }
    },
    [
      sessionId,
      lang,
      places,
      selectedPlace,
      showTarihSky,
      showQr,
      touchActivity,
      handleSelectPlace,
      handleOpenTarihSky,
      handleOpenQr,
      handleResetSession,
    ]
  );

  // Voice listener hook:
  // Rule 1: Sound threshold > -30 dBFS
  // Rule 2: Gestures trigger ONLY when sound exists (> -30 dBFS) AND speech is not recognized 2 times. Silence does NOT trigger gestures.
  const { isListening, interimTranscript, volumeLevel, triggerManualUtterance } =
    useVoiceListener({
      onSpeechFinal: handleVoiceUtterance,
      onUnrecognizedSound: () => {
        if (!isPersonPresent) return;

        setUnrecognizedSpeechCount((prev) => {
          const next = prev + 1;
          if (next >= 2) {
            setGestureAlert(true);
          }
          return next;
        });
      },
      lang,
      enabled: true,
    });

  if (!config) {
    return (
      <div className="kiosk-preloader">
        <div className="preloader-spinner" />
        <span className="preloader-text">BAĠDAR AKTAU DIGITAL KIOSK INITIALIZING...</span>
      </div>
    );
  }

  return (
    <div className="kiosk-app-viewport" onClick={touchActivity}>
      {/* 1. Lando Norris SOTY 2025 Style Idle Screensaver */}
      {isAsleep && (
        <SleepScreen
          onWake={handleWakeUp}
          lang={lang}
          isPersonPresent={isPersonPresent}
          cameraActive={cameraActive}
          onSimulateApproach={simulatePersonApproach}
        />
      )}

      {/* 2. Top Kiosk Navigation Header */}
      <header className="kiosk-editorial-header">
        <div className="header-brand-group">
          <div className="brand-accent-gem" />
          <div className="brand-text-block">
            <span className="brand-main-title">BAĠDAR</span>
            <span className="brand-tagline">AQTAU · CASPIAN HORIZON</span>
          </div>

          <div className="stele-meta-pill">
            <span className="stele-coords-label">43.6582°N 51.1352°E</span>
            <span className="stele-pill-divider">/</span>
            <span className="stele-id-badge">AKTAU-EMB-01</span>
          </div>

          {/* Camera Presence Telemetry & Simulation Pill */}
          <div
            className={`camera-telemetry-badge ${isPersonPresent ? 'person-detected' : 'person-idle'}`}
            title="Камера арқылы адамды анықтау / Обнаружение человека камерой"
          >
            <Camera size={13} className="cam-badge-icon" />
            <span className="cam-badge-text">
              {isPersonPresent
                ? (lang === 'kk' ? 'АДАМ АЛДЫНДА' : lang === 'en' ? 'PERSON IN FRONT' : 'ЧЕЛОВЕК У СТЕЛЫ')
                : (lang === 'kk' ? 'КАМЕРА: КҮТУДЕ' : lang === 'en' ? 'CAM: STANDBY' : 'КАМЕРА: ОЖИДАНИЕ')}
            </span>

            {/* Quick Toggle for demo / test without camera */}
            <button
              className="cam-sim-toggle"
              onClick={(e) => {
                e.stopPropagation();
                if (isPersonPresent) simulatePersonDeparture();
                else simulatePersonApproach();
              }}
              title={isPersonPresent ? 'Имитировать уход' : 'Имитировать подход человека'}
            >
              {isPersonPresent ? <UserX size={12} /> : <UserCheck size={12} />}
            </button>
          </div>
        </div>

        <div className="header-controls-group">
          {/* Trilingual Selector */}
          <div className="trilingual-pill-switch">
            <button
              className={`lang-tab ${lang === 'kk' ? 'is-active' : ''}`}
              onClick={() => { setLang('kk'); touchActivity(); }}
            >
              ҚАЗ
            </button>
            <button
              className={`lang-tab ${lang === 'ru' ? 'is-active' : ''}`}
              onClick={() => { setLang('ru'); touchActivity(); }}
            >
              РУС
            </button>
            <button
              className={`lang-tab ${lang === 'en' ? 'is-active' : ''}`}
              onClick={() => { setLang('en'); touchActivity(); }}
            >
              ENG
            </button>
          </div>

          {/* Reset / End Session */}
          <button
            className="kiosk-reset-action-btn"
            onClick={handleResetSession}
            title="Сеансты аяқтау / Завершить сеанс"
          >
            <RotateCcw size={15} />
            <span className="btn-label">{lang === 'kk' ? 'Аяқтау' : lang === 'en' ? 'Reset' : 'Сброс'}</span>
          </button>
        </div>
      </header>

      {/* 3. Acoustic Voice Intelligence Bar */}
      <section className="acoustic-voice-bar">
        <div className="acoustic-sensor-cluster">
          <div
            className={`acoustic-visual-orb ${
              aiSpeaking
                ? 'state-speaking'
                : aiThinking
                ? 'state-thinking'
                : isListening
                ? 'state-listening'
                : ''
            }`}
          >
            {aiSpeaking ? (
              <Volume2 className="orb-status-glyph" />
            ) : aiThinking ? (
              <Sparkles className="orb-status-glyph is-revolving" />
            ) : (
              <span className="orb-dot-pulse" />
            )}
          </div>

          <div className="acoustic-text-meta">
            <span className="acoustic-status-title">
              {aiSpeaking
                ? (lang === 'kk' ? 'ИИ СӨЙЛЕУДЕ' : lang === 'en' ? 'AI SPEAKING' : 'ИИ ОТВЕЧАЕТ')
                : aiThinking
                ? (lang === 'kk' ? 'ИИ ОЙЛАНУДА...' : lang === 'en' ? 'AI THINKING...' : 'ИИ ДУМАЕТ...')
                : (lang === 'kk' ? 'ИИ ТЫҢДАУДА' : lang === 'en' ? 'AI LISTENING' : 'ИИ СЛУШАЕТ')}
            </span>

            {/* Audio Wave Meter */}
            <div className="audio-bars-spectrum">
              <span className="spectrum-bar" style={{ height: `${Math.max(4, volumeLevel * 0.9)}px` }} />
              <span className="spectrum-bar" style={{ height: `${Math.max(4, volumeLevel * 1.3)}px` }} />
              <span className="spectrum-bar" style={{ height: `${Math.max(4, volumeLevel * 0.6)}px` }} />
              <span className="spectrum-bar" style={{ height: `${Math.max(4, volumeLevel * 1.5)}px` }} />
              <span className="spectrum-bar" style={{ height: `${Math.max(4, volumeLevel * 1.0)}px` }} />
              <span className="spectrum-bar" style={{ height: `${Math.max(4, volumeLevel * 0.5)}px` }} />
            </div>
          </div>
        </div>

        {/* Live Subtitle Transcript */}
        <div className="acoustic-subtitles-viewport">
          {interimTranscript ? (
            <div className="subtitle-bubble live-input">
              <span className="bubble-type-tag">Слушаю:</span>
              <span className="bubble-quote">«{interimTranscript}»</span>
            </div>
          ) : userSpokenText ? (
            <div className="subtitle-bubble last-input">
              <span className="bubble-type-tag">Сұрау:</span>
              <span className="bubble-quote">«{userSpokenText}»</span>
            </div>
          ) : null}

          {aiSpeechText ? (
            <div className="subtitle-bubble ai-answer">
              <span className="ai-speech-string">{aiSpeechText}</span>
            </div>
          ) : (
            <div className="subtitle-placeholder">
              <span>{lang === 'kk' ? '«Амфитеатр қайда?», «Тарихты көрсет», «Не көруге болады?»' : lang === 'en' ? 'Say: "Where is the Amphitheater?", "Show history"' : 'Скажите: «Как пройти к Амфитеатру?», «Что рядом?», «Покажи историю»'}</span>
            </div>
          )}
        </div>
      </section>

      {/* 4. Main Stage: Bhutan-Style Map & Estepona Editorial Drawer */}
      <main className="kiosk-interactive-canvas">
        {/* Map Layer */}
        <div className="canvas-map-frame">
          <KioskMap
            origin={config.origin}
            places={places}
            selectedPlace={selectedPlace}
            route={route}
            onMarkerSelect={handleSelectPlace}
          />
        </div>

        {/* Estepona Travel Editorial Drawer */}
        {selectedPlace && (
          <PlaceEditorialDrawer
            place={selectedPlace}
            route={route}
            config={config}
            lang={lang}
            onClose={() => {
              setSelectedPlace(null);
              setRoute(null);
            }}
            onOpenTarihSky={handleOpenTarihSky}
            onOpenQr={handleOpenQr}
          />
        )}

        {/* Bottom Photo Atlas Strip (Photo-First Discovery) */}
        <AtlasStrip
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={handleSelectPlace}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            touchActivity();
          }}
          lang={lang}
        />
      </main>

      {/* 5. Quick Voice Simulator & Accessibility Footer */}
      <footer className="kiosk-bottom-voice-bar">
        <div className="bottom-guidance-pill">
          <HelpCircle size={14} className="guidance-icon" />
          <span>{lang === 'kk' ? 'Дауыс сұраулары:' : lang === 'en' ? 'Voice Queries:' : 'Голосовые команды:'}</span>
        </div>

        <div className="bottom-chips-track">
          <button
            className="voice-command-chip"
            onClick={() => triggerManualUtterance('Как пройти к Амфитеатру?')}
          >
            «Как пройти к Амфитеатру?»
          </button>

          <button
            className="voice-command-chip"
            onClick={() => triggerManualUtterance('Что рядом посмотреть?')}
          >
            «Что рядом?»
          </button>

          <button
            className="voice-command-chip"
            onClick={() => triggerManualUtterance('Покажи как было раньше')}
          >
            «Покажи историю»
          </button>

          <button
            className="voice-command-chip"
            onClick={() => triggerManualUtterance('Отправь на телефон')}
          >
            «Отправь на телефон»
          </button>

          <button
            className="voice-command-chip"
            onClick={() => triggerManualUtterance('Қазақша')}
          >
            «Қазақша»
          </button>

          <button
            className="voice-command-chip"
            onClick={() => triggerManualUtterance('English')}
          >
            «English»
          </button>

          <button
            className="voice-command-chip chip-farewell"
            onClick={() => triggerManualUtterance('Спасибо, пока')}
          >
            «Спасибо, пока»
          </button>
        </div>
      </footer>

      {/* 6. Sign Language Gesture Notification Banner (Rule #7) */}
      {/* TRIGGER: Sound detected + normal speech unrecognized + person present via camera */}
      {gestureAlert && (
        <div className="gesture-notification-overlay">
          <div className="gesture-badge-cam">
            <Camera size={14} />
            <span>CV КАМЕРА · {unrecognizedSpeechCount}/2</span>
          </div>

          <Hand className="gesture-glow-icon" />

          <div className="gesture-copy">
            <strong className="gesture-strong">
              {lang === 'kk'
                ? 'Сіз ым-ишарамен сөйлесесіз бе? Көрсетіңіз!'
                : lang === 'en'
                ? 'Do you communicate with gestures? Show us!'
                : 'Вы общаетесь жестами? Показывайте!'}
            </strong>
            <span className="gesture-desc">
              {lang === 'kk'
                ? 'Дыбыс бар, бірақ сөздер 2 рет танылмады. Камера алдында белгі көрсетіңіз — стела сізді түсінеді!'
                : lang === 'en'
                ? 'Sound detected, but speech was not recognized twice. Show gestures to the camera — we understand!'
                : 'Звук зафиксирован, но речь не распознана 2 раза. Показывайте жесты перед камерой — стела вас поймёт!'}
            </span>
          </div>

          <div className="gesture-action-pills">
            <button
              className="gesture-choice-btn"
              onClick={() => {
                triggerManualUtterance('Как пройти к Амфитеатру?');
                setGestureAlert(false);
              }}
            >
              👍 {lang === 'kk' ? 'Амфитеатр' : 'Амфитеатр'}
            </button>
            <button
              className="gesture-choice-btn"
              onClick={() => {
                triggerManualUtterance('Что рядом?');
                setGestureAlert(false);
              }}
            >
              👌 {lang === 'kk' ? 'Жақын жерлер' : 'Что рядом'}
            </button>
            <button className="gesture-dismiss-btn" onClick={() => setGestureAlert(false)}>✕</button>
          </div>
        </div>
      )}

      {/* 7. TarihSky Modal */}
      {showTarihSky && scene && (
        <TarihSkyModal
          scene={scene}
          lang={lang}
          onClose={() => setShowTarihSky(false)}
        />
      )}

      {/* 8. QR Modal */}
      {showQr && qrData && selectedPlace && (
        <QrModal
          url={qrData.url}
          place={selectedPlace}
          lang={lang}
          onClose={() => setShowQr(false)}
          timeoutSec={config.session.qr_timeout_sec || 60}
        />
      )}
    </div>
  );
};

export default App;
