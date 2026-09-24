import math
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from .catalog import LANGUAGES, Place, load_places, local_text, opening_state
from .errors import api_error
from .routing import RouteUnavailable, approximate_route, routed_walk
from .settings import get_settings


app = FastAPI(title='BaGdar API', version='0.1.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])
app.mount('/static', StaticFiles(directory=Path(__file__).resolve().parents[1] / 'static'), name='static')

CATEGORIES = ['park', 'mall', 'market', 'history', 'nature', 'religion', 'culture']


def error_lang(request: Request) -> str:
    return request.query_params.get('lang') or 'ru'


@app.exception_handler(HTTPException)
async def http_error(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict) and 'error' in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(status_code=exc.status_code, content={
        'error': {'code': 'BAD_REQUEST' if exc.status_code < 500 else 'INTERNAL',
                  'message': str(exc.detail), 'lang': error_lang(request), 'details': {}}
    })


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=400, content={
        'error': {'code': 'BAD_REQUEST', 'message': 'Неверные параметры запроса',
                  'lang': error_lang(request),
                  'details': {'fields': ['.'.join(str(part) for part in error['loc'])
                                         for error in exc.errors()]}}
    })


@app.exception_handler(Exception)
async def unexpected_error(request: Request, _exc: Exception):
    return JSONResponse(status_code=500, content={
        'error': {'code': 'INTERNAL', 'message': 'Внутренняя ошибка',
                  'lang': error_lang(request), 'details': {}}
    })


def places(lang: str = 'ru') -> list[Place]:
    try:
        return load_places()
    except (ValueError, OSError):
        raise api_error(500, 'INTERNAL', 'Каталог недоступен', lang=lang)


def place_by_id(place_id: int, lang: str = 'ru') -> Place:
    for place in places(lang):
        if place.id == place_id:
            return place
    raise api_error(404, 'PLACE_NOT_FOUND', 'Место не найдено', lang=lang)


def text_for(place: Place, lang: str):
    # B1.1 will move this fallback into catalog.local_text for all callers.
    return local_text(place, lang if lang in LANGUAGES else 'ru')


@app.get('/api/config')
def config():
    settings = get_settings()
    return {
        'screen_id': settings.screen_id,
        'origin': {'lat': settings.origin_lat, 'lng': settings.origin_lng,
                   'heading_deg': settings.heading_deg},
        'languages': list(LANGUAGES),
        'default_lang': 'kk',
        'modes': {'voice': True, 'tarihsky': True, 'qr': True, 'huskylens': False},
        'session': {'idle_timeout_sec': 90, 'qr_timeout_sec': 60},
        'district': settings.district,
        'categories': CATEGORIES,
    }


@app.get('/api/places')
def list_places(lang: str = 'ru', bbox: str | None = None, limit: int = 50,
                q: str | None = None, categories: str | None = None):
    if not lang.strip() or not 1 <= limit <= 100:
        raise api_error(400, 'BAD_REQUEST', 'Некорректный язык или limit', lang=lang or 'ru')
    bounds = None
    if bbox:
        try:
            bounds = [float(value) for value in bbox.split(',')]
            if (len(bounds) != 4 or not all(math.isfinite(value) for value in bounds)
                    or bounds[0] > bounds[2] or bounds[1] > bounds[3]
                    or not -180 <= bounds[0] <= 180 or not -180 <= bounds[2] <= 180
                    or not -90 <= bounds[1] <= 90 or not -90 <= bounds[3] <= 90):
                raise ValueError()
        except ValueError:
            raise api_error(400, 'BAD_REQUEST', 'Некорректный bbox', lang=lang)
    selected = {value.strip() for value in categories.split(',') if value.strip()} if categories else None
    result = []
    for place in places(lang):
        if bounds and not (bounds[0] <= place.lng <= bounds[2] and bounds[1] <= place.lat <= bounds[3]):
            continue
        if selected and place.category not in selected:
            continue
        if q and not any(q.casefold() in (words.name + ' ' + words.description).casefold()
                         for words in place.texts.values()):
            continue
        words = text_for(place, lang)
        result.append({
            'id': place.id, 'name': words.name, 'summary': words.summary,
            'category': place.category, 'lat': place.lat, 'lng': place.lng,
            'thumb_url': place.thumb_url, 'has_scene': place.scene is not None,
            'hours': place.hours.model_dump() if place.hours else None, 'access': place.access,
        })
    return {'places': result[:limit], 'total': len(result), 'lang': lang}


@app.get('/api/places/{place_id}')
def get_place(place_id: int, lang: str = 'ru'):
    if not lang.strip():
        raise api_error(400, 'BAD_REQUEST', 'Некорректный язык')
    place = place_by_id(place_id, lang)
    words = text_for(place, lang)
    is_open, opens_next = opening_state(place.hours)
    return {
        'id': place.id, 'name': words.name, 'summary': words.summary,
        'description': words.description, 'category': place.category,
        'lat': place.lat, 'lng': place.lng, 'address': words.address,
        'photos': place.photos, 'hours': place.hours.model_dump() if place.hours else None,
        'is_open_now': is_open, 'opens_next': opens_next,
        'has_scene': place.scene is not None, 'access': place.access,
        'langs': list(LANGUAGES),
    }


@app.get('/api/places/{place_id}/route')
def get_route(place_id: int, mode: str = 'walk', fallback: int = 0):
    place = place_by_id(place_id)
    if mode not in ('walk', 'transit') or fallback not in (0, 1):
        raise api_error(400, 'BAD_REQUEST', 'Некорректный режим маршрута')
    settings = get_settings()
    if fallback:
        return approximate_route(place, settings, mode)
    if mode == 'transit':
        raise api_error(503, 'ROUTE_UNAVAILABLE', 'Транзитный маршрут пока недоступен')
    try:
        return routed_walk(place, settings)
    except RouteUnavailable:
        raise api_error(503, 'ROUTE_UNAVAILABLE', 'Сервис маршрутов недоступен')
