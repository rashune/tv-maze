import { onMounted, ref } from 'vue'
import { fetchShows } from '../services/tvmazeService'
import type { Show } from '../types/show'

interface UseShowsOptions {
  immediate?: boolean
}

export function useShows(options: UseShowsOptions = {}) {
  const { immediate = true } = options
  const shows = ref<Show[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  async function loadShows(forceRefresh = false): Promise<void> {
    loading.value = true
    errorMessage.value = ''

    try {
      shows.value = await fetchShows(forceRefresh)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Unexpected error'
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    onMounted(async () => {
      await loadShows()
    })
  }

  return {
    shows,
    loading,
    errorMessage,
    loadShows,
  }
}
