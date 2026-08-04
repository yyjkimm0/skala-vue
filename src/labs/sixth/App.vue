<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import './assets/lab.css'
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
