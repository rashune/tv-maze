<template>
  <div class="app-wrapper">
    <header class="app-header">
      <p class="brand">TVMaze Explorer</p>
    </header>
    <RouterView />
    <ScrollToTopButton />
  </div>
</template>

<script setup lang="ts">
import ScrollToTopButton from './components/ui/ScrollToTopButton.vue'
</script>

<style scoped lang="scss">
@use './styles/tokens' as tokens;

.app-wrapper {
  --app-shell-top-padding: #{tokens.get-map(tokens.$spacer, 4)};
  --app-shell-side-padding: 0.9rem;
  max-width: 1240px;
  margin: 0 auto;
  padding: var(--app-shell-top-padding) var(--app-shell-side-padding)
    calc(tokens.get-map(tokens.$spacer, 5) + tokens.get-map(tokens.$spacer, 1));
}

.app-header {
  margin-bottom: tokens.get-map(tokens.$spacer, 4);
}

.brand {
  margin: 0;
  font-weight: 700;
  color: tokens.get-map(tokens.$colors, text-contrast);
  letter-spacing: 0.02em;
  background: linear-gradient(
    120deg,
    tokens.get-map(tokens.$colors, brand-start),
    tokens.get-map(tokens.$colors, brand-end)
  );
  padding: 0.6rem tokens.get-map(tokens.$spacer, 3);
  border-radius: 0.65rem;
}
</style>
