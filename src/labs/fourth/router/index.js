/**
 * 최상위 Router가 /fourth 부모 route의 children으로 결합하는 상대 route 배열이다.
 * 고유한 route name은 RouterLink와 programmatic navigation의 목적지를 식별한다.
 */
export const fourthRoutes = [
  {
    path: '',
    name: 'fourth-weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: 'about',
    name: 'fourth-weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    // `:cityId`는 상세 화면을 식별하는 필수 동적 segment이며 route.params로 전달된다.
    path: 'weather/:cityId',
    name: 'fourth-weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    // 앞선 정상 route에 모두 일치하지 않은 주소만 처리하도록 catch-all은 마지막에 둔다.
    path: ':pathMatch(.*)*',
    name: 'fourth-not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
