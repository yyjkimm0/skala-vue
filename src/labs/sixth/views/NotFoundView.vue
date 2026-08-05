<script setup>
import { RouterLink } from 'vue-router'

/** 상세 route에도 해당하지 않는 sixth 하위 주소를 catch-all에서 안내하고 Home 링크를 제공한다. */
</script>

<template>
  <section class="not-found-view">
    <div class="not-found-card">
      <p class="not-found-icon" aria-hidden="true">☀️ ❓</p>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청한 주소가 존재하지 않거나 아직 개발되지 않았습니다.</p>
      <RouterLink class="back-link" :to="{ name: 'sixth-weather-home' }">
        날씨 메인으로 이동
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.not-found-view {
  padding: 28px 14px;
  border-radius: 6px;
  background: #eef2f7;
  text-align: center;
}

.not-found-card {
  max-width: 300px;
  margin: 0 auto;
  padding: 18px;
  border: 1px solid #d6e0ed;
  border-radius: 8px;
  background: #fff;
}

.not-found-icon {
  margin: 0 0 8px;
  font-size: 2rem;
}

h2 {
  margin: 0 0 8px;
  color: #163a63;
  font-size: 1rem;
}

.not-found-card > p:not(.not-found-icon) {
  margin: 0;
  color: #526276;
  font-size: 0.76rem;
  line-height: 1.5;
}

.back-link {
  display: inline-block;
  margin-top: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  color: #fff;
  background: #2563eb;
  font-size: 0.72rem;
  font-weight: 700;
  text-decoration: none;
}
</style>
