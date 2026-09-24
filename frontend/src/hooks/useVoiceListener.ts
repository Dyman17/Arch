import { useEffect, useRef, useState, useCallback } from 'react';

interface VoiceListenerOptions {
  onSpeechFinal: (text: string) => void;
  onSoundDetected?: () => void;
  lang?: string;
  enabled?: boolean;
}

export function useVoiceListener({
  onSpeechFinal,
  onSoundDetected,
  lang = 'ru',
  enabled = true,
}: VoiceListenerOptions) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0); // 0 to 100 for visualizer
  const [micAvailable, setMicAvailable] = useState<boolean | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTextRef = useRef<string>('');

  const startAudioMeter = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicAvailable(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setVolumeLevel(normalized);

        // Sound detection threshold (approx -30 dBFS)
        if (normalized > 18) {
          onSoundDetected?.();
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn('[VoiceListener] Mic access denied or not available:', err);
      setMicAvailable(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang === 'kk' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          accumulatedTextRef.current += (accumulatedTextRef.current ? ' ' : '') + final.trim();
          setInterimTranscript(accumulatedTextRef.current);
        }

        // Reset 1.2s silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        silenceTimerRef.current = setTimeout(() => {
          const fullText = (accumulatedTextRef.current || interim).trim();
          if (fullText) {
            onSpeechFinal(fullText);
            accumulatedTextRef.current = '';
            setInterimTranscript('');
          }
        }, 1200);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('[VoiceListener] SpeechRecognition error:', event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (enabled) {
          try {
            recognition.start();
          } catch {
            // Already restarted
          }
        }
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch (err) {
        console.warn('[VoiceListener] Start error:', err);
      }
    }

    startAudioMeter();

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, [enabled, lang]);

  const triggerManualUtterance = useCallback(
    (text: string) => {
      onSpeechFinal(text);
    },
    [onSpeechFinal]
  );

  return {
    isListening,
    interimTranscript,
    volumeLevel,
    micAvailable,
    triggerManualUtterance,
  };
}
