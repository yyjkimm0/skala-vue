/**
 * 최상위 Router가 /sixth 아래에 결합하는 상대 자식 route 배열이다.
 * Home·About·동적 상세 뒤에 독립 API 점검 화면을 두고 catch-all을 마지막에 배치한다.
 */
export const sixthRoutes = [
  {
    path: '',
    name: 'sixth-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: 'about',
    name: 'sixth-weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    // cityId가 유효하지 않아도 상세 경로에 매칭되며 View가 지원 도시 여부를 구분한다.
    path: 'weather/:cityId',
    name: 'sixth-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    // 사용자 대시보드의 fallback과 분리해 실제 API 성공·실패 자체를 확인한다.
    path: 'api-test',
    name: 'sixth-weather-api-test',
    component: () => import('../views/WeatherApiTestView.vue'),
  },
  {
    path: ':pathMatch(.*)*',
    name: 'sixth-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
