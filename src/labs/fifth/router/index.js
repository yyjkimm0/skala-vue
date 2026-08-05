/**
 * 최상위 Router가 /fifth 아래에 결합하는 상대 경로 배열이다.
 * 고정 경로와 cityId 상세 경로를 먼저 검사하고, 마지막 catch-all이 나머지 주소를 처리한다.
 */
export const fifthRoutes = [
  {
    path: '',
    name: 'fifth-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: 'about',
    name: 'fifth-weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    // URL의 cityId가 상세 View가 같은 Mock Data에서 도시를 다시 찾는 기준이 된다.
    path: 'weather/:cityId',
    name: 'fifth-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    // 잘못된 cityId는 상세 경로에 매칭되며, 이 catch-all은 그 밖의 알 수 없는 경로를 맡는다.
    path: ':pathMatch(.*)*',
    name: 'fifth-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
