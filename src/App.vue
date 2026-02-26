<template>
  <div class="app-wrapper">
    <header class="app-header">
      <p class="brand">TVMaze Explorer</p>
    </header>
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
@use './styles/tokens' as tokens;

.app-wrapper {
  max-width: 1240px;
  margin: 0 auto;
  padding: tokens.get-map(tokens.$spacer, 4) 0.9rem
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
