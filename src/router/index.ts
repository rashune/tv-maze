import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ShowDetailView from '../views/ShowDetailView.vue'

export const router = createRouter({
  history: createWebHistory(),
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
