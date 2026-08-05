<script setup>
import { RouterLink } from 'vue-router'

/** 상태 로직 없이 서비스 정보를 표시하고 RouterLink로 Home 복귀 경로를 제공한다. */
</script>

<template>
  <section class="about-view">
    <h2>ℹ️ 서비스 소개</h2>
    <p>이 앱은 Vue 3와 Vue Router로 만든 도시별 날씨 실습 대시보드입니다.</p>

    <h3>현재 구현된 기능</h3>
    <ul>
      <li>도시 검색</li>
      <li>날씨 카드 선택</li>
      <li>상세 페이지 이동</li>
      <li>클라이언트 사이드 라우팅</li>
    </ul>

    <p>화면에 표시되는 날씨 정보는 외부 API가 아닌 고정 Mock Data입니다.</p>

    <RouterLink class="back-link" :to="{ name: 'fourth-weather-home' }">
      ← 메인 대시보드로 돌아가기
    </RouterLink>
  </section>
</template>

<style scoped>
.about-view {
  padding: 14px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #fff;
}

h2,
h3,
p {
  margin-top: 0;
}

h2 {
  color: #163a63;
  font-size: 1rem;
}

h3 {
  margin-top: 16px;
  font-size: 0.88rem;
}

p,
li {
  font-size: 0.78rem;
  line-height: 1.6;
}

ul {
  padding-left: 20px;
}

li + li {
  margin-top: 3px;
}

.back-link {
  display: inline-block;
  margin-top: 4px;
  padding: 6px 9px;
  border-radius: 4px;
  color: #fff;
  background: #2563eb;
  font-size: 0.74rem;
  font-weight: 700;
  text-decoration: none;
}
</style>
