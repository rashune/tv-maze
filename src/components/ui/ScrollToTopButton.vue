<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isVisible = ref(false)

function updateVisibility(): void {
  isVisible.value = window.scrollY > window.innerHeight
}

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  updateVisibility()
  window.addEventListener('scroll', updateVisibility, { passive: true })
  window.addEventListener('resize', updateVisibility)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility)
  window.removeEventListener('resize', updateVisibility)
})
</script>

<template>
  <button
    v-show="isVisible"
    class="scroll-top-btn"
    type="button"
    aria-label="Scroll to top"
    @click="scrollToTop"
  >
    <i class="fa-solid fa-arrow-up" aria-hidden="true" />
  </button>
</template>

<style scoped lang="scss">
@use '../../styles/atoms/index' as atoms;
@use '../../styles/tokens' as tokens;

.scroll-top-btn {
  @include atoms.circle-button(md);
  position: fixed;
  right: clamp(0.8rem, 2vw, 1.6rem);
  bottom: clamp(0.8rem, 2.2vw, 1.8rem);
  width: 2.8rem;
  height: 2.8rem;
  --circle-button-border: #{tokens.get-map(tokens.$colors, border-subtle)};
  --circle-button-bg: #{tokens.get-map(tokens.$colors, surface)};
  --circle-button-color: #{tokens.get-map(tokens.$colors, text-primary)};
  box-shadow: 0 8px 20px rgba(15, 27, 61, 0.2);
  z-index: 20;
}
</style>
