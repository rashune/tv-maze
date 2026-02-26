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
@use 'sass:math';
@use '../styles/atoms/index' as atoms;

.card-link {
  @include atoms.link-reset;
  width: var(--show-card-width, 190px);
}

.card-surface {
  @include atoms.surface-panel(md);
}

.card-poster {
  @include atoms.media-cover(math.div(2, 3));
}

.card-placeholder {
  @include atoms.placeholder-center(sm);
}

.card-meta {
  @include atoms.inset-padding(2, 3, 3);
}

.card-title {
  @include atoms.text-title(md);
}

.card-rating {
  @include atoms.text-supporting(sm, 1);
}
</style>
