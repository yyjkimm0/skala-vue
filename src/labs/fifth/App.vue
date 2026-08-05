<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import './assets/lab.css'

/**
 * fourth의 route shell에 전역 단위 전환 UI를 추가한다.
 * Pinia는 최상위 앱에서 한 번 설치되며 fifth의 View들은 같은 config Store를 공유한다.
 */
</script>

<template>
  <section class="fifth-lab">
    <nav class="app-navigation" aria-label="다섯 번째 과제 메뉴">
      <div class="app-navigation__links">
        <RouterLink :to="{ name: 'fifth-weather-home' }">날씨 대시보드</RouterLink>
        <RouterLink :to="{ name: 'fifth-weather-about' }">서비스 소개</RouterLink>
      </div>

      <UnitToggler />
    </nav>

    <RouterView />
  </section>
</template>
