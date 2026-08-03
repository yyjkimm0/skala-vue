<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
import './assets/exercise.css'
</script>

<template>
  <main class="app-container">
    <h1>⛅ 과제 4: 라우터 적용</h1>

    <nav class="app-navigation" aria-label="주요 메뉴">
      <div class="app-navigation__links">
        <RouterLink to="/">날씨 대시보드</RouterLink>
        <RouterLink to="/about">서비스 소개</RouterLink>
      </div>
      <UnitToggler />
    </nav>

    <RouterView />
  </main>
</template>

<style scoped>
.app-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.app-navigation__links {
  display: flex;
  gap: 12px;
}

.app-navigation a {
  padding: 8px 12px;
  border-radius: 8px;
  color: #526276;
  font-weight: 700;
  text-decoration: none;
}

.app-navigation a:hover {
  color: #163a63;
  background: #e8eef6;
}

.app-navigation a.router-link-exact-active {
  color: #ffffff;
  background: #2563eb;
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
