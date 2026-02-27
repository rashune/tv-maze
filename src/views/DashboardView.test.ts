import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DashboardView from './DashboardView.vue'

const mockSearchQuery = ref('')
const mockShows = ref([])
const mockLoading = ref(false)
const mockErrorMessage = ref('')

vi.mock('../composables/useDashboardSearchQuery', () => ({
  useDashboardSearchQuery: () => ({
    searchQuery: mockSearchQuery,
  }),
}))

vi.mock('../composables/useShows', () => ({
  useShows: () => ({
    shows: mockShows,
    loading: mockLoading,
    errorMessage: mockErrorMessage,
  }),
}))

vi.mock('../composables/useRouteScrollMemory', () => ({
  useRouteScrollMemory: vi.fn(),
}))

describe('DashboardView', () => {
  beforeEach(() => {
    mockSearchQuery.value = ''
    mockShows.value = []
    mockLoading.value = false
    mockErrorMessage.value = ''
  })

  it('shows "Show All" button when search query is not empty', () => {
    mockSearchQuery.value = 'dark'
    const wrapper = mount(DashboardView, {
      global: {
        stubs: {
          GenreRow: true,
          SearchBar: true,
          ErrorState: true,
          LoadingState: true,
        },
      },
    })

    const showAllButton = wrapper.find('button.search-clear')
    expect(showAllButton.exists()).toBe(true)
    expect(showAllButton.text()).toContain('Show All')
  })

  it('clears query when "Show All" is clicked', async () => {
    mockSearchQuery.value = 'friends'
    const wrapper = mount(DashboardView, {
      global: {
        stubs: {
          GenreRow: true,
          SearchBar: true,
          ErrorState: true,
          LoadingState: true,
        },
      },
    })

    await wrapper.find('button.search-clear').trigger('click')
    await nextTick()

    expect(mockSearchQuery.value).toBe('')
    expect(wrapper.find('button.search-clear').exists()).toBe(false)
  })
})
