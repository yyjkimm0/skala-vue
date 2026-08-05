<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import 'element-plus/dist/index.css'
import './assets/lab.css'

/**
 * seventh의 Router·Pinia·Axios·Element Plus 구조에 5일·3시간 Forecast 화면을 추가한다.
 * 3시간 예보를 날짜별 대표 카드로 가공하고 도시 선택과 전체·비 예보 필터를 제공한다.
 * 선택 날짜의 별도 상세 route는 아직 도입하지 않는다.
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
