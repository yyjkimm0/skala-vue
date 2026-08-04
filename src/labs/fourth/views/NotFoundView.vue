<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="unavailable-view">
    <h2>4일차 과제는 아직 복원되지 않았습니다.</h2>
    <p>Git 이력에서 해당 시점의 결과물을 복원할 예정입니다.</p>
    <RouterLink :to="{ name: 'sixth-weather-home' }">최신 과제로 이동</RouterLink>
  </section>
</template>

<style scoped>
.unavailable-view {
  padding: 20px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #ffffff;
}

.unavailable-view h2 {
  margin-top: 0;
  color: #163a63;
  font-size: 1rem;
}
</style>
