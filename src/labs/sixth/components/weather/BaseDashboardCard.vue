<template>
  <!-- 날씨 데이터나 Router를 모르는 표현 컴포넌트로, 기본 slot을 공통 외곽에 배치한다. -->
  <section class="dashboard-card">
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  min-width: 0;
  padding: 12px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #fff;
}
</style>
