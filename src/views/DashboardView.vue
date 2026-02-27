<script setup lang="ts">
import { computed } from 'vue'
import DashboardTopPanel from '../components/DashboardTopPanel.vue'
import GenreRow from '../components/GenreRow.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import { useDashboardSearchQuery } from '../composables/useDashboardSearchQuery'
import { useShows } from '../composables/useShows'
import { useRouteScrollMemory } from '../composables/useRouteScrollMemory'
import { groupShowsByGenre, searchShowsByName, sortByRatingDesc } from '../utils/showUtils'

const { shows, loading, errorMessage } = useShows()
const { searchQuery } = useDashboardSearchQuery()

useRouteScrollMemory('dashboard', { ready: loading })

const filteredShows = computed(() => searchShowsByName(shows.value, searchQuery.value))

const groupedGenres = computed(() => {
  const grouped = groupShowsByGenre(filteredShows.value)
  return Object.entries(grouped)
    .map(([genre, genreShows]) => [genre, sortByRatingDesc(genreShows)] as const)
    .sort(([first], [second]) => first.localeCompare(second))
})
</script>

<template>
  <main class="dashboard">
    <DashboardTopPanel v-model="searchQuery" />

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

.dashboard {
  @include atoms.stack(5);
}

.rows {
  @include atoms.stack(5);
}
</style>
