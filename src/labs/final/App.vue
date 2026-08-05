<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import 'element-plus/dist/index.css'
import './assets/lab.css'

/**
 * eighth의 현재 날씨와 날짜별 Forecast를 독립 복사한 final 전용 route shell이다.
 * final은 날짜별 대표 카드에서 선택 날짜의 전체 3시간 예보를 여는 상세 흐름을 추가한다.
 * 전용 route 이름과 Store ID를 사용해 이전 lab의 화면 상태와 충돌하지 않는다.
 */
</script>

<template>
  <section class="final-lab">
    <nav class="app-navigation" aria-label="최종 날씨 앱 메뉴">
      <div class="app-navigation__links">
        <RouterLink :to="{ name: 'final-weather-home' }">날씨 대시보드</RouterLink>
        <RouterLink :to="{ name: 'final-weather-forecast' }">단기 예보</RouterLink>
        <RouterLink :to="{ name: 'final-weather-about' }">서비스 소개</RouterLink>
      </div>
      <UnitToggler />
    </nav>
    <RouterView />
  </section>
</template>
