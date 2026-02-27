<template>
  <span class="spinner" aria-hidden="true" />
</template>

<style scoped lang="scss">
@use '../../styles/tokens' as tokens;

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #bfd1f4;
  border-top-color: tokens.get-map(tokens.$colors, text-accent);
  border-radius: 999px;
  animation: spinner-rotate 0.9s linear infinite;
}

@keyframes spinner-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
