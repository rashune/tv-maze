<script setup lang="ts">
import Spinner from './Spinner.vue'

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
    <Spinner />
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

.loading-title {
  @include atoms.text-title(lg);
  margin: 0;
}

.loading-message {
  @include atoms.text-supporting(md, 0);
  --text-supporting-color: #{tokens.get-map(tokens.$colors, text-soft)};
}
</style>
