export const secondRoutes = [
  {
    path: '',
    name: 'second-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    redirect: { name: 'second-weather-home' },
  },
]
