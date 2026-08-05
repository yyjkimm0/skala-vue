<script setup>
import { ElCard } from 'element-plus'

/**
 * Element Plus Card로 대시보드의 공통 외곽을 제공하는 표현용 wrapper다.
 * 내부 기능 상태를 알지 않고 전달받은 콘텐츠와 패널 디자인의 책임을 분리한다.
 */
</script>

<template>
  <ElCard class="dashboard-card" shadow="never">
    <slot />
  </ElCard>
</template>

<style scoped>
.dashboard-card {
  min-width: 0;
  border-radius: 6px;
}

/* scoped CSS가 직접 선택하기 어려운 ElCard 내부 body의 여백만 제한적으로 조정한다. */
.dashboard-card :deep(.el-card__body) {
  padding: 12px;
}
</style>
