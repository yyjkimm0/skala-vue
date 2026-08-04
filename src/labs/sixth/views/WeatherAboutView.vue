<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="about-view">
    <h1>ℹ️ 서비스 소개</h1>
    <p>본 앱은 Vue 3 및 Vue Router 기반으로 제작된 실습용 기상 관측 대시보드 시스템입니다.</p>

    <ul>
      <li>components/weather 또는 components/exercise 폴더 내부의 독립 부품 연동</li>
      <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
      <li>URL 경로와 도시 ID를 활용한 지역별 상세 기상 정보 표시</li>
      <li>Pinia를 활용한 섭씨·화씨 단위 상태 공유</li>
    </ul>

    <p>화면에 표시되는 날씨 정보는 외부 API가 아닌 고정 Mock Data입니다.</p>

    <RouterLink class="back-link" :to="{ name: 'sixth-weather-home' }">
      대시보드 홈으로 이동
    </RouterLink>
  </section>
</template>

<style scoped>
.about-view {
  padding: 14px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #ffffff;
}

.about-view h1 {
  margin: 0 0 10px;
  color: #163a63;
  font-size: 1.05rem;
}

.about-view li + li {
  margin-top: 5px;
}

.back-link {
  display: block;
  margin-top: 8px;
  padding: 7px 10px;
  border-radius: 4px;
  color: #ffffff;
  background: #2563eb;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
}
</style>
