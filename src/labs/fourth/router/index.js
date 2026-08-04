export const fourthRoutes = [
  {
    path: '',
    name: 'fourth-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: 'about',
    name: 'fourth-weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: 'weather/:cityId',
    name: 'fourth-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'fourth-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
