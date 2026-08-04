export const fifthRoutes = [
  {
    path: '',
    name: 'fifth-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: 'about',
    name: 'fifth-weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: 'weather/:cityId',
    name: 'fifth-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'fifth-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
