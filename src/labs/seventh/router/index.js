/**
 * 최상위 Router가 /seventh 아래에 결합하는 상대 자식 route 배열이다.
 * Element Plus는 표현 계층이며 Home·About·동적 상세·API Test·catch-all 책임은 그대로 유지한다.
 */
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
    // 유효하지 않은 cityId도 상세 경로에 매칭되고 View가 지원 도시 여부를 판단한다.
    path: 'weather/:cityId',
    name: 'seventh-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    // 대시보드 fallback과 분리해 실제 Current Weather 연결 상태를 확인한다.
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
