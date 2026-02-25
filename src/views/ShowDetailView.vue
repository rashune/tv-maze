<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchShows } from '../services/tvmazeService'
import type { Show } from '../types/show'

const route = useRoute()
const show = ref<Show | null>(null)
const loading = ref(true)
const errorMessage = ref('')

const showId = computed(() => Number(route.params.id))

onMounted(async () => {
  try {
    const shows = await fetchShows()
    show.value = shows.find((item) => item.id === showId.value) ?? null
    if (!show.value) {
      errorMessage.value = 'Show not found'
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unexpected error'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main>
    <RouterLink class="back-link" to="/">← Back to dashboard</RouterLink>

    <p v-if="loading">Loading show detail...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <article v-else-if="show" class="show-detail">
      <img v-if="show.imageUrl" :src="show.imageUrl" :alt="`${show.name} poster`" />
      <div>
        <h1>{{ show.name }}</h1>
        <p><strong>Rating:</strong> {{ show.rating ?? 'N/A' }}</p>
        <p><strong>Genres:</strong> {{ show.genres.join(', ') || 'N/A' }}</p>
        <p><strong>Status:</strong> {{ show.status }}</p>
        <p><strong>Language:</strong> {{ show.language ?? 'N/A' }}</p>
        <p><strong>Runtime:</strong> {{ show.runtime ? `${show.runtime} min` : 'N/A' }}</p>
        <p><strong>Premiered:</strong> {{ show.premiered ?? 'N/A' }}</p>
        <section v-html="show.summaryHtml" />
      </div>
    </article>
  </main>
</template>

<style scoped>
.back-link {
  color: #173072;
  text-decoration: none;
}

.show-detail {
  margin-top: 1rem;
  display: grid;
  gap: 1rem;
}

.show-detail img {
  width: min(100%, 320px);
  border-radius: 0.9rem;
}

h1 {
  margin-top: 0;
}

@media (min-width: 900px) {
  .show-detail {
    grid-template-columns: 320px minmax(0, 1fr);
    align-items: start;
  }
}
</style>
