<template>
  <div class="app-shell">
    <header class="app-header">
      <p class="brand">TVMaze Explorer</p>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  max-width: 1240px;
  margin: 0 auto;
  padding: 1rem 0.9rem 1.4rem;
}

.app-header {
  margin-bottom: 1rem;
}

.brand {
  margin: 0;
  font-weight: 700;
  color: #f7fbff;
  letter-spacing: 0.02em;
  background: linear-gradient(120deg, #0d2f6f, #0f6e87);
  padding: 0.6rem 0.8rem;
  border-radius: 0.65rem;
}
</style>
