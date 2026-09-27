# BaGdar backend — B2 catalog and routes

## Local run

From `backend/`:

```powershell
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
.venv/Scripts/python -m uvicorn app.main:app --port 8000
```

Run checks with `.venv/Scripts/python -m pytest tests -q`.

This branch implements `GET /api/config`, `GET /api/places`,
`GET /api/places/{id}`, and `GET /api/places/{id}/route` from
`docs/api/backend.md`. The catalog comes from `data/places/places.json`.
It currently contains ten places near the amphitheater. Direct map and
reference links are in `data/places/provenance.json`. Names, access,
translations, and exact entrances still need a local team check. Place images
use a labeled SVG placeholder until usable photographs are approved.

The kiosk settings are `AKTAU-EMB-01`, `43.6582, 51.1352`, heading `45`,
district code `aktau-15-mkr`, and languages `kk`, `ru`, `en` with `kk` as the
kiosk default. The places endpoint defaults to `ru` as required by the API
contract. Other requested languages currently use Russian catalog text until
the translation task is implemented. Verify the screen heading on site.

The public OSRM demo endpoint currently returns the same timing for `foot` and
`driving`. The API labels its geometry and estimated walking time as approximate.
If routing fails, the UI should retry with `fallback=1` for a straight line.

Voice/dialog, scenes, QR, events, and admin endpoints belong to later tasks.
