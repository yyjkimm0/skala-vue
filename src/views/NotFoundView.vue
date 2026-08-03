<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found-view">
    <h1>페이지를 찾을 수 없습니다.</h1>
    <p>요청한 주소에 해당하는 페이지가 없습니다.</p>
    <RouterLink class="back-link" to="/">메인 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.not-found-view {
  padding: 20px;
  border: 1px solid #d6e0ed;
  border-radius: 12px;
  background: #ffffff;
}

.not-found-view h1 {
  margin-top: 0;
  color: #163a63;
}

.back-link {
  display: inline-block;
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: #ffffff;
  background: #2563eb;
  font-weight: 700;
  text-decoration: none;
}
</style>
