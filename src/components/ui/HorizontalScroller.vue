<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  label: string
  showButtons?: boolean
  showScrollbar?: boolean
  scrollStep?: number
  snap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showButtons: true,
  showScrollbar: true,
  scrollStep: 280,
  snap: true,
})

const scrollerRef = ref<HTMLElement | null>(null)

const scrollerClasses = computed(() => ({
  scroller: true,
  'scroller-no-scrollbar': !props.showScrollbar,
  'scroller-snap': props.snap,
}))

function scrollByOffset(offset: number): void {
  scrollerRef.value?.scrollBy({ left: offset, behavior: 'smooth' })
}
</script>

<template>
  <div class="scroller-shell">
    <button
      v-if="showButtons"
      class="scroll-button"
      type="button"
      aria-label="Scroll left"
      @click="scrollByOffset(-scrollStep)"
    >
      ‹
    </button>

    <div ref="scrollerRef" :class="scrollerClasses" :aria-label="label">
      <slot />
    </div>

    <button
      v-if="showButtons"
      class="scroll-button"
      type="button"
      aria-label="Scroll right"
      @click="scrollByOffset(scrollStep)"
    >
      ›
    </button>
  </div>
</template>

<style scoped>
.scroller-shell {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
}

.scroller {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(140px, 44vw);
  gap: 0.75rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
}

.scroller-snap > * {
  scroll-snap-align: start;
}

.scroller-snap {
  scroll-snap-type: x mandatory;
}

.scroller-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroller-no-scrollbar::-webkit-scrollbar {
  display: none;
}

.scroll-button {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d4dae5;
  border-radius: 999px;
  background-color: #ffffff;
  color: #0f1b3d;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

@media (max-width: 720px) {
  .scroll-button {
    width: 2.75rem;
    height: 2.75rem;
  }
}
</style>
