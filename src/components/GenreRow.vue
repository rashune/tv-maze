<script setup lang="ts">
import ShowCard from './ShowCard.vue'
import ScrollableContainer from './ui/ScrollableContainer.vue'
import SectionHeader from './ui/SectionHeader.vue'
import type { Show } from '../types/show'

withDefaults(
  defineProps<{
    genre: string
    shows: Show[]
    showButtons?: boolean
    showScrollbar?: boolean
  }>(),
  {
    showButtons: true,
    showScrollbar: true,
  }
)
</script>

<template>
  <section class="genre-row">
    <SectionHeader class="genre-row-header" :title="genre" :meta="`${shows.length} shows`" />

    <ScrollableContainer
      :label="`${genre} shows`"
      :overlay-buttons="true"
      :show-buttons="showButtons"
      :show-scrollbar="showScrollbar"
    >
      <ShowCard v-for="show in shows" :key="show.id" :show="show" />
    </ScrollableContainer>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/atoms/index' as atoms;

.genre-row {
  @include atoms.stack(3);
  --show-card-width: clamp(150px, 20vw, 240px);
}

.genre-row-header {
  --section-header-gap: 1.25rem;
  --text-title-color: #112a63;
  --text-title-size: 1.2rem;
  --text-supporting-color: #365288;
  --text-supporting-size: 0.9rem;
}
</style>
