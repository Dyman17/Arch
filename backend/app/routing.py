import json
import math
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

from .catalog import Place
from .settings import Settings


class RouteUnavailable(Exception):
    pass


def bearing_deg(lat1: float, lng1: float, lat2: float, lng2: float) -> int:
    a, b = math.radians(lat1), math.radians(lat2)
    delta = math.radians(lng2 - lng1)
    y = math.sin(delta) * math.cos(b)
    x = math.cos(a) * math.sin(b) - math.sin(a) * math.cos(b) * math.cos(delta)
    return round((math.degrees(math.atan2(y, x)) + 360) % 360) % 360


def haversine_m(lat1: float, lng1: float, lat2: float, lng2: float) -> int:
    a, b = math.radians(lat1), math.radians(lat2)
    dlat, dlng = b - a, math.radians(lng2 - lng1)
    h = math.sin(dlat / 2) ** 2 + math.cos(a) * math.cos(b) * math.sin(dlng / 2) ** 2
    return round(6371000 * 2 * math.asin(math.sqrt(h)))


def direction_text(bearing: int) -> str:
    names = ('север', 'северо-восток', 'восток', 'юго-восток', 'юг', 'юго-запад', 'запад', 'северо-запад')
    return 'идите на ' + names[round(bearing / 45) % 8]


def approximate_route(place: Place, settings: Settings, mode: str) -> dict:
    distance = haversine_m(settings.origin_lat, settings.origin_lng, place.lat, place.lng)
    bearing = bearing_deg(settings.origin_lat, settings.origin_lng, place.lat, place.lng)
    return {
        'place_id': place.id,
        'mode': mode,
        'distance_m': distance,
        'duration_min': max(1, round(distance / 80)),
        'bearing_deg': bearing,
        'direction_text': direction_text(bearing),
        'is_approximate': True,
        'geometry': {'type': 'LineString', 'coordinates': [
            [settings.origin_lng, settings.origin_lat], [place.lng, place.lat]
        ]},
        'steps': [{'instruction': 'Примерное направление до места', 'distance_m': distance}],
    }


def routed_walk(place: Place, settings: Settings) -> dict:
    url = (f'{settings.osrm_base_url}/route/v1/foot/'
           f'{settings.origin_lng},{settings.origin_lat};{place.lng},{place.lat}'
           '?overview=full&geometries=geojson&steps=true')
    try:
        with urlopen(url, timeout=5) as response:
            payload = json.load(response)
        if payload.get('code') != 'Ok' or not payload.get('routes'):
            raise RouteUnavailable()
        route = payload['routes'][0]
        geometry = route['geometry']
        if geometry.get('type') != 'LineString' or len(geometry.get('coordinates', [])) < 2:
            raise RouteUnavailable()
        public_demo = settings.osrm_base_url == 'https://router.project-osrm.org'
        distance = round(route['distance'])
        steps = []
        if public_demo:
            # The public demo accepts /foot but currently returns driving timings.
            # It also snaps both ends to roads, so include the kiosk and place explicitly.
            coordinates = geometry['coordinates']
            start = [settings.origin_lng, settings.origin_lat]
            end = [place.lng, place.lat]
            distance += haversine_m(settings.origin_lat, settings.origin_lng,
                                    coordinates[0][1], coordinates[0][0])
            distance += haversine_m(coordinates[-1][1], coordinates[-1][0],
                                    place.lat, place.lng)
            geometry = {'type': 'LineString', 'coordinates': [start, *coordinates, end]}
            steps = [{'instruction': 'Примерный путь по дорогам', 'distance_m': distance}]
        else:
            for leg in route.get('legs', []):
                for step in leg.get('steps', []):
                    maneuver = step.get('maneuver', {})
                    label = maneuver.get('type', 'continue')
                    street = step.get('name', '')
                    steps.append({'instruction': f'{label}: {street}'.strip(': '),
                                  'distance_m': round(step.get('distance', 0))})
        bearing = bearing_deg(settings.origin_lat, settings.origin_lng, place.lat, place.lng)
        return {
            'place_id': place.id,
            'mode': 'walk',
            'distance_m': distance,
            'duration_min': max(1, round(distance / 80)) if public_demo
                            else max(1, round(route['duration'] / 60)),
            'bearing_deg': bearing,
            'direction_text': direction_text(bearing),
            'is_approximate': public_demo,
            'geometry': geometry,
            'steps': steps,
        }
    except (HTTPError, URLError, TimeoutError, OSError, ValueError, KeyError, TypeError) as exc:
        raise RouteUnavailable() from exc
