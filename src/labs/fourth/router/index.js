export const fourthRoutes = [
  {
    path: '',
    name: 'fourth-unavailable',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'fourth-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
