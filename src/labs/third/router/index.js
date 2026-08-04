export const thirdRoutes = [
  {
    path: '',
    name: 'third-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    redirect: { name: 'third-weather-home' },
  },
]
