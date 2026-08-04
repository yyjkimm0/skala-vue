export const firstRoutes = [
  {
    path: '',
    name: 'first-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    redirect: { name: 'first-weather-home' },
  },
]
