import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRouteScrollMemory } from './useRouteScrollMemory'

const mocks = vi.hoisted(() => ({
  saveMock: vi.fn(),
  consumeMock: vi.fn(),
  onBeforeRouteLeaveMock: vi.fn(),
}))

vi.mock('../utils/scrollMemory', () => ({
  createScrollMemory: vi.fn(() => ({
    save: mocks.saveMock,
    consume: mocks.consumeMock,
  })),
}))

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: mocks.onBeforeRouteLeaveMock,
}))

function createTestComponent(readyValue: boolean) {
  const ready = ref(readyValue)

  const component = defineComponent({
    setup() {
      useRouteScrollMemory('dashboard', { ready })
      return () => h('div')
    },
  })

  return { component, ready }
}

async function flushComposableWork(): Promise<void> {
  await nextTick()
  await nextTick()
}

describe('useRouteScrollMemory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.consumeMock.mockReturnValue(null)

    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    })

    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0)
        return 1
      },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('restores saved position on mount when ready is true', async () => {
    mocks.consumeMock.mockReturnValue(420)
    const { component } = createTestComponent(true)

    mount(component)
    await flushComposableWork()

    expect(mocks.consumeMock).toHaveBeenCalledTimes(1)
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 420, behavior: 'auto' })
  })

  it('waits for ready state before restoring', async () => {
    mocks.consumeMock.mockReturnValue(240)
    const { component, ready } = createTestComponent(false)

    mount(component)
    await flushComposableWork()
    expect(mocks.consumeMock).not.toHaveBeenCalled()

    ready.value = true
    await flushComposableWork()

    expect(mocks.consumeMock).toHaveBeenCalledTimes(1)
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 240, behavior: 'auto' })
  })

  it('saves current scroll position when leaving route', () => {
    const { component } = createTestComponent(true)
    mount(component)

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 333,
    })

    const firstCall = mocks.onBeforeRouteLeaveMock.mock.calls[0]
    const leaveHandler = firstCall ? firstCall[0] : undefined
    expect(leaveHandler).toBeTypeOf('function')
    if (typeof leaveHandler === 'function') {
      leaveHandler()
    }

    expect(mocks.saveMock).toHaveBeenCalledWith(333)
  })

  it('restores only once even if ready toggles multiple times', async () => {
    mocks.consumeMock.mockReturnValue(100)
    const { component, ready } = createTestComponent(false)

    mount(component)
    ready.value = true
    await flushComposableWork()

    ready.value = false
    ready.value = true
    await flushComposableWork()

    expect(mocks.consumeMock).toHaveBeenCalledTimes(1)
  })
})
