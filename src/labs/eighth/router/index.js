export const eighthRoutes = [
  {
    path: '',
    name: 'eighth-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    // 현재 날씨 route와 분리된 Forecast 화면에서 향후 3시간 간격 예보 배열을 다룬다.
    path: 'forecast',
    name: 'eighth-weather-forecast',
    component: () => import('../views/WeatherForecastView.vue'),
  },
  {
    path: 'about',
    name: 'eighth-weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: 'weather/:cityId',
    name: 'eighth-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: 'api-test',
    name: 'eighth-weather-api-test',
    component: () => import('../views/WeatherApiTestView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'eighth-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
