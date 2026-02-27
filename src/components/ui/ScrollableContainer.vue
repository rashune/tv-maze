<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Axis = 'horizontal' | 'vertical'
type ScrollDirection = 'previous' | 'next'

interface Props {
  label: string
  axis?: Axis
  showButtons?: boolean
  overlayButtons?: boolean
  showScrollbar?: boolean
  scrollStep?: number
  snap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  axis: 'horizontal',
  showButtons: true,
  overlayButtons: false,
  showScrollbar: true,
  scrollStep: 280,
  snap: true,
})

const scrollerRef = ref<HTMLElement | null>(null)
const hasOverflow = ref(false)
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

const wrapperClasses = computed(() => ({
  'scroller-wrapper': true,
  'scroller-wrapper-vertical': props.axis === 'vertical',
  'scroller-wrapper-overlay': props.overlayButtons,
}))

const scrollerClasses = computed(() => ({
  scroller: true,
  'scroller-vertical': props.axis === 'vertical',
  'scroller-no-scrollbar': !props.showScrollbar,
  'scroller-snap': props.snap,
}))

function scrollByOffset(direction: ScrollDirection): void {
  const baseStep = Math.abs(props.scrollStep)
  const signedStep = direction === 'previous' ? -baseStep : baseStep

  if (props.axis === 'vertical') {
    scrollerRef.value?.scrollBy({ top: signedStep, behavior: 'smooth' })
    return
  }

  scrollerRef.value?.scrollBy({ left: signedStep, behavior: 'smooth' })
}

function refreshOverflowState(): void {
  const scroller = scrollerRef.value

  if (!scroller) {
    hasOverflow.value = false
    return
  }

  hasOverflow.value =
    props.axis === 'vertical'
      ? scroller.scrollHeight > scroller.clientHeight + 1
      : scroller.scrollWidth > scroller.clientWidth + 1
}

function resetScrollPosition(): void {
  const scroller = scrollerRef.value

  if (!scroller) {
    return
  }

  if (props.axis === 'vertical') {
    scroller.scrollTop = 0
    return
  }

  scroller.scrollLeft = 0
}

function iconClass(direction: ScrollDirection): string {
  if (props.axis === 'vertical') {
    return direction === 'previous' ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'
  }

  return direction === 'previous' ? 'fa-solid fa-chevron-left' : 'fa-solid fa-chevron-right'
}

onMounted(() => {
  void nextTick(refreshOverflowState)
  window.addEventListener('resize', refreshOverflowState)

  if (typeof ResizeObserver !== 'undefined' && scrollerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      refreshOverflowState()
    })
    resizeObserver.observe(scrollerRef.value)
  }

  if (typeof MutationObserver !== 'undefined' && scrollerRef.value) {
    mutationObserver = new MutationObserver(() => {
      void nextTick(() => {
        resetScrollPosition()
        refreshOverflowState()
      })
    })
    mutationObserver.observe(scrollerRef.value, {
      childList: true,
      subtree: true,
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', refreshOverflowState)
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
})

watch(
  () => [props.axis, props.showButtons],
  () => {
    void nextTick(refreshOverflowState)
  }
)
</script>

<template>
  <div :class="wrapperClasses">
    <button
      v-if="props.showButtons && hasOverflow"
      class="scroll-button scroll-button-previous"
      type="button"
      :aria-label="props.axis === 'vertical' ? 'Scroll up' : 'Scroll left'"
      @click="scrollByOffset('previous')"
    >
      <i :class="iconClass('previous')" aria-hidden="true" />
    </button>

    <div ref="scrollerRef" :class="scrollerClasses" :aria-label="props.label">
      <slot />
    </div>

    <button
      v-if="props.showButtons && hasOverflow"
      class="scroll-button scroll-button-next"
      type="button"
      :aria-label="props.axis === 'vertical' ? 'Scroll down' : 'Scroll right'"
      @click="scrollByOffset('next')"
    >
      <i :class="iconClass('next')" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/atoms/index' as atoms;
@use '../../styles/breakpoints' as bp;
@use '../../styles/tokens' as tokens;

.scroller-wrapper {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: tokens.get-map(tokens.$spacer, 2);
}

.scroller-wrapper-vertical {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  justify-items: center;
}

.scroller-wrapper-overlay {
  position: relative;
  grid-template-columns: minmax(0, 1fr);
}

.scroller {
  display: flex;
  flex-direction: row;
  gap: var(--scrollable-gap, #{tokens.get-map(tokens.$spacer, 3)});
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: tokens.get-map(tokens.$spacer, 2);
  scrollbar-width: thin;
}

.scroller > * {
  flex: 0 0 auto;
}

.scroller-vertical {
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: var(--scrollable-vertical-height, 65vh);
  padding-bottom: 0;
  padding-right: tokens.get-map(tokens.$spacer, 2);
}

.scroller-snap {
  scroll-snap-type: x mandatory;
}

.scroller-snap.scroller-vertical {
  scroll-snap-type: y mandatory;
}

.scroller-snap > * {
  scroll-snap-align: start;
}

.scroller-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroller-no-scrollbar::-webkit-scrollbar {
  display: none;
}

.scroll-button {
  @include atoms.circle-button(md);
  --circle-button-border: var(
    --scroll-button-border,
    #{tokens.get-map(tokens.$colors, border-subtle)}
  );
  --circle-button-bg: var(--scroll-button-bg, #{tokens.get-map(tokens.$colors, surface)});
  --circle-button-color: var(
    --scroll-button-color,
    #{tokens.get-map(tokens.$colors, text-primary)}
  );
  --circle-button-font-size: var(--scroll-button-font-size, #{tokens.get-map(tokens.$fonts, md)});
  width: var(
    --scroll-button-size,
    #{tokens.get-map(tokens.$spacer, 6) + tokens.get-map(tokens.$spacer, 4)}
  );
  height: var(
    --scroll-button-size,
    #{tokens.get-map(tokens.$spacer, 6) + tokens.get-map(tokens.$spacer, 4)}
  );
  z-index: 2;
  box-shadow: var(--scroll-button-shadow, 0 8px 18px rgba(15, 27, 61, 0.22));
}

.scroll-button i {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.22));
}

.scroller-wrapper-overlay .scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.scroller-wrapper-overlay .scroll-button-previous {
  left: var(--scroll-button-overlay-offset, #{tokens.get-map(tokens.$spacer, 2)});
}

.scroller-wrapper-overlay .scroll-button-next {
  right: var(--scroll-button-overlay-offset, #{tokens.get-map(tokens.$spacer, 2)});
}

.scroller-wrapper-overlay.scroller-wrapper-vertical .scroll-button {
  left: 50%;
  transform: translateX(-50%);
}

.scroller-wrapper-overlay.scroller-wrapper-vertical .scroll-button-previous {
  top: var(--scroll-button-overlay-offset, #{tokens.get-map(tokens.$spacer, 2)});
}

.scroller-wrapper-overlay.scroller-wrapper-vertical .scroll-button-next {
  top: auto;
  bottom: var(--scroll-button-overlay-offset, #{tokens.get-map(tokens.$spacer, 2)});
}

@include bp.media-down(md) {
  .scroll-button {
    width: var(
      --scroll-button-size-mobile,
      #{tokens.get-map(tokens.$spacer, 6) + tokens.get-map(tokens.$spacer, 5)}
    );
    height: var(
      --scroll-button-size-mobile,
      #{tokens.get-map(tokens.$spacer, 6) + tokens.get-map(tokens.$spacer, 5)}
    );
  }
}
</style>
