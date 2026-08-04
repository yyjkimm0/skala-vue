export const fifthRoutes = [
  {
    path: '',
    name: 'fifth-unavailable',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'fifth-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
