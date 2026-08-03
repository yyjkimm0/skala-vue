<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="about-view">
    <h1>서비스 소개</h1>
    <p>이 앱은 도시별 현재 날씨를 검색하고 상세 정보로 확인할 수 있는 대시보드입니다.</p>

    <h2>현재 구현된 기능</h2>
    <ul>
      <li>도시 검색</li>
      <li>날씨 카드 선택</li>
      <li>상세 페이지 이동</li>
      <li>Vue Router 기반 화면 전환</li>
    </ul>

    <p>화면에 표시되는 날씨 정보는 외부 API가 아닌 고정 Mock Data입니다.</p>

    <RouterLink class="back-link" to="/">메인 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.about-view {
  padding: 20px;
  border: 1px solid #d6e0ed;
  border-radius: 12px;
  background: #ffffff;
}

.about-view h1 {
  margin-top: 0;
  color: #163a63;
}

.about-view h2 {
  margin-top: 24px;
  font-size: 1.2rem;
}

.about-view li + li {
  margin-top: 6px;
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
