const KEY_PREFIX = 'scroll-y:'

function buildStorageKey(key: string): string {
  return `${KEY_PREFIX}${key}`
}

export function saveScrollPosition(key: string, position: number): void {
  try {
    sessionStorage.setItem(buildStorageKey(key), String(Math.max(0, Math.floor(position))))
  } catch {
    // Ignore storage errors and keep navigation functional.
  }
}

export function consumeScrollPosition(key: string): number | null {
  try {
    const storageKey = buildStorageKey(key)
    const rawValue = sessionStorage.getItem(storageKey)
    if (!rawValue) {
      return null
    }

    sessionStorage.removeItem(storageKey)
    const parsedValue = Number(rawValue)

    return Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : null
  } catch {
    return null
  }
}

export function createScrollMemory(key: string): {
  save: (position: number) => void
  consume: () => number | null
} {
  return {
    save: (position: number) => saveScrollPosition(key, position),
    consume: () => consumeScrollPosition(key),
  }
}
