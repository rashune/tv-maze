import type { RawShow, Show } from '../types/show'

const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'https://api.tvmaze.com'
const SHOWS_SOURCE_URL = `${BASE_URL}/shows`

let showsCache: Show[] | null = null
let inFlightRequest: Promise<Show[]> | null = null

function mapRawShow(rawShow: RawShow): Show {
  return {
    id: rawShow.id,
    name: rawShow.name,
    genres: rawShow.genres ?? [],
    status: rawShow.status,
    rating: rawShow.rating?.average ?? null,
    imageUrl: rawShow.image?.medium ?? rawShow.image?.original ?? null,
    originalImageUrl: rawShow.image?.original ?? rawShow.image?.medium ?? null,
    summaryHtml: rawShow.summary ?? '',
    language: rawShow.language ?? null,
    runtime: rawShow.runtime ?? null,
    premiered: rawShow.premiered ?? null,
  }
}

export async function fetchShows(forceRefresh = false): Promise<Show[]> {
  if (showsCache && !forceRefresh) {
    return showsCache
  }

  if (inFlightRequest && !forceRefresh) {
    return inFlightRequest
  }

  inFlightRequest = fetch(SHOWS_SOURCE_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch shows: ${response.status}`)
      }

      const payload = (await response.json()) as RawShow[]
      const mapped = payload.map(mapRawShow)
      showsCache = mapped
      return mapped
    })
    .finally(() => {
      inFlightRequest = null
    })

  return inFlightRequest
}

export function clearShowsCache(): void {
  showsCache = null
  inFlightRequest = null
}
