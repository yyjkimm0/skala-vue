<script setup>
import { RouterLink, RouterView } from 'vue-router'
import './assets/lab.css'

/**
 * fourth의 내비게이션과 전용 스타일은 유지하고 현재 child route의 View만 교체한다.
 * 고정 목적지 이동은 RouterLink로 선언해 전체 문서를 다시 불러오지 않는다.
 */
</script>

<template>
  <section class="fourth-lab">
    <nav class="app-navigation" aria-label="네 번째 실습 메뉴">
      <RouterLink :to="{ name: 'fourth-weather-home' }">날씨 대시보드</RouterLink>
      <RouterLink :to="{ name: 'fourth-weather-about' }">서비스 소개</RouterLink>
    </nav>

    <!-- 현재 fourth child route와 일치하는 View가 이 위치에 렌더링된다. -->
    <RouterView />
  </section>
</template>
