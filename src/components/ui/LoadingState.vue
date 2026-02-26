<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Loading...',
    message: 'Please wait',
  }
)
</script>

<template>
  <section class="loading-state" role="status" aria-live="polite">
    <span class="loading-spinner" aria-hidden="true" />
    <h2 class="loading-title">{{ title }}</h2>
    <p class="loading-message">{{ message }}</p>
  </section>
</template>

<style scoped lang="scss">
@use '../../styles/atoms/index' as atoms;
@use '../../styles/tokens' as tokens;

.loading-state {
  margin: tokens.get-map(tokens.$spacer, 4) 0;
  padding: tokens.get-map(tokens.$spacer, 6);
  border-radius: tokens.get-map(tokens.$radius, md);
  background: transparent;
  text-align: center;
  display: grid;
  justify-items: center;
  gap: tokens.get-map(tokens.$spacer, 2);
}

.loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #bfd1f4;
  border-top-color: tokens.get-map(tokens.$colors, text-accent);
  border-radius: 999px;
  animation: loading-spin 0.9s linear infinite;
}

.loading-title {
  @include atoms.text-title(lg);
  margin: 0;
}

.loading-message {
  @include atoms.text-supporting(md, 0);
  --text-supporting-color: #{tokens.get-map(tokens.$colors, text-soft)};
}

@keyframes loading-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
