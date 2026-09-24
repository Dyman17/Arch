import io
import json

from fastapi.testclient import TestClient

from app import catalog, main, routing
from app.routing import RouteUnavailable


def sample_place(place_id: int, name: str, category: str, lng: float) -> dict:
    words = {lang: {'name': name, 'summary': f'{name} summary',
                    'description': f'{name} description', 'address': 'Aktau'}
             for lang in ('kk', 'ru', 'en')}
    return {'id': place_id, 'category': category, 'lat': 43.65, 'lng': lng,
            'thumb_url': '/static/places/placeholder.svg',
            'photos': ['/static/places/placeholder.svg'], 'hours': None,
            'access': 'walk', 'texts': words}


def test_config_and_catalog_contract(tmp_path, monkeypatch):
    path = tmp_path / 'places.json'
    path.write_text(json.dumps([
        sample_place(1, 'Набережная', 'park', 51.18),
        sample_place(2, 'Базар', 'market', 51.19),
    ], ensure_ascii=False), encoding='utf-8')
    monkeypatch.setattr(catalog, 'CATALOG_PATH', path)
    client = TestClient(main.app)

    assert client.get('/api/config').json() == {
        'screen_id': 'AKTAU-EMB-01',
        'origin': {'lat': 43.6582, 'lng': 51.1352, 'heading_deg': 45.0},
        'languages': ['kk', 'ru', 'en'], 'default_lang': 'kk',
        'modes': {'voice': True, 'tarihsky': True, 'qr': True, 'huskylens': False},
        'session': {'idle_timeout_sec': 90, 'qr_timeout_sec': 60},
        'district': 'aktau-15-mkr',
        'categories': ['park', 'mall', 'market', 'history', 'nature', 'religion', 'culture'],
    }

    listed = client.get('/api/places', params={'q': 'Наб', 'categories': 'park,market'})
    assert listed.status_code == 200
    assert listed.json()['lang'] == 'ru'
    assert listed.json()['total'] == 1
    assert listed.json()['places'][0]['id'] == 1
    assert client.get('/api/places', params={'categories': 'culture'}).json()['total'] == 0
    assert client.get('/api/places', params={'lang': 'zh'}).json()['places'][0]['name'] == 'Набережная'
    assert client.get('/api/places', params={'limit': 0}).json()['error']['code'] == 'BAD_REQUEST'
    assert client.get('/api/places', params={'bbox': 'bad'}).status_code == 400
    assert client.get('/api/places', params={'bbox': 'nan,0,1,1'}).status_code == 400

    card = client.get('/api/places/1')
    assert card.status_code == 200
    assert card.json()['is_open_now'] is True
    assert card.json()['opens_next'] is None
    assert card.json()['langs'] == ['kk', 'ru', 'en']
    assert client.get('/api/places/1', params={'lang': 'zh'}).status_code == 200
    missing = client.get('/api/places/9', params={'lang': 'kk'})
    assert missing.status_code == 404
    assert missing.json()['error']['lang'] == 'kk'


def test_route_fallback_and_provider_error(tmp_path, monkeypatch):
    path = tmp_path / 'places.json'
    path.write_text(json.dumps([sample_place(1, 'Набережная', 'park', 51.18)],
                               ensure_ascii=False), encoding='utf-8')
    monkeypatch.setattr(catalog, 'CATALOG_PATH', path)
    client = TestClient(main.app)

    approximate = client.get('/api/places/1/route', params={'fallback': 1})
    assert approximate.status_code == 200
    route = approximate.json()
    assert route['is_approximate'] is True
    assert route['geometry']['coordinates'][0] == [51.1352, 43.6582]
    assert 0 <= route['bearing_deg'] < 360

    def failed_route(*_args):
        raise RouteUnavailable()

    monkeypatch.setattr(main, 'routed_walk', failed_route)
    failed = client.get('/api/places/1/route')
    assert failed.status_code == 503
    assert failed.json()['error']['code'] == 'ROUTE_UNAVAILABLE'
    assert failed.json()['error']['lang'] == 'ru'
    assert client.get('/api/places/1/route', params={'mode': 'bad'}).status_code == 400
    assert client.get('/api/places/9/route').status_code == 404


def test_public_routing_demo_is_marked_approximate(tmp_path, monkeypatch):
    path = tmp_path / 'places.json'
    path.write_text(json.dumps([sample_place(1, 'Набережная', 'park', 51.18)],
                               ensure_ascii=False), encoding='utf-8')
    monkeypatch.setattr(catalog, 'CATALOG_PATH', path)
    payload = {'code': 'Ok', 'routes': [{
        'distance': 1600, 'duration': 180,
        'geometry': {'type': 'LineString', 'coordinates': [[51.14, 43.66], [51.175, 43.651]]},
    }]}
    monkeypatch.setattr(routing, 'urlopen',
                        lambda *_args, **_kwargs: io.BytesIO(json.dumps(payload).encode()))

    response = TestClient(main.app).get('/api/places/1/route')
    assert response.status_code == 200
    route = response.json()
    assert route['is_approximate'] is True
    assert route['duration_min'] > 20  # connectors plus the walking estimate
    assert route['geometry']['coordinates'][0] == [51.1352, 43.6582]
    assert route['geometry']['coordinates'][-1] == [51.18, 43.65]
    assert route['steps'][0]['distance_m'] == route['distance_m']
