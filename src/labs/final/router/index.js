export const finalRoutes = [
  {
    path: '',
    name: 'final-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: 'forecast',
    name: 'final-weather-forecast',
    component: () => import('../views/WeatherForecastView.vue'),
  },
  {
    path: 'forecast/:cityId/:localDate',
    name: 'final-weather-forecast-detail',
    component: () => import('../views/WeatherForecastDetailView.vue'),
  },
  {
    path: 'about',
    name: 'final-weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: 'weather/:cityId',
    name: 'final-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: 'api-test',
    name: 'final-weather-api-test',
    component: () => import('../views/WeatherApiTestView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'final-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
