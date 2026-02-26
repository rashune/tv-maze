<script setup lang="ts">
defineProps<{
  title: string
  meta: string
}>()
</script>

<template>
  <header class="section-header">
    <h2>{{ title }}</h2>
    <small>{{ meta }}</small>
  </header>
</template>

<style scoped lang="scss">
@use '../../styles/atoms/index' as atoms;
@use '../../styles/tokens' as tokens;

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: var(--section-header-gap, #{tokens.get-map(tokens.$spacer, 4)});
}

h2 {
  @include atoms.text-title(lg);
}

small {
  @include atoms.text-supporting(sm, 0);
}
</style>
