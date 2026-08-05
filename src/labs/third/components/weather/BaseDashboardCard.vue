<!--
  공통 대시보드 외곽만 제공하는 표현 컴포넌트다.
  날씨 상태를 알 필요 없이 부모가 전달한 콘텐츠를 같은 패널 형태로 감싼다.
-->
<template>
  <section class="dashboard-card">
    <!-- 부모가 전달한 화면 콘텐츠를 공통 카드 본문 위치에 삽입한다. -->
    <slot />
  </section>
</template>

<style scoped>
/* 이 외곽 스타일은 BaseDashboardCard 인스턴스 내부에만 적용된다. */
.dashboard-card {
  min-width: 0;
  padding: 12px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #fff;
}
</style>
