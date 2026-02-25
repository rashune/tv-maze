<script setup lang="ts">
import ShowCard from './ShowCard.vue'
import HorizontalScroller from './ui/HorizontalScroller.vue'
import type { Show } from '../types/show'

defineProps<{
  genre: string
  shows: Show[]
  showButtons?: boolean
  showScrollbar?: boolean
}>()
</script>

<template>
  <section class="genre-row">
    <header class="row-header">
      <h2>{{ genre }}</h2>
      <small>{{ shows.length }} shows</small>
    </header>

    <HorizontalScroller
      :label="`${genre} shows`"
      :show-buttons="showButtons"
      :show-scrollbar="showScrollbar"
    >
      <ShowCard v-for="show in shows" :key="show.id" :show="show" />
    </HorizontalScroller>
  </section>
</template>

<style scoped>
.genre-row {
  display: grid;
  gap: 0.65rem;
}

.row-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

h2 {
  margin: 0;
  color: #0b1737;
  font-size: 1.1rem;
}

small {
  color: #5a6889;
}
</style>
