<script setup>
import { RouterLink, RouterView } from 'vue-router'
import './assets/exercise.css'
</script>

<template>
  <main class="app-container">
    <h1>⛅ 과제 4: 라우터 적용</h1>

    <nav class="app-navigation" aria-label="주요 메뉴">
      <RouterLink to="/">날씨 대시보드</RouterLink>
      <RouterLink to="/about">서비스 소개</RouterLink>
    </nav>

    <RouterView />
  </main>
</template>

<style scoped>
.app-navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
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
</style>
