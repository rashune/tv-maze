import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ShowDetailView from '../views/ShowDetailView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from) {
    if (to.name === 'dashboard' && from.name === 'show-detail') {
      // Dashboard restores its own saved scroll position.
      return false
    }

    return { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/show/:id',
      name: 'show-detail',
      component: ShowDetailView,
      props: true,
    },
    {
      path: '/show',
      redirect: '/',
    },
  ],
})
