<script setup lang="ts">
import type { Show } from '../types/show'

defineProps<{
  show: Show
}>()
</script>

<template>
  <RouterLink :to="`/show/${show.id}`" class="card-link">
    <article class="card">
      <img
        v-if="show.imageUrl"
        class="poster"
        :src="show.imageUrl"
        :alt="`${show.name} poster`"
        loading="lazy"
      />
      <div v-else class="poster placeholder">No Image</div>
      <div class="meta">
        <h3 class="title">{{ show.name }}</h3>
        <p class="rating">Rating: {{ show.rating ?? 'N/A' }}</p>
      </div>
    </article>
  </RouterLink>
</template>

<style scoped>
.card-link {
  text-decoration: none;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f2;
  border-radius: 0.9rem;
  overflow: hidden;
  min-height: 100%;
}

.poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  display: block;
}

.placeholder {
  display: grid;
  place-items: center;
  color: #4f5d7f;
  background: #e9eef7;
  font-size: 0.9rem;
}

.meta {
  padding: 0.55rem 0.65rem 0.8rem;
}

.title {
  margin: 0;
  font-size: 0.92rem;
  color: #0f1b3d;
}

.rating {
  margin: 0.3rem 0 0;
  color: #425172;
  font-size: 0.86rem;
}
</style>
