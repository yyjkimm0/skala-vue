import { createRouter, createWebHistory } from 'vue-router'
import { fifthRoutes } from '../labs/fifth/router/index.js'
import { firstRoutes } from '../labs/first/router/index.js'
import { fourthRoutes } from '../labs/fourth/router/index.js'
import { secondRoutes } from '../labs/second/router/index.js'
import { sixthRoutes } from '../labs/sixth/router/index.js'
import { thirdRoutes } from '../labs/third/router/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/sixth',
    },
    {
      path: '/first',
      component: () => import('../labs/first/App.vue'),
      meta: { labId: 'first' },
      children: firstRoutes,
    },
    {
      path: '/second',
      component: () => import('../labs/second/App.vue'),
      meta: { labId: 'second' },
      children: secondRoutes,
    },
    {
      path: '/third',
      component: () => import('../labs/third/App.vue'),
      meta: { labId: 'third' },
      children: thirdRoutes,
    },
    {
      path: '/fourth',
      component: () => import('../labs/fourth/App.vue'),
      meta: { labId: 'fourth' },
      children: fourthRoutes,
    },
    {
      path: '/fifth',
      component: () => import('../labs/fifth/App.vue'),
      meta: { labId: 'fifth' },
      children: fifthRoutes,
    },
    {
      path: '/sixth',
      component: () => import('../labs/sixth/App.vue'),
      meta: { labId: 'sixth' },
      children: sixthRoutes,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/sixth',
    },
  ],
})

export default router
