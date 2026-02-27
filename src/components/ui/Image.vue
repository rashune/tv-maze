<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Spinner from './Spinner.vue'

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt: string
    loading?: 'lazy' | 'eager'
    showSpinner?: boolean
    loadingText?: string
    errorText?: string
  }>(),
  {
    src: null,
    loading: 'lazy',
    showSpinner: false,
    loadingText: '',
    errorText: '',
  }
)

const hasLoaded = ref(false)
const hasError = ref(false)

watch(
  () => props.src,
  () => {
    hasLoaded.value = false
    hasError.value = false
  },
  { immediate: true }
)

const effectiveErrorText = computed(() => {
  if (props.errorText) {
    return props.errorText
  }

  return 'No Image'
})

const showLoading = computed(() => !!props.src && !hasLoaded.value && !hasError.value)
const showError = computed(() => !props.src || hasError.value)
const hasLoadingForeground = computed(() => props.showSpinner || props.loadingText.trim().length > 0)

function handleLoad() {
  hasLoaded.value = true
}

function handleError() {
  hasError.value = true
}
</script>

<template>
  <div class="poster-image">
    <img
      v-if="src"
      class="poster-image-media"
      :class="{
        'poster-image-media--visible': hasLoaded && !hasError,
        'poster-image-media--hidden': hasError,
      }"
      :src="src"
      :alt="alt"
      :loading="loading"
      @load="handleLoad"
      @error="handleError"
    />

    <div
      v-if="showLoading"
      class="poster-image-loading"
      :class="{ 'poster-image-loading--with-content': hasLoadingForeground }"
      role="status"
      aria-live="polite"
    >
      <span class="poster-image-surface" aria-hidden="true" />
      <template v-if="hasLoadingForeground">
        <Spinner v-if="showSpinner" class="poster-image-spinner" />
        <p v-if="loadingText" class="poster-image-loading-text">{{ loadingText }}</p>
      </template>
    </div>

    <div v-else-if="showError" class="poster-image-error">
      {{ effectiveErrorText }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/tokens' as tokens;
@use '../../styles/atoms/index' as atoms;

.poster-image {
  position: relative;
  overflow: hidden;
  background: tokens.get-map(tokens.$colors, surface-muted);
}

.poster-image-media,
.poster-image-loading,
.poster-image-surface,
.poster-image-error {
  width: 100%;
  height: 100%;
}

.poster-image-media {
  display: block;
  object-fit: cover;
  opacity: 0;
  transition: opacity 160ms ease-in-out;
}

.poster-image-media--visible {
  opacity: 1;
}

.poster-image-media--hidden {
  display: none;
}

.poster-image-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.poster-image-surface {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #dfe7f5;
  overflow: hidden;
}

.poster-image-surface::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    rgb(255 255 255 / 0%) 20%,
    rgb(255 255 255 / 45%) 50%,
    rgb(255 255 255 / 0%) 80%
  );
  transform: translateX(-100%);
  animation: poster-image-shimmer 1.2s ease-in-out infinite;
}

.poster-image-spinner {
  z-index: 1;
}

.poster-image-loading-text {
  @include atoms.text-supporting(md, 0);
  z-index: 1;
  color: tokens.get-map(tokens.$colors, text-primary);
}

.poster-image-loading--with-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: tokens.get-map(tokens.$spacer, 2);
}

.poster-image-error {
  position: absolute;
  inset: 0;
  @include atoms.placeholder-center(sm);
}

@keyframes poster-image-shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>
