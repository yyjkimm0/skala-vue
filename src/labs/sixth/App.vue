<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import './assets/lab.css'

/**
 * fifth의 Router와 Pinia 단위 상태를 유지하면서 Mock 중심 화면을 OpenWeather API로 확장한다.
 * sixth는 Axios 요청, 응답 매핑, loading·error·fallback 처리를 추가하며 Element Plus는 사용하지 않는다.
 */
</script>

<template>
  <section class="sixth-lab">
    <nav class="app-navigation" aria-label="여섯 번째 실습 메뉴">
      <div class="app-navigation__links">
        <RouterLink :to="{ name: 'sixth-weather-home' }">날씨 대시보드</RouterLink>
        <RouterLink :to="{ name: 'sixth-weather-about' }">서비스 소개</RouterLink>
      </div>
      <UnitToggler />
    </nav>
    <RouterView />
  </section>
</template>
