<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import './assets/lab.css'
</script>

<template>
  <section class="sixth-app">
    <nav class="app-navigation" aria-label="주요 메뉴">
      <div class="app-navigation__links">
        <RouterLink :to="{ name: 'sixth-weather-home' }">날씨 대시보드</RouterLink>
        <RouterLink :to="{ name: 'sixth-weather-about' }">서비스 소개</RouterLink>
      </div>
      <UnitToggler />
    </nav>

    <RouterView />
  </section>
</template>

<style scoped>
.app-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
  padding: 9px 10px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #ffffff;
}

.app-navigation__links {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.app-navigation a {
  padding: 4px 1px;
  border-bottom: 2px solid transparent;
  color: #526276;
  font-weight: 700;
  text-decoration: none;
}

.app-navigation a:hover {
  color: #2563eb;
}

.app-navigation a.router-link-exact-active {
  border-bottom-color: #2563eb;
  color: #2563eb;
}

@media (max-width: 540px) {
  .app-navigation {
    align-items: flex-start;
    flex-direction: column;
  }

  .app-navigation__links {
    flex-wrap: wrap;
  }
}
</style>
