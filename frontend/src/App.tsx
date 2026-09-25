import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, UserX } from 'lucide-react';

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

// Clean UI Components
import { Tabs, type TabItem } from './components/ui/Tabs';

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
  const [lang, setLang] = useState<string>('kk');

  // 14-Page State Machine
  const [currentPage, setCurrentPage] = useState<KioskPage>('sleep');

  // Data Store
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [scene, setScene] = useState<SceneResponse | null>(null);
  const [qrData, setQrData] = useState<QrResponse | null>(null);

  const currentPlace: Place = selectedPlace || places[0] || {
    id: 1,
    name: 'Скальная тропа',
    category: 'walking',
    lat: 43.642,
    lng: 51.155,
    thumb_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summary: 'Пешеходная освещенная тропа вдоль скального берега Каспия протяженностью 1.5 км.',
    has_scene: true,
    access: 'walk',
    hours: null,
  };

  // Dialogue & Speech
  const [userSpokenText, setUserSpokenText] = useState<string>('');

  // Activity timer
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

  // Wake up action
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

  // Camera Presence
  const {
    isPersonPresent,
    simulatePersonApproach,
    simulatePersonDeparture,
  } = useCameraPresence({
    onPersonArrived: () => {
      if (currentPage === 'sleep') {
        handleWakeUp();
      }
    },
    onPersonDeparted: () => {
      if (currentPage !== 'sleep') {
        setCurrentPage('farewell');
      }
    },
  });

  // Load Route helper
  const loadRouteForPlace = useCallback(
    async (place: Place) => {
      touchActivity();
      try {
        const r = await fetchRoute(place.id, lang);
        setRoute(r);
        return r;
      } catch (err) {
        console.error('Failed to load route', err);
        return null;
      }
    },
    [lang, touchActivity]
  );

  // Load Scene helper
  const loadSceneForPlace = useCallback(
    async (place: Place) => {
      touchActivity();
      try {
        const s = await fetchScene(place.id);
        setScene(s);
        return s;
      } catch (err) {
        console.error('Failed to load scene', err);
        return null;
      }
    },
    [touchActivity]
  );

  // Load QR helper
  const loadQrForPlace = useCallback(
    async (place: Place) => {
      touchActivity();
      try {
        const q = await fetchQr(place.id, lang, sessionId);
        setQrData(q);
        return q;
      } catch (err) {
        console.error('Failed to load qr', err);
        return null;
      }
    },
    [lang, sessionId, touchActivity]
  );

  // Place selection
  const handleSelectAndShowPlace = useCallback(
    (place: Place) => {
      touchActivity();
      setSelectedPlace(place);
      setCurrentPage('place');
    },
    [touchActivity]
  );

  // Voice Turn Handover
  const handleVoiceUtterance = useCallback(
    async (text: string) => {
      touchActivity();
      setUserSpokenText(text);
      setCurrentPage('thinking');

      try {
        const res = await sendDialogTurn({
          session_id: sessionId,
          text,
          lang,
          context: {
            screen: currentPage,
            last_place_id: currentPlace.id,
          },
        });

        const primaryAction = res.actions?.[0];
        if (primaryAction?.show === 'route') {
          const targetPlace =
            places.find((p) => p.id === primaryAction.place_id) || selectedPlace || places[0];
          setSelectedPlace(targetPlace);
          await loadRouteForPlace(targetPlace);
          setCurrentPage('route');
        } else if (primaryAction?.show === 'scene') {
          const targetPlace =
            places.find((p) => p.id === primaryAction.place_id) || selectedPlace || places[0];
          setSelectedPlace(targetPlace);
          await loadSceneForPlace(targetPlace);
          setCurrentPage('history');
        } else if (primaryAction?.show === 'qr') {
          const targetPlace =
            places.find((p) => p.id === primaryAction.place_id) || selectedPlace || places[0];
          setSelectedPlace(targetPlace);
          await loadQrForPlace(targetPlace);
          setCurrentPage('qr');
        } else if (primaryAction?.show === 'sleep') {
          setCurrentPage('sleep');
        } else if (res.intent === 'clarify' || (res.suggestions && res.suggestions.length > 1)) {
          setCurrentPage('variants');
        } else if (res.intent === 'nearby') {
          setCurrentPage('nearby');
        } else if (res.intent === 'help') {
          setCurrentPage('help');
        } else if (res.intent === 'error_retry') {
          setCurrentPage('error');
        } else if (primaryAction?.show === 'map' && primaryAction.place_id) {
          const targetPlace = places.find((p) => p.id === primaryAction.place_id) || places[0];
          setSelectedPlace(targetPlace);
          setCurrentPage('place');
        } else {
          if (places.length > 0) {
            setSelectedPlace(places[0]);
          }
          setCurrentPage('place');
        }

        if (res.say) {
          speakText(res.say, res.lang || lang);
        }
      } catch (err) {
        console.error('Dialog turn failed', err);
        setCurrentPage('error');
      }
    },
    [
      sessionId,
      lang,
      places,
      selectedPlace,
      currentPlace.id,
      currentPage,
      touchActivity,
      loadRouteForPlace,
      loadSceneForPlace,
      loadQrForPlace,
    ]
  );

  // Voice listener hook
  const { volumeLevel } = useVoiceListener({
    lang,
    onSpeechFinal: (transcript: string) => {
      if (currentPage === 'listening') {
        handleVoiceUtterance(transcript);
      }
    },
    onUnrecognizedSound: () => {
      if (currentPage === 'listening') {
        setCurrentPage('gestures');
      }
    },
  });

  // Storyboard Tabs Configuration (14 Pages — Gothic Roman Sequence)
  const storyboardTabs: TabItem[] = [
    { id: 'sleep', num: 'I', label: 'Сон' },
    { id: 'greeting', num: 'II', label: 'Привет' },
    { id: 'listening', num: 'III', label: 'Слушаю' },
    { id: 'thinking', num: 'IV', label: 'Думаю' },
    { id: 'place', num: 'V', label: 'Место' },
    { id: 'route', num: 'VI', label: 'Маршрут' },
    { id: 'history', num: 'VII', label: 'История' },
    { id: 'qr', num: 'VIII', label: 'QR' },
    { id: 'variants', num: 'IX', label: 'Варианты' },
    { id: 'nearby', num: 'X', label: 'Рядом' },
    { id: 'help', num: 'XI', label: 'Помощь' },
    { id: 'farewell', num: 'XII', label: 'Прощание' },
    { id: 'error', num: 'XIII', label: 'Ошибка' },
    { id: 'gestures', num: 'XIV', label: 'Жесты' },
  ];

  const handleTabChange = (pageId: string) => {
    touchActivity();
    const id = pageId as KioskPage;
    if (id === 'route') {
      loadRouteForPlace(currentPlace).then(() => setCurrentPage('route'));
    } else if (id === 'history') {
      loadSceneForPlace(currentPlace).then(() => setCurrentPage('history'));
    } else if (id === 'qr') {
      loadQrForPlace(currentPlace).then(() => setCurrentPage('qr'));
    } else {
      setCurrentPage(id);
    }
  };

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
            audioDbLevel={volumeLevel}
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

  return (
    <div className="clean-app-shell">
      {/* Animated Page Stage */}
      <div className="clean-app-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gothic Minimal Tabs Floating Dock at Bottom */}
      <footer className="clean-app-dock" role="navigation" aria-label="14 Экранов BaGdar">
        <div className="clean-dock-inner">
          <div className="clean-dock-brand">
            <span className="clean-dock-logo">BAĠDAR</span>
            <span className="clean-dock-version">ARCHIVUM · XIV</span>
          </div>

          <Tabs
            items={storyboardTabs}
            activeId={currentPage}
            onChange={handleTabChange}
          />

          {/* Quick Camera Simulator */}
          <button
            className="clean-dock-sim-btn"
            onClick={isPersonPresent ? simulatePersonDeparture : simulatePersonApproach}
            title="Симуляция присутствия перед камерой"
            type="button"
          >
            {isPersonPresent ? (
              <>
                <UserCheck size={13} className="text-emerald-400" />
                <span>Человек в кадре</span>
              </>
            ) : (
              <>
                <UserX size={13} className="text-zinc-500" />
                <span>Кадр пуст</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
