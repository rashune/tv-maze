<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import GenreRow from '../components/GenreRow.vue'
import SearchBar from '../components/SearchBar.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import { useShows } from '../composables/useShows'
import { horizontalScrollResetKey } from '../injectionKeys'
import { useRouteScrollMemory } from '../composables/useRouteScrollMemory'
import { groupShowsByGenre, searchShowsByName, sortByRatingDesc } from '../utils/showUtils'

const { shows, loading, errorMessage } = useShows()
const searchQuery = ref('')
const horizontalResetToken = ref(0)

provide(horizontalScrollResetKey, horizontalResetToken)

useRouteScrollMemory('dashboard', { ready: loading })

const filteredShows = computed(() => searchShowsByName(shows.value, searchQuery.value))

const groupedGenres = computed(() => {
  const grouped = groupShowsByGenre(filteredShows.value)
  return Object.entries(grouped)
    .map(([genre, genreShows]) => [genre, sortByRatingDesc(genreShows)] as const)
    .sort(([first], [second]) => first.localeCompare(second))
})

watch(searchQuery, () => {
  horizontalResetToken.value += 1
}, { flush: 'post' })
</script>

<template>
  <main class="dashboard">
    <section class="top-panel">
      <h1 class="dashboard-title">TV Maze Dashboard</h1>
      <SearchBar v-model="searchQuery" />
    </section>

    <LoadingState v-if="loading" title="Fetching shows" />
    <ErrorState v-else-if="errorMessage" :message="errorMessage" />
    <p v-else-if="groupedGenres.length === 0">No shows found.</p>

    <section v-else class="rows">
      <GenreRow v-for="[genre, genreShows] in groupedGenres" :key="genre" :genre="genre" :shows="genreShows" />
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
</style>
