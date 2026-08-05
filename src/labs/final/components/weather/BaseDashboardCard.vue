<script setup>
import { ElCard } from 'element-plus'

/** 기능 상태를 모르는 ElCard 표현 wrapper로, 기본 slot 콘텐츠에 공통 대시보드 외곽을 제공한다. */
</script>

<template>
  <ElCard class="dashboard-card" shadow="never">
    <!-- [refactor] 전달된 영역만 ElCard의 Named Slot으로 렌더링해 빈 레이아웃을 만들지 않는다. -->
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </ElCard>
</template>

<style scoped>
.dashboard-card {
  min-width: 0;
  border-radius: 6px;
}

/* scoped CSS가 직접 닿지 않는 ElCard 내부 body의 여백만 제한적으로 조정한다. */
.dashboard-card :deep(.el-card__body) {
  padding: 12px;
}
</style>
