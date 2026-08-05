<script setup>
import { RouterLink, RouterView } from 'vue-router'
import './assets/lab.css'
</script>

<template>
  <section class="fourth-lab">
    <nav class="app-navigation" aria-label="네 번째 실습 메뉴">
      <RouterLink :to="{ name: 'fourth-weather-home' }">날씨 대시보드</RouterLink>
      <RouterLink :to="{ name: 'fourth-weather-about' }">서비스 소개</RouterLink>
    </nav>

    <RouterView />
  </section>
</template>
