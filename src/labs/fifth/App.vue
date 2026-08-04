<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import './assets/lab.css'
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
