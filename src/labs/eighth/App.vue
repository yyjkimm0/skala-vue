<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import 'element-plus/dist/index.css'
import './assets/lab.css'

/**
 * seventh의 Router·Pinia·Axios·Element Plus 구조에 5일·3시간 Forecast 화면을 추가한다.
 * 3시간 예보를 날짜별 대표 카드로 가공하고 도시 선택과 전체·비 예보 필터를 제공한다.
 * Home·현재 날씨 Detail·Forecast가 같은 shell과 Store 단위를 공유하며 예보 상세 route는 아직 없다.
 */
</script>

<template>
  <section class="eighth-lab">
    <nav class="app-navigation" aria-label="여덟 번째 실습 메뉴">
      <div class="app-navigation__links">
        <RouterLink :to="{ name: 'eighth-weather-home' }">날씨 대시보드</RouterLink>
        <RouterLink :to="{ name: 'eighth-weather-forecast' }">단기 예보</RouterLink>
        <RouterLink :to="{ name: 'eighth-weather-about' }">서비스 소개</RouterLink>
      </div>
      <UnitToggler />
    </nav>
    <RouterView />
  </section>
</template>
