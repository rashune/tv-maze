import type { Show } from '../types/show'

function ratingValue(show: Show): number {
  return show.rating ?? -1
}

export function sortByRatingDesc(shows: Show[]): Show[] {
  return [...shows].sort((first, second) => ratingValue(second) - ratingValue(first))
}

export function groupShowsByGenre(shows: Show[]): Record<string, Show[]> {
  const grouped: Record<string, Show[]> = {}

  for (const show of shows) {
    if (show.genres.length === 0) {
      if (!grouped.Uncategorized) {
        grouped.Uncategorized = []
      }
      grouped.Uncategorized.push(show)
      continue
    }

    for (const genre of show.genres) {
      if (!grouped[genre]) {
        grouped[genre] = []
      }
      grouped[genre].push(show)
    }
  }

  for (const genre of Object.keys(grouped)) {
    const bucket = grouped[genre]
    if (bucket) {
      grouped[genre] = sortByRatingDesc(bucket)
    }
  }

  return grouped
}

export function searchShowsByName(shows: Show[], query: string): Show[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return shows
  }

  return shows.filter((show) => show.name.toLowerCase().includes(normalizedQuery))
}
