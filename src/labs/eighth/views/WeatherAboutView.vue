<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="about-view">
    <h2>ℹ️ 서비스 소개</h2>
    <p>이 앱은 실시간 날씨와 도시별 5일 단기 예보를 제공하는 Element Plus 기반 대시보드입니다.</p>

    <h3>현재 구현된 기능</h3>
    <ul>
      <li>도시 검색과 날씨 카드 선택</li>
      <li>Vue Router 기반 상세 페이지 이동</li>
      <li>Pinia 기반 섭씨·화씨 단위 상태 공유</li>
      <li>Axios와 OpenWeather를 이용한 실시간 날씨 조회</li>
      <li>API 실패 도시의 Mock Data fallback</li>
      <li>Element Plus를 적용한 일관된 사용자 인터페이스</li>
      <li>서울·수원·부산의 5일 단기 예보 조회</li>
    </ul>

    <p>
      현재 날씨와 단기 예보는 OpenWeather API를 사용하며, 3시간 간격 예보를 날짜별 대표 예보로
      표시합니다. API Key는 환경변수로 관리합니다.
    </p>

    <RouterLink class="back-link" :to="{ name: 'eighth-weather-home' }">
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
