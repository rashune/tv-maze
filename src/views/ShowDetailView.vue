<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LoadingState from '../components/ui/LoadingState.vue'
import { useShows } from '../composables/useShows'

const route = useRoute()
const { shows, loading, errorMessage } = useShows()

const showId = computed(() => Number(route.params.id))
const show = computed(() => shows.value.find((item) => item.id === showId.value) ?? null)
const notFoundMessage = computed(() =>
  !loading.value && !errorMessage.value && !show.value ? 'Show not found' : ''
)
</script>

<template>
  <main class="detail-page">
    <RouterLink class="detail-page-back-link" to="/">
      <i class="fa-solid fa-arrow-left" aria-hidden="true" />
      <span>Back to dashboard</span>
    </RouterLink>

    <LoadingState v-if="loading" message="Loading show detail..." />
    <p v-else-if="errorMessage || notFoundMessage" class="detail-page-error">
      {{ errorMessage || notFoundMessage }}
    </p>

    <article v-else-if="show" class="detail-page-layout">
      <img
        v-if="show.imageUrl"
        class="detail-page-poster"
        :src="show.imageUrl"
        :alt="`${show.name} poster`"
      />
      <div class="detail-page-content">
        <h1 class="detail-page-title">{{ show.name }}</h1>

        <dl class="detail-page-meta">
          <dt>Rating</dt>
          <dd>{{ show.rating ?? 'N/A' }}</dd>

          <dt>Genres</dt>
          <dd>{{ show.genres.join(', ') || 'N/A' }}</dd>

          <dt>Status</dt>
          <dd>{{ show.status }}</dd>

          <dt>Language</dt>
          <dd>{{ show.language ?? 'N/A' }}</dd>

          <dt>Runtime</dt>
          <dd>{{ show.runtime ? `${show.runtime} min` : 'N/A' }}</dd>

          <dt>Premiered</dt>
          <dd>{{ show.premiered ?? 'N/A' }}</dd>
        </dl>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <section class="detail-page-summary" v-html="show.summaryHtml" />
      </div>
    </article>
  </main>
</template>

<style scoped lang="scss">
@use '../styles/atoms/index' as atoms;
@use '../styles/breakpoints' as bp;
@use '../styles/tokens' as tokens;

.detail-page-back-link {
  @include atoms.link-reset;
  display: inline-flex;
  align-items: center;
  gap: tokens.get-map(tokens.$spacer, 2);
  color: tokens.get-map(tokens.$colors, text-accent);
}

.detail-page-error {
  @include atoms.text-error;
}

.detail-page-layout {
  margin-top: tokens.get-map(tokens.$spacer, 4);
  display: grid;
  gap: tokens.get-map(tokens.$spacer, 4);
}

.detail-page-poster {
  width: min(100%, 320px);
  border-radius: tokens.get-map(tokens.$radius, md);
}

.detail-page-content {
  display: grid;
  gap: tokens.get-map(tokens.$spacer, 3);
}

.detail-page-title {
  @include atoms.text-title(xl);
}

.detail-page-meta {
  margin: 0 0 tokens.get-map(tokens.$spacer, 4);
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: tokens.get-map(tokens.$spacer, 1) tokens.get-map(tokens.$spacer, 3);
}

.detail-page-meta dt {
  font-weight: 700;
}

.detail-page-meta dd {
  margin: 0;
}

.detail-page-summary {
  @include atoms.text-supporting(md, 0);
}

@include bp.media-up(lg) {
  .detail-page-layout {
    grid-template-columns: 320px minmax(0, 1fr);
    align-items: start;
  }
}
</style>
