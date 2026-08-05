export const seventhRoutes = [
  {
    path: '',
    name: 'seventh-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: 'about',
    name: 'seventh-weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: 'weather/:cityId',
    name: 'seventh-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: 'api-test',
    name: 'seventh-weather-api-test',
    component: () => import('../views/WeatherApiTestView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'seventh-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
