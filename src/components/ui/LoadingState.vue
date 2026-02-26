<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Loading...',
  }
)
</script>

<template>
  <p class="loading" role="status" aria-live="polite">{{ message }}</p>
</template>

<style scoped lang="scss">
@use '../../styles/atoms/index' as atoms;
@use '../../styles/tokens' as tokens;

.loading {
  @include atoms.text-supporting(md, 0);
  --text-supporting-color: var(
    --loading-state-text-color,
    #{tokens.get-map(tokens.$colors, text-soft)}
  );
}
</style>
