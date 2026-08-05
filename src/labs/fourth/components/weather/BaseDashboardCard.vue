<!--
  날씨 상태나 Router를 모르는 표현용 외곽이며,
  부모가 전달한 검색·목록 콘텐츠를 기본 slot 위치에 삽입한다.
-->
<template>
  <section class="dashboard-card">
    <slot />
  </section>
</template>

<style scoped>
/* 공통 패널 외곽만 담당하고 내부 콘텐츠의 기능 스타일은 각 자식이 관리한다. */
.dashboard-card {
  min-width: 0;
  padding: 12px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #fff;
}
</style>
