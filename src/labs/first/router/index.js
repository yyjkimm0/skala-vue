/** first lab의 진입 화면과 lab 내부 잘못된 주소의 복귀 정책을 정의한다. */
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
