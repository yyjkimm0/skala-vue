export const sixthRoutes = [
  {
    path: '',
    name: 'sixth-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: 'about',
    name: 'sixth-weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: 'weather/:cityId',
    name: 'sixth-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: 'api-test',
    name: 'sixth-weather-api-test',
    component: () => import('../views/WeatherApiTestView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'sixth-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
