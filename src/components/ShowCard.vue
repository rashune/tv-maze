<script setup lang="ts">
import type { Show } from '../types/show'

defineProps<{
  show: Show
}>()
</script>

<template>
  <RouterLink :to="`/show/${show.id}`" class="card-link">
    <article class="card-surface">
      <img
        v-if="show.imageUrl"
        class="card-poster"
        :src="show.imageUrl"
        :alt="`${show.name} poster`"
        loading="lazy"
      />
      <div v-else class="card-poster card-placeholder">No Image</div>
      <div class="card-meta">
        <h3 class="card-title">{{ show.name }}</h3>
        <p class="card-rating">Rating: {{ show.rating ?? 'N/A' }}</p>
      </div>
    </article>
  </RouterLink>
</template>

<style scoped lang="scss">
@use '../styles/molecules/card' as card;

.card-link {
  @include card.card-link;
}

.card-surface {
  @include card.card-surface;
}

.card-poster {
  @include card.card-poster;
}

.card-placeholder {
  @include card.card-placeholder;
}

.card-meta {
  @include card.card-meta;
}

.card-title {
  @include card.card-title;
}

.card-rating {
  @include card.card-rating;
}
</style>
