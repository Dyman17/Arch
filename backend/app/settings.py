import os
from dataclasses import dataclass
from pathlib import Path


def load_env() -> None:
    path = Path(__file__).resolve().parents[1] / '.env'
    if not path.exists():
        return
    for line in path.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


@dataclass(frozen=True)
class Settings:
    screen_id: str
    origin_lat: float
    origin_lng: float
    heading_deg: float
    district: str
    osrm_base_url: str


def get_settings() -> Settings:
    load_env()
    return Settings(
        screen_id=os.getenv('SCREEN_ID', 'AKTAU-EMB-01'),
        origin_lat=float(os.getenv('ORIGIN_LAT', '43.6582')),
        origin_lng=float(os.getenv('ORIGIN_LNG', '51.1352')),
        heading_deg=float(os.getenv('ORIGIN_HEADING_DEG', '45')),
        district=os.getenv('DISTRICT', 'aktau-15-mkr'),
        osrm_base_url=os.getenv('OSRM_BASE_URL', 'https://router.project-osrm.org').rstrip('/'),
    )
