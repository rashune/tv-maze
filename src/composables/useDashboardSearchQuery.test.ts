import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent, nextTick, type Ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { horizontalScrollResetKey } from '../injectionKeys'
import { useDashboardSearchQuery } from './useDashboardSearchQuery'

const Host = defineComponent({
  setup() {
    const { searchQuery } = useDashboardSearchQuery()
    return { searchQuery }
  },
  template: `
    <div>
      <input v-model="searchQuery" class="query-input" />
      <p class="query-value">{{ searchQuery }}</p>
    </div>
  `,
})

async function flushComposableWork(): Promise<void> {
  await Promise.resolve()
  await nextTick()
  await nextTick()
}

async function mountWithInitialQuery(initialQuery: string | null) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: Host },
      { path: '/show/:id', name: 'show-detail', component: Host },
    ],
  })

  await router.push({
    name: 'dashboard',
    query: initialQuery ? { q: initialQuery } : {},
  })
  await router.isReady()

  const wrapper = mount(Host, {
    global: {
      plugins: [router],
    },
  })

  await flushComposableWork()
  return { wrapper, router }
}

function providedResetToken(wrapper: { vm: { $: unknown } }): Ref<number> {
  const provides = (wrapper.vm.$ as unknown as { provides: Record<PropertyKey, unknown> }).provides
  return provides[horizontalScrollResetKey as symbol] as Ref<number>
}

describe('useDashboardSearchQuery', () => {
  it('initializes searchQuery from route query param', async () => {
    const { wrapper } = await mountWithInitialQuery('office')

    expect((wrapper.find('.query-input').element as HTMLInputElement).value).toBe('office')
    expect(wrapper.find('.query-value').text()).toBe('office')
  })

  it('writes search updates to route query', async () => {
    const { wrapper, router } = await mountWithInitialQuery(null)
    const replaceSpy = vi.spyOn(router, 'replace')
    ;(wrapper.vm as { searchQuery: string }).searchQuery = 'dark'
    await flushComposableWork()

    expect(replaceSpy).toHaveBeenCalledWith({
      name: 'dashboard',
      query: { q: 'dark' },
    })
  })

  it('removes q from route query when search is cleared', async () => {
    const { wrapper, router } = await mountWithInitialQuery('friends')
    const replaceSpy = vi.spyOn(router, 'replace')
    ;(wrapper.vm as { searchQuery: string }).searchQuery = ''
    await flushComposableWork()

    expect(replaceSpy).toHaveBeenCalledWith({
      name: 'dashboard',
      query: {},
    })
  })

  it('syncs searchQuery when route query changes via router navigation', async () => {
    const { wrapper, router } = await mountWithInitialQuery('breaking')

    await router.replace({ name: 'dashboard', query: { q: 'lost' } })
    await flushComposableWork()

    expect((wrapper.find('.query-input').element as HTMLInputElement).value).toBe('lost')
    expect(wrapper.find('.query-value').text()).toBe('lost')
  })

  it('increments provided reset token when search changes', async () => {
    const { wrapper } = await mountWithInitialQuery(null)
    const token = providedResetToken(wrapper)

    expect(token.value).toBe(0)

    await wrapper.find('.query-input').setValue('a')
    await flushComposableWork()
    expect(token.value).toBe(1)

    await wrapper.find('.query-input').setValue('ab')
    await flushComposableWork()
    expect(token.value).toBe(2)
  })
})
