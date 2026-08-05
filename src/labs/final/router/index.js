export const finalRoutes = [
  {
    path: '',
    name: 'final-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    // 목록의 선택 도시는 복귀 편의를 위한 선택 상태이므로 query로 별도 보존한다.
    path: 'forecast',
    name: 'final-weather-forecast',
    component: () => import('../views/WeatherForecastView.vue'),
  },
  {
    // 상세 화면에 필수인 도시와 날짜를 URL segment로 받아 직접 접근과 새로고침을 지원한다.
    // 구체적인 상세 route를 final catch-all보다 먼저 판정한다.
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
