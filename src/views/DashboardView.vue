<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GenreRow from '../components/GenreRow.vue'
import SearchBar from '../components/SearchBar.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import { useRouteScrollMemory } from '../composables/useRouteScrollMemory'
import { fetchShows } from '../services/tvmazeService'
import { groupShowsByGenre, searchShowsByName, sortByRatingDesc } from '../utils/showUtils'
import type { Show } from '../types/show'

const shows = ref<Show[]>([])
const searchQuery = ref('')
const loading = ref(true)
const errorMessage = ref('')

useRouteScrollMemory('dashboard', { ready: loading })

const filteredShows = computed(() => searchShowsByName(shows.value, searchQuery.value))

const groupedGenres = computed(() => {
  const grouped = groupShowsByGenre(filteredShows.value)
  return Object.entries(grouped)
    .map(([genre, genreShows]) => [genre, sortByRatingDesc(genreShows)] as const)
    .sort(([first], [second]) => first.localeCompare(second))
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
      <h1 class="dashboard-title">TV Maze Dashboard</h1>
      <SearchBar v-model="searchQuery" />
    </section>

    <LoadingState v-if="loading" message="Loading shows..." />
    <p v-else-if="errorMessage" class="dashboard-error-text">{{ errorMessage }}</p>
    <p v-else-if="groupedGenres.length === 0">No shows found.</p>

    <section v-else class="rows">
      <GenreRow
        v-for="[genre, genreShows] in groupedGenres"
        :key="genre"
        :genre="genre"
        :shows="genreShows"
      />
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '../styles/atoms/index' as atoms;
@use '../styles/tokens' as tokens;

.dashboard {
  @include atoms.stack(5);
}

.top-panel {
  @include atoms.stack(3);
}

.dashboard-title {
  @include atoms.text-title(xl);
}

.rows {
  @include atoms.stack(5);
}

.dashboard-error-text {
  @include atoms.text-error;
}
</style>
