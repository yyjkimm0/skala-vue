export const secondRoutes = [
  {
    path: '',
    name: 'second-unavailable',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'second-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
