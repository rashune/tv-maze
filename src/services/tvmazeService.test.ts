import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearShowsCache, fetchShows } from './tvmazeService'
import type { RawShow } from '../types/show'

const rawShowsFixture: RawShow[] = [
  {
    id: 101,
    name: 'Example Show',
    genres: ['Drama'],
    status: 'Running',
    rating: { average: 8.1 },
    image: { medium: 'https://img.test/medium.jpg', original: 'https://img.test/original.jpg' },
    summary: '<p>Summary</p>',
    language: 'English',
    runtime: 60,
    premiered: '2024-01-01',
  },
  {
    id: 102,
    name: 'No Extras',
    genres: [],
    status: 'Ended',
    rating: { average: null },
    image: null,
    summary: null,
    language: null,
    runtime: null,
    premiered: null,
  },
]

function okResponse(payload: RawShow[]): Response {
  return {
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue(payload),
  } as unknown as Response
}

function failedResponse(status: number): Response {
  return {
    ok: false,
    status,
    json: vi.fn(),
  } as unknown as Response
}

describe('tvmazeService', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    clearShowsCache()
    vi.restoreAllMocks()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('maps raw shows into app show model', async () => {
    fetchMock.mockResolvedValueOnce(okResponse(rawShowsFixture))

    const shows = await fetchShows()

    expect(shows).toEqual([
      {
        id: 101,
        name: 'Example Show',
        genres: ['Drama'],
        status: 'Running',
        rating: 8.1,
        imageUrl: 'https://img.test/medium.jpg',
        summaryHtml: '<p>Summary</p>',
        language: 'English',
        runtime: 60,
        premiered: '2024-01-01',
      },
      {
        id: 102,
        name: 'No Extras',
        genres: [],
        status: 'Ended',
        rating: null,
        imageUrl: null,
        summaryHtml: '',
        language: null,
        runtime: null,
        premiered: null,
      },
    ])
  })

  it('uses cache on repeated calls', async () => {
    fetchMock.mockResolvedValueOnce(okResponse(rawShowsFixture))

    const first = await fetchShows()
    const second = await fetchShows()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(second).toBe(first)
  })

  it('deduplicates concurrent non-refresh requests', async () => {
    fetchMock.mockResolvedValue(okResponse(rawShowsFixture))

    const [first, second] = await Promise.all([fetchShows(), fetchShows()])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(second).toBe(first)
  })

  it('bypasses cache when forceRefresh is true', async () => {
    fetchMock.mockResolvedValue(okResponse(rawShowsFixture))

    await fetchShows()
    await fetchShows(true)

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('throws a status error when response is not ok', async () => {
    fetchMock.mockResolvedValueOnce(failedResponse(503))

    await expect(fetchShows()).rejects.toThrow('Failed to fetch shows: 503')
  })
})
