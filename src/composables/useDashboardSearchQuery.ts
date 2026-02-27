import { provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { horizontalScrollResetKey } from '../injectionKeys'

function normalizeSearchQueryParam(raw: unknown): string {
  if (Array.isArray(raw)) {
    const firstValue = raw[0]
    return typeof firstValue === 'string' ? firstValue : ''
  }

  return typeof raw === 'string' ? raw : ''
}

export function useDashboardSearchQuery() {
  const route = useRoute()
  const router = useRouter()
  const searchQuery = ref(normalizeSearchQueryParam(route.query.q))
  const horizontalResetToken = ref(0)

  provide(horizontalScrollResetKey, horizontalResetToken)

  watch(
    () => route.query.q,
    (rawQuery) => {
      const routeQuery = normalizeSearchQueryParam(rawQuery)
      if (routeQuery !== searchQuery.value) {
        searchQuery.value = routeQuery
      }
    }
  )

  watch(
    searchQuery,
    (nextQuery) => {
      horizontalResetToken.value += 1

      const currentRouteQuery = normalizeSearchQueryParam(route.query.q)
      if (nextQuery === currentRouteQuery) {
        return
      }

      const nextRouteQuery = { ...route.query }

      if (nextQuery.trim()) {
        nextRouteQuery.q = nextQuery
      } else {
        delete nextRouteQuery.q
      }

      void router.replace({
        name: 'dashboard',
        query: nextRouteQuery,
      })
    },
    { flush: 'post' }
  )

  return {
    searchQuery,
  }
}
