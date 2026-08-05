/**
 * 최상위 Router가 /eighth 아래에 결합하는 상대 자식 route 배열이다.
 * 현재 날씨 화면들에 고정 Forecast route를 더하고 알 수 없는 경로용 catch-all을 마지막에 둔다.
 */
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
    // 유효하지 않은 cityId도 경로에는 매칭되고 현재 날씨 Detail View가 도시 유효성을 판단한다.
    path: 'weather/:cityId',
    name: 'eighth-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    // 대시보드 fallback과 분리해 실제 Current Weather 연결만 확인한다.
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
