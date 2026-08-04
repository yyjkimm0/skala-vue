export const firstRoutes = [
  {
    path: '',
    name: 'first-unavailable',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'first-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
