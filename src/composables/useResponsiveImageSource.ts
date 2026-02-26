import { computed, onMounted, ref, type Ref } from 'vue'

interface Options {
  mediaQuery?: string
}

export function useResponsiveImageSource(
  mobileSrc: Ref<string | null>,
  desktopSrc: Ref<string | null>,
  options: Options = {}
) {
  const { mediaQuery = '(min-width: 992px)' } = options
  const useDesktopImage = ref(false)

  onMounted(() => {
    useDesktopImage.value = window.matchMedia(mediaQuery).matches
  })

  const src = computed(() => {
    if (useDesktopImage.value) {
      return desktopSrc.value ?? mobileSrc.value
    }

    return mobileSrc.value ?? desktopSrc.value
  })

  return {
    src,
  }
}
