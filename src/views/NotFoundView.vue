<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found-page">
    <div class="not-found-card">
      <div class="not-found-icon" aria-hidden="true">☀️ ❓</div>

      <h2>페이지를 찾을 수 없습니다.</h2>

      <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>

      <RouterLink class="home-link" to="/">날씨 메인으로 이동</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 500px;
  margin-top: 16px;
  padding: 120px 24px 72px;
  background: #f8fafc;
}

.not-found-card {
  width: min(300px, 100%);
  padding: 52px 30px 44px;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgb(15 23 42 / 14%);
  text-align: center;
}

.not-found-icon {
  margin-bottom: 28px;
  font-size: 3.6rem;
  line-height: 1;
  letter-spacing: 10px;
}

.not-found-card h2 {
  margin: 0 0 20px;
  color: #1f2937;
  font-size: 1.2rem;
  font-weight: 800;
}

.not-found-card p {
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 0.82rem;
  line-height: 1.7;
}

.home-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 20px;
  border-radius: 999px;
  color: #ffffff;
  background: #168cf4;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
}

.home-link:hover {
  background: #0877d1;
}

.home-link:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

@media (max-width: 420px) {
  .not-found-page {
    min-height: 420px;
    padding: 80px 18px 56px;
  }

  .not-found-card {
    width: 100%;
    padding: 42px 22px 36px;
  }
}
</style>
