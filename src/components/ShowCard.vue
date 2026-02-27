<script setup lang="ts">
import Image from './ui/Image.vue'
import type { Show } from '../types/show'

defineProps<{
  show: Show
}>()
</script>

<template>
  <RouterLink :to="`/show/${show.id}`" class="card-link">
    <article class="card-surface">
      <Image
        class="card-poster"
        :src="show.imageUrl ?? null"
        :alt="`${show.name} poster`"
        loading="lazy"
      />
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
