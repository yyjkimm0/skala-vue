<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import 'element-plus/dist/index.css'
import './assets/lab.css'

/**
 * sixth의 Router·Pinia·Axios 흐름은 유지하고 입력과 상태 표현을 Element Plus로 통일한다.
 * 라이브러리는 전역 plugin으로 등록하지 않고 각 SFC가 필요한 컴포넌트를 직접 가져온다.
 * Forecast 확장은 아직 도입하지 않으며 이 App에서 seventh 범위에만 기본 CSS를 적용한다.
 */
</script>

<template>
  <section class="seventh-lab">
    <nav class="app-navigation" aria-label="일곱 번째 과제 메뉴">
      <div class="app-navigation__links">
        <RouterLink :to="{ name: 'seventh-weather-home' }">날씨 대시보드</RouterLink>
        <RouterLink :to="{ name: 'seventh-weather-about' }">서비스 소개</RouterLink>
      </div>
      <UnitToggler />
    </nav>
    <RouterView />
  </section>
</template>
