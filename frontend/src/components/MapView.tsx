import { useEffect } from 'react'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import type { Config, Place, PlaceSummary, Route } from '../types'

interface Props {
  config: Config
  places: PlaceSummary[]
  selected?: Place | null
  route?: Route | null
}

function Viewport({ config, selected, route }: Pick<Props, 'config' | 'selected' | 'route'>) {
  const map = useMap()

  useEffect(() => {
    if (route?.geometry.coordinates.length) {
      map.fitBounds(route.geometry.coordinates.map(([lng, lat]) => [lat, lng]), { padding: [70, 70], maxZoom: 16 })
    } else if (selected) {
      map.flyTo([selected.lat, selected.lng], 15, { duration: 1.4 })
    } else {
      map.setView([config.origin.lat, config.origin.lng], 12)
    }
  }, [config, map, route, selected])

  return null
}

export function MapView({ config, places, selected, route }: Props) {
  const line = route?.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]) ?? []

  return (
    <MapContainer
      className="map"
      center={[config.origin.lat, config.origin.lng]}
      zoom={12}
      minZoom={7}
      zoomControl={false}
      attributionControl={false}
      keyboard={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker interactive={false} center={[config.origin.lat, config.origin.lng]} radius={9} pathOptions={{ color: '#de9f2c', fillColor: '#f3ead6', fillOpacity: 1, weight: 3 }}>
        <Popup>BaGdar · {config.screen_id}</Popup>
      </CircleMarker>
      {places.map((place) => (
        <CircleMarker
          key={place.id}
          interactive={false}
          center={[place.lat, place.lng]}
          radius={selected?.id === place.id ? 12 : 7}
          pathOptions={{ color: selected?.id === place.id ? '#de9f2c' : '#f3ead6', fillColor: '#1d614d', fillOpacity: 1, weight: 2 }}
        >
          <Popup>{place.name}</Popup>
        </CircleMarker>
      ))}
      {line.length > 1 && <Polyline interactive={false} positions={line} pathOptions={{ color: '#de9f2c', weight: 6, opacity: 1 }} />}
      <Viewport config={config} selected={selected} route={route} />
    </MapContainer>
  )
}
