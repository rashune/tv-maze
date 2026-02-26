import { nextTick, onMounted, watch, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { createScrollMemory } from '../utils/scrollMemory'

interface Options {
  ready?: Ref<boolean>
}

export function useRouteScrollMemory(key: string, options: Options = {}): void {
  const scrollMemory = createScrollMemory(key)
  let restored = false

  async function restoreOnce(): Promise<void> {
    if (restored) {
      return
    }

    await nextTick()
    const savedScrollPosition = scrollMemory.consume()
    if (savedScrollPosition !== null) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollPosition, behavior: 'auto' })
      })
    }
    restored = true
  }

  onMounted(() => {
    if (!options.ready || options.ready.value) {
      void restoreOnce()
    }
  })

  if (options.ready) {
    watch(
      options.ready,
      (isReady, wasReady) => {
        if (isReady && !wasReady) {
          void restoreOnce()
        }
      },
      { flush: 'post' }
    )
  }

  onBeforeRouteLeave(() => {
    scrollMemory.save(window.scrollY)
  })
}
