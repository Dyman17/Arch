import json
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

from pydantic import BaseModel, Field


CATALOG_PATH = Path(__file__).resolve().parents[2] / 'data' / 'places' / 'places.json'
LANGUAGES = ('kk', 'ru', 'en')


class LocalizedText(BaseModel):
    name: str
    summary: str
    description: str
    address: str = ''


class Hours(BaseModel):
    open: str
    close: str
    days: list[int]
    tz: str = 'Asia/Almaty'


class SceneText(BaseModel):
    title: str
    body: str


class Scene(BaseModel):
    modern_url: str
    historic_url: str
    attribution: str
    texts: dict[str, SceneText]
    sources: list[str]


class Place(BaseModel):
    id: int
    category: str
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    thumb_url: str = ''
    photos: list[str] = Field(default_factory=list)
    hours: Hours | None = None
    access: str = Field(pattern='^(walk|transit)$')
    texts: dict[str, LocalizedText]
    scene: Scene | None = None


def load_places() -> list[Place]:
    if not CATALOG_PATH.exists():
        return []
    raw = json.loads(CATALOG_PATH.read_text(encoding='utf-8'))
    places = [Place.model_validate(item) for item in raw]
    ids = [place.id for place in places]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate place id')
    for place in places:
        if not set(LANGUAGES).issubset(place.texts):
            raise ValueError(f'Place {place.id} lacks required translations')
        if place.scene and not set(LANGUAGES).issubset(place.scene.texts):
            raise ValueError(f'Scene {place.id} lacks required translations')
    return places


def local_text(place: Place, lang: str) -> LocalizedText:
    return place.texts[lang]


def opening_state(hours: Hours | None, now: datetime | None = None) -> tuple[bool, str | None]:
    if hours is None:
        return True, None
    local_now = (now or datetime.now(ZoneInfo(hours.tz))).astimezone(ZoneInfo(hours.tz))
    opening = datetime.strptime(hours.open, '%H:%M').time()
    closing = datetime.strptime(hours.close, '%H:%M').time()
    if local_now.isoweekday() in hours.days and opening <= local_now.time() < closing:
        return True, hours.open
    for offset in range(8):
        day = local_now + timedelta(days=offset)
        if day.isoweekday() in hours.days and (offset > 0 or local_now.time() < opening):
            return False, hours.open
    return False, None
