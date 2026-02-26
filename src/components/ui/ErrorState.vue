<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message: string
    iconClass?: string
  }>(),
  {
    title: 'Something went wrong',
    iconClass: 'fa-solid fa-circle-exclamation',
  }
)
</script>

<template>
  <section class="error-state" role="alert">
    <i :class="iconClass" class="error-icon" aria-hidden="true" />
    <h2 class="error-title">{{ title }}</h2>
    <p class="error-message">{{ message }}</p>
  </section>
</template>

<style scoped lang="scss">
@use '../../styles/atoms/index' as atoms;
@use '../../styles/tokens' as tokens;

.error-state {
  margin: tokens.get-map(tokens.$spacer, 4) 0;
  padding: tokens.get-map(tokens.$spacer, 6);
  border-radius: tokens.get-map(tokens.$radius, md);
  border: 1px solid #f0c5d1;
  background: #fff7fa;
  text-align: center;
  display: grid;
  justify-items: center;
  gap: tokens.get-map(tokens.$spacer, 2);
}

.error-icon {
  font-size: 1.4rem;
  color: tokens.get-map(tokens.$colors, status-error);
}

.error-title {
  @include atoms.text-title(lg);
  --text-title-color: #{tokens.get-map(tokens.$colors, status-error)};
}

.error-message {
  @include atoms.text-supporting(md, 0);
  --text-supporting-color: #{tokens.get-map(tokens.$colors, text-soft)};
}
</style>
