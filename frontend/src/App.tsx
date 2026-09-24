import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  UserCheck,
  UserX,
} from 'lucide-react';

import type {
  KioskConfig,
  Place,
  RouteResponse,
  SceneResponse,
  QrResponse,
  KioskPage,
} from './types';
import {
  fetchConfig,
  fetchPlaces,
  fetchRoute,
  fetchScene,
  fetchQr,
  sendDialogTurn,
  endSession,
} from './api';
import { speakText, stopSpeaking } from './utils/tts';
import { useVoiceListener } from './hooks/useVoiceListener';
import { useCameraPresence } from './hooks/useCameraPresence';

// The 14 Dedicated Presentation Pages
import { PageSleep } from './components/pages/PageSleep';
import { PageGreeting } from './components/pages/PageGreeting';
import { PageListening } from './components/pages/PageListening';
import { PageThinking } from './components/pages/PageThinking';
import { PagePlace } from './components/pages/PagePlace';
import { PageRoute } from './components/pages/PageRoute';
import { PageHistory } from './components/pages/PageHistory';
import { PageQr } from './components/pages/PageQr';
import { PageVariants } from './components/pages/PageVariants';
import { PageNearby } from './components/pages/PageNearby';
import { PageHelp } from './components/pages/PageHelp';
import { PageFarewell } from './components/pages/PageFarewell';
import { PageError } from './components/pages/PageError';
import { PageGestures } from './components/pages/PageGestures';

export const App: React.FC = () => {
  // Config & Session
  const [config, setConfig] = useState<KioskConfig | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => 'sess-' + Math.random().toString(36).substring(2, 10));
  const [lang, setLang] = useState<string>('kk'); // Default to Kazakh

  // 14-Page State Machine
  const [currentPage, setCurrentPage] = useState<KioskPage>('sleep');

  // Presentation Storyboard Bar Toggle
  const [showStoryboard] = useState<boolean>(true);

  // Data Store
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [scene, setScene] = useState<SceneResponse | null>(null);
  const [qrData, setQrData] = useState<QrResponse | null>(null);

  // Dialogue & Speech Recognition
  const [userSpokenText, setUserSpokenText] = useState<string>('');

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
      if (data.places.length > 0) {
        setSelectedPlace(data.places[0]);
      }
    }
    init();
  }, []);

  // Update places when language changes
  useEffect(() => {
    if (!config) return;
    fetchPlaces(lang).then((data) => {
      setPlaces(data.places);
      if (selectedPlace) {
        const updated = data.places.find((p) => p.id === selectedPlace.id);
        if (updated) setSelectedPlace(updated);
      }
    });
  }, [lang, config, selectedPlace]);

  // Touch / User activity reset
  const touchActivity = useCallback(() => {
    idleTimerRef.current = 0;
  }, []);

  // Wake up action (triggered when camera detects person arriving)
  const handleWakeUp = useCallback(() => {
    touchActivity();
    setCurrentPage('greeting');

    const greeting =
      lang === 'kk'
        ? 'Сәлеметсіз бе! Мен BaGdar цифрлық гидімін. Қай жерге барғыңыз келеді?'
        : lang === 'en'
        ? 'Welcome! I am BaGdar, your digital guide to Aktau. Where would you like to explore?'
        : 'Здравствуйте! Я цифровой гид BaGdar. Какое место в Актау вас интересует?';

    speakText(greeting, lang);
  }, [lang, touchActivity]);

  // Reset Session
  const handleResetSession = useCallback(() => {
    stopSpeaking();
    endSession(sessionId);
    setSessionId('sess-' + Math.random().toString(36).substring(2, 10));
    setCurrentPage('sleep');
    setRoute(null);
    setScene(null);
    setQrData(null);
    setUserSpokenText('');
    idleTimerRef.current = 0;
  }, [sessionId]);

  // 2. Camera Presence Hook (Optical Person Detection)
  // RULE 1: Presence is strictly determined by camera. Main screen shows when person is in frame.
  const {
    isPersonPresent,
    simulatePersonApproach,
    simulatePersonDeparture,
  } = useCameraPresence({
    onPersonArrived: () => {
      // Camera sees person -> wake up to greeting!
      if (currentPage === 'sleep') {
        handleWakeUp();
      }
    },
    onPersonDeparted: () => {
      // Person left camera view -> farewell and then sleep!
      if (currentPage !== 'sleep') {
        setCurrentPage('farewell');
      }
    },
    enabled: true,
  });

  // Load Route for a Place
  const loadRouteForPlace = useCallback(
    async (place: Place) => {
      setSelectedPlace(place);
      try {
        const routeData = await fetchRoute(place.id, lang);
        setRoute(routeData);
      } catch (err) {
        console.warn('Could not fetch route:', err);
      }
    },
    [lang]
  );

  // Load Scene (TarihSky) for a Place
  const loadSceneForPlace = useCallback(
    async (place: Place) => {
      setSelectedPlace(place);
      try {
        const sceneData = await fetchScene(place.id);
        setScene(sceneData);
      } catch (err) {
        console.warn('Could not fetch scene:', err);
      }
    },
    []
  );

  // Load QR for a Place
  const loadQrForPlace = useCallback(
    async (place: Place) => {
      setSelectedPlace(place);
      try {
        const qrRes = await fetchQr(place.id, lang, sessionId);
        setQrData(qrRes);
      } catch (err) {
        console.warn('Could not fetch QR:', err);
      }
    },
    [lang, sessionId]
  );

  // Core Voice Dialogue Turn
  const handleVoiceUtterance = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text) return;

      touchActivity();
      setUserSpokenText(text);
      setCurrentPage('thinking');
      stopSpeaking();

      // Language Switch Command detection
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
            screen: currentPage,
            last_place_id: selectedPlace?.id || null,
          },
        });

        if (response.lang && ['kk', 'ru', 'en'].includes(response.lang) && response.lang !== lang) {
          setLang(response.lang);
        }

        speakText(response.say, response.lang || lang);

        // Check for unrecognized speech / fallback
        if (response.debug?.via === 'fallback_prompt' || response.intent === 'speech_unrecognized') {
          // RULE 2: Sound was present, but speech was not recognized.
          setCurrentPage((prev) => (prev === 'error' ? 'gestures' : 'error'));
          return;
        }

        // Execute actions returned by AI brain
        if (response.actions && response.actions.length > 0) {
          const primaryAction = response.actions[0];
          const targetPlaceId = primaryAction.place_id || response.place_id || selectedPlace?.id || 1;
          const targetPlace = places.find((p) => p.id === targetPlaceId) || selectedPlace || places[0];

          if (primaryAction.show === 'route') {
            await loadRouteForPlace(targetPlace);
            setCurrentPage('route');
          } else if (primaryAction.show === 'scene') {
            await loadSceneForPlace(targetPlace);
            setCurrentPage('history');
          } else if (primaryAction.show === 'qr') {
            await loadQrForPlace(targetPlace);
            setCurrentPage('qr');
          } else if (primaryAction.show === 'sleep') {
            setCurrentPage('farewell');
          } else {
            setSelectedPlace(targetPlace);
            setCurrentPage('place');
          }
          return;
        }

        // If suggestions are returned (multiple places found)
        if (response.suggestions && response.suggestions.length > 1) {
          setCurrentPage('variants');
          return;
        }

        // Intent-based fallback routing
        if (response.intent === 'nearby') {
          setCurrentPage('nearby');
        } else if (response.intent === 'help') {
          setCurrentPage('help');
        } else if (response.intent === 'farewell') {
          setCurrentPage('farewell');
        } else if (response.place_id) {
          const targetPlace = places.find((p) => p.id === response.place_id) || selectedPlace || places[0];
          setSelectedPlace(targetPlace);
          setCurrentPage('place');
        } else {
          if (selectedPlace) {
            setCurrentPage('place');
          } else {
            setCurrentPage('variants');
          }
        }
      } catch (err) {
        console.error('Dialog turn failed:', err);
        setCurrentPage('error');
      }
    },
    [sessionId, currentPage, selectedPlace, lang, places, loadRouteForPlace, loadSceneForPlace, loadQrForPlace, touchActivity]
  );

  // 3. Voice Listener Hook (Web Audio API Level + Web Speech STT)
  const {
    interimTranscript,
    volumeLevel,
  } = useVoiceListener({
    lang,
    onSpeechFinal: (text: string) => {
      handleVoiceUtterance(text);
    },
    onUnrecognizedSound: () => {
      // Sound heard, but speech not recognized
      if (currentPage === 'sleep' && isPersonPresent) {
        setCurrentPage('listening');
      }
    },
    enabled: true,
  });

  // Sync interim transcript to UI
  useEffect(() => {
    if (interimTranscript) {
      setUserSpokenText(interimTranscript);
    }
  }, [interimTranscript]);

  // Session idle timer (90 seconds)
  useEffect(() => {
    if (currentPage === 'sleep') return;

    const interval = setInterval(() => {
      idleTimerRef.current += 1;
      const timeoutSec = config?.session?.idle_timeout_sec || 90;
      if (idleTimerRef.current >= timeoutSec) {
        handleResetSession();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPage, config, handleResetSession]);

  // Helper for selecting a place from variants / nearby
  const handleSelectAndShowPlace = useCallback(
    async (place: Place) => {
      setSelectedPlace(place);
      await loadRouteForPlace(place);
      setCurrentPage('place');
    },
    [loadRouteForPlace]
  );

  // Fallback default place if none loaded
  const currentPlace: Place = selectedPlace || places[0] || {
    id: 1,
    name: 'Набережная Актау и Скальная тропа',
    summary: 'Уникальная пешеходная тропа вдоль скал и лазурного побережья Каспия.',
    description: 'Один из главных символов Актау.',
    category: 'nature',
    lat: 43.642,
    lng: 51.172,
    address: 'г. Актау, побережье Каспия, 15 микрорайон',
    thumb_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    has_scene: true,
    hours: null,
    access: 'walk',
  };

  // Convert volumeLevel (0-100) to approximate dBFS (-60 to 0)
  const approxDb = Math.round((volumeLevel / 100) * 60 - 60);

  // 14 Pages Presentation Map
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'sleep':
        return (
          <PageSleep
            onWakeUp={handleWakeUp}
            lang={lang}
            isPersonPresent={isPersonPresent}
            onSimulateApproach={simulatePersonApproach}
          />
        );

      case 'greeting':
        return (
          <PageGreeting
            lang={lang}
            onProceedToListening={() => setCurrentPage('listening')}
          />
        );

      case 'listening':
        return (
          <PageListening
            lang={lang}
            userSpokenText={userSpokenText}
            audioDbLevel={approxDb}
            onSimulateUtterance={handleVoiceUtterance}
            onCancel={() => setCurrentPage('place')}
          />
        );

      case 'thinking':
        return (
          <PageThinking
            userSpokenText={userSpokenText}
            lang={lang}
          />
        );

      case 'place':
        return (
          <PagePlace
            place={currentPlace}
            lang={lang}
            onGoToRoute={async () => {
              await loadRouteForPlace(currentPlace);
              setCurrentPage('route');
            }}
            onGoToHistory={async () => {
              await loadSceneForPlace(currentPlace);
              setCurrentPage('history');
            }}
            onGoToQr={async () => {
              await loadQrForPlace(currentPlace);
              setCurrentPage('qr');
            }}
            onBackToNearby={() => setCurrentPage('nearby')}
          />
        );

      case 'route':
        return (
          <PageRoute
            place={currentPlace}
            route={route}
            config={config}
            places={places}
            lang={lang}
            onGoToPlace={() => setCurrentPage('place')}
            onGoToHistory={async () => {
              await loadSceneForPlace(currentPlace);
              setCurrentPage('history');
            }}
            onGoToQr={async () => {
              await loadQrForPlace(currentPlace);
              setCurrentPage('qr');
            }}
          />
        );

      case 'history':
        return (
          <PageHistory
            place={currentPlace}
            scene={scene}
            lang={lang}
            onBackToPlace={() => setCurrentPage('place')}
            onGoToRoute={async () => {
              await loadRouteForPlace(currentPlace);
              setCurrentPage('route');
            }}
            onGoToQr={async () => {
              await loadQrForPlace(currentPlace);
              setCurrentPage('qr');
            }}
          />
        );

      case 'qr':
        return (
          <PageQr
            place={currentPlace}
            qrData={qrData}
            onBackToRoute={() => setCurrentPage('route')}
            onBackToPlace={() => setCurrentPage('place')}
          />
        );

      case 'variants':
        return (
          <PageVariants
            places={places}
            lang={lang}
            onSelectPlace={handleSelectAndShowPlace}
          />
        );

      case 'nearby':
        return (
          <PageNearby
            places={places}
            lang={lang}
            onSelectPlace={handleSelectAndShowPlace}
          />
        );

      case 'help':
        return (
          <PageHelp
            lang={lang}
            onBack={() => setCurrentPage(selectedPlace ? 'place' : 'greeting')}
            onStartListening={() => setCurrentPage('listening')}
          />
        );

      case 'farewell':
        return (
          <PageFarewell
            lang={lang}
            onFinishFarewell={handleResetSession}
          />
        );

      case 'error':
        return (
          <PageError
            lang={lang}
            onRetry={() => setCurrentPage('listening')}
            onShowHelp={() => setCurrentPage('help')}
          />
        );

      case 'gestures':
        return (
          <PageGestures
            onSelectGesture={(gesture) => {
              if (gesture.includes('1-й') || gesture.includes('Да')) {
                handleSelectAndShowPlace(places[0]);
              } else if (gesture.includes('2-й')) {
                handleSelectAndShowPlace(places[1] || places[0]);
              } else if (gesture.includes('маршрут')) {
                loadRouteForPlace(currentPlace).then(() => setCurrentPage('route'));
              } else {
                setCurrentPage('place');
              }
            }}
            onReturnToVoice={() => {
              setCurrentPage('listening');
            }}
          />
        );

      default:
        return (
          <PageSleep
            onWakeUp={handleWakeUp}
            lang={lang}
            isPersonPresent={isPersonPresent}
            onSimulateApproach={simulatePersonApproach}
          />
        );
    }
  };

  const pagesList: { id: KioskPage; label: string; num: string }[] = [
    { id: 'sleep', label: 'Сон', num: '01' },
    { id: 'greeting', label: 'Приветствие', num: '02' },
    { id: 'listening', label: 'Слушаю', num: '03' },
    { id: 'thinking', label: 'Думаю', num: '04' },
    { id: 'place', label: 'Место', num: '05' },
    { id: 'route', label: 'Маршрут', num: '06' },
    { id: 'history', label: 'История', num: '07' },
    { id: 'qr', label: 'QR', num: '08' },
    { id: 'variants', label: 'Варианты', num: '09' },
    { id: 'nearby', label: 'Рядом', num: '10' },
    { id: 'help', label: 'Помощь', num: '11' },
    { id: 'farewell', label: 'Прощание', num: '12' },
    { id: 'error', label: 'Ошибка', num: '13' },
    { id: 'gestures', label: 'Жесты', num: '14' },
  ];

  return (
    <div className="presentation-stage-root">
      {/* Active Page Viewport with Cinematic Transitions */}
      {renderCurrentPage()}

      {/* Floating Storyboard Controller Toolbar */}
      {showStoryboard && (
        <div className="storyboard-toolbar" role="navigation" aria-label="Презентация 14 экранов">
          <span className="storyboard-label">14 Экранов BaGdar:</span>

          {pagesList.map((p) => (
            <button
              key={p.id}
              className={`storyboard-btn ${currentPage === p.id ? 'active' : ''}`}
              onClick={() => {
                touchActivity();
                if (p.id === 'route') {
                  loadRouteForPlace(currentPlace).then(() => setCurrentPage('route'));
                } else if (p.id === 'history') {
                  loadSceneForPlace(currentPlace).then(() => setCurrentPage('history'));
                } else if (p.id === 'qr') {
                  loadQrForPlace(currentPlace).then(() => setCurrentPage('qr'));
                } else {
                  setCurrentPage(p.id);
                }
              }}
              title={`Перейти на экран ${p.num}: ${p.label}`}
            >
              <span className="btn-num">{p.num}</span>
              <span>{p.label}</span>
            </button>
          ))}

          {/* Quick Sensor Simulator Toggles */}
          <button
            className="storyboard-btn sensor-toggle"
            onClick={isPersonPresent ? simulatePersonDeparture : simulatePersonApproach}
            title="Камера: симуляция присутствия человека"
          >
            {isPersonPresent ? (
              <>
                <UserCheck size={12} className="text-emerald-400" />
                <span>Человек в кадре</span>
              </>
            ) : (
              <>
                <UserX size={12} className="text-slate-400" />
                <span>Кадр пуст</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
