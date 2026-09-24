import json

from fastapi.testclient import TestClient

from app.catalog import CATALOG_PATH, load_places
from app.main import app
from app.routing import haversine_m
from app.settings import get_settings


def test_real_seed_has_localized_nearby_places_and_traceable_sources():
    places = load_places()
    assert 10 <= len(places) <= 20
    assert len({place.id for place in places}) == len(places)
    settings = get_settings()
    for place in places:
        assert haversine_m(settings.origin_lat, settings.origin_lng, place.lat, place.lng) < 1500
        assert set(place.texts) == {'kk', 'ru', 'en'}
        assert place.thumb_url.startswith('/static/')

    provenance = json.loads((CATALOG_PATH.parent / 'provenance.json').read_text(encoding='utf-8'))
    assert {item['id'] for item in provenance['places']} == {place.id for place in places}
    assert all(item['urls'] and all('/node/' in url or '/way/' in url or '/org/' in url
                                    or 'gov.kz/' in url for url in item['urls'])
               for item in provenance['places'])

    client = TestClient(app)
    config = client.get('/api/config')
    assert config.status_code == 200
    assert config.json()['origin'] == {'lat': 43.6582, 'lng': 51.1352, 'heading_deg': 45.0}
    assert config.json()['default_lang'] == 'kk'
    listed = client.get('/api/places', params={'lang': 'kk', 'limit': 5})
    assert listed.status_code == 200
    assert listed.json()['total'] == len(places)
    assert len(listed.json()['places']) == 5
    assert client.get('/api/places', params={'lang': 'ru', 'q': 'Құдықшылар'}).json()['total'] == 1
    assert client.get('/api/places', params={'categories': 'nature,park'}).json()['total'] == 4
    assert client.get('/api/places', params={'bbox': '51.132,43.658,51.136,43.663'}).json()['total'] >= 3
    for place in places:
        card = client.get(f'/api/places/{place.id}', params={'lang': 'en'})
        assert card.status_code == 200
        assert card.json()['name'] == place.texts['en'].name
        thumb = client.get(place.thumb_url)
        assert thumb.status_code == 200
        assert 'image/svg+xml' in thumb.headers['content-type']
