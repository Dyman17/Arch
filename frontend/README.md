# BaGdar frontend

Voice-first kiosk interface for the BaGdar tourist guide. The frontend follows the frozen contracts in `docs/api/` and does not call routing, STT, or LLM providers directly.

## Run

```bash
npm install
npm run dev
```

Vite proxies `/api` and `/static` to `http://localhost:8000` in development.

## Checks

```bash
npm run check
npm run build
```

## Kiosk behaviour

- sound above −42 dBFS wakes the idle screen;
- speech above −30 dBFS starts a turn and 1.2 seconds of silence ends it;
- Web Speech supplies text when supported, otherwise MediaRecorder sends `audio_b64`;
- the backend controls screens through ordered `actions` from `/api/dialog/turn`;
- session and QR timeouts come from `/api/config`;
- the last catalogue response is cached for the offline fallback.
