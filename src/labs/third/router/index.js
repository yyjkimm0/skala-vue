export const thirdRoutes = [
  {
    path: '',
    name: 'third-unavailable',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'third-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
