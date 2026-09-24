import type {
  ApiErrorPayload,
  Config,
  DialogResponse,
  Place,
  PlacesResponse,
  QrResponse,
  Route,
  Scene,
  VoiceTurn,
} from './types'

const BASE_URL = '/api'
const CATALOG_CACHE_KEY = 'bagdar:catalog:v1'

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details: Record<string, unknown> = {},
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null
      throw new ApiError(
        response.status,
        payload?.error.code ?? 'INTERNAL',
        payload?.error.message ?? `HTTP ${response.status}`,
        payload?.error.details,
      )
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(0, 'NETWORK_UNAVAILABLE', 'Нет соединения с сервером')
  }
}

export const api = {
  config: () => request<Config>('/config'),

  async places(lang: string): Promise<PlacesResponse> {
    try {
      const result = await request<PlacesResponse>(`/places?lang=${encodeURIComponent(lang)}`)
      localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(result))
      return result
    } catch (error) {
      const cached = localStorage.getItem(CATALOG_CACHE_KEY)
      if (cached) return JSON.parse(cached) as PlacesResponse
      throw error
    }
  },

  place: (id: number, lang: string) =>
    request<Place>(`/places/${id}?lang=${encodeURIComponent(lang)}`),

  route: (id: number, mode: 'walk' | 'transit', fallback = false) =>
    request<Route>(`/places/${id}/route?mode=${mode}&fallback=${fallback ? 1 : 0}`),

  dialog: (sessionId: string, turn: VoiceTurn, screen: string, lastPlaceId: number | null) =>
    request<DialogResponse>('/dialog/turn', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        lang: 'auto',
        ...turn,
        context: { screen, last_place_id: lastPlaceId },
      }),
    }),

  scene: (id: number) => request<Scene>(`/places/${id}/scene`),

  qr: (placeId: number, lang: string, sessionId: string) =>
    request<QrResponse>('/qr', {
      method: 'POST',
      body: JSON.stringify({ place_id: placeId, lang, session_id: sessionId }),
    }),

  event: (sessionId: string, type: string, lang: string, placeId: number | null = null) =>
    request<{ ok: true }>('/event', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, type, place_id: placeId, lang }),
    }),

  endSession: (sessionId: string) =>
    request<{ ok: true }>('/session/end', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }),
}
