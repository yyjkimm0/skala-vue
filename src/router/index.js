import { createRouter, createWebHistory } from 'vue-router'
import { eighthRoutes } from '../labs/eighth/router/index.js'
import { finalRoutes } from '../labs/final/router/index.js'
import { fifthRoutes } from '../labs/fifth/router/index.js'
import { firstRoutes } from '../labs/first/router/index.js'
import { fourthRoutes } from '../labs/fourth/router/index.js'
import { secondRoutes } from '../labs/second/router/index.js'
import { seventhRoutes } from '../labs/seventh/router/index.js'
import { sixthRoutes } from '../labs/sixth/router/index.js'
import { thirdRoutes } from '../labs/third/router/index.js'

/**
 * 앱에서 유일한 Router 인스턴스다.
 * 각 lab이 제공하는 자식 route 배열을 부모 경로 아래에 결합한다.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/final',
    },
    {
      path: '/first',
      component: () => import('../labs/first/App.vue'),
      // App shell은 이 값을 통해 현재 제목과 selector 선택값을 동기화한다.
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
      path: '/seventh',
      component: () => import('../labs/seventh/App.vue'),
      meta: { labId: 'seventh' },
      children: seventhRoutes,
    },
    {
      path: '/eighth',
      component: () => import('../labs/eighth/App.vue'),
      meta: { labId: 'eighth' },
      children: eighthRoutes,
    },
    {
      path: '/final',
      component: () => import('../labs/final/App.vue'),
      meta: { labId: 'final' },
      children: finalRoutes,
    },
    {
      path: '/:pathMatch(.*)*',
      // 어느 lab에도 속하지 않는 주소는 현재 최종 앱의 시작 화면으로 안내한다.
      redirect: '/final',
    },
  ],
})

export default router
