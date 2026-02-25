<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GenreRow from '../components/GenreRow.vue'
import SearchBar from '../components/SearchBar.vue'
import { fetchShows } from '../services/tvmazeService'
import { groupShowsByGenre, searchShowsByName } from '../utils/showUtils'
import type { Show } from '../types/show'

const shows = ref<Show[]>([])
const searchQuery = ref('')
const loading = ref(true)
const errorMessage = ref('')

const showArrowButtons = ref(true)
const showNativeScrollbar = ref(true)

const filteredShows = computed(() => searchShowsByName(shows.value, searchQuery.value))

const groupedGenres = computed(() => {
  const grouped = groupShowsByGenre(filteredShows.value)
  return Object.entries(grouped).sort(([first], [second]) => first.localeCompare(second))
})

onMounted(async () => {
  try {
    shows.value = await fetchShows()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unexpected error'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="dashboard">
    <section class="top-panel">
      <h1>TV Maze Dashboard</h1>
      <SearchBar v-model="searchQuery" />

      <div class="toggles">
        <label>
          <input v-model="showArrowButtons" type="checkbox" />
          Show arrow buttons
        </label>
        <label>
          <input v-model="showNativeScrollbar" type="checkbox" />
          Show horizontal scrollbar
        </label>
      </div>
    </section>

    <p v-if="loading">Loading shows...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="groupedGenres.length === 0">No shows found.</p>

    <section v-else class="rows">
      <GenreRow
        v-for="[genre, genreShows] in groupedGenres"
        :key="genre"
        :genre="genre"
        :shows="genreShows"
        :show-buttons="showArrowButtons"
        :show-scrollbar="showNativeScrollbar"
      />
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  display: grid;
  gap: 1.2rem;
}

.top-panel {
  display: grid;
  gap: 0.8rem;
}

h1 {
  margin: 0;
  font-size: 1.55rem;
}

.rows {
  display: grid;
  gap: 1.35rem;
}

.toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.toggles label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.94rem;
}
</style>
