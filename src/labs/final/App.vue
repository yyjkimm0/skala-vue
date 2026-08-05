<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import 'element-plus/dist/index.css'
import './assets/lab.css'
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
