import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useResponsiveImageSource } from './useResponsiveImageSource'

interface MatchMediaControl {
  matches: boolean
}

function mockMatchMedia(initialMatches: boolean): MatchMediaControl {
  const mediaQueryList = {
    matches: initialMatches,
    media: '(min-width: 992px)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => mediaQueryList),
  })

  return {
    matches: initialMatches,
  }
}

function mountComposable(mobile: string | null, desktop: string | null) {
  const mobileRef = ref<string | null>(mobile)
  const desktopRef = ref<string | null>(desktop)

  const TestComponent = defineComponent({
    setup() {
      const { src } = useResponsiveImageSource(mobileRef, desktopRef)
      return { src }
    },
    template: '<div>{{ src ?? "" }}</div>',
  })

  return mount(TestComponent)
}

describe('useResponsiveImageSource', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses mobile source when media query does not match', async () => {
    mockMatchMedia(false)
    const wrapper = mountComposable('mobile.jpg', 'desktop.jpg')
    await nextTick()

    expect(wrapper.text()).toBe('mobile.jpg')
  })

  it('uses desktop source when media query matches', async () => {
    mockMatchMedia(true)
    const wrapper = mountComposable('mobile.jpg', 'desktop.jpg')
    await nextTick()

    expect(wrapper.text()).toBe('desktop.jpg')
  })

  it('falls back to available source when preferred source is missing', async () => {
    mockMatchMedia(false)
    const wrapper = mountComposable(null, 'desktop.jpg')
    await nextTick()

    expect(wrapper.text()).toBe('desktop.jpg')
  })

})
