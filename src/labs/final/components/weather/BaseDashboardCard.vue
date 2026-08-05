<script setup>
import { ElCard } from 'element-plus'

/** 기능 상태를 모르는 ElCard 표현 wrapper로, 기본 slot 콘텐츠에 공통 대시보드 외곽을 제공한다. */
</script>

<template>
  <ElCard class="dashboard-card" shadow="never">
    <!-- Named Slot을 body 안에 배치해 eighth와 같은 compact한 본문 간격을 유지한다. -->
    <div v-if="$slots.header" class="dashboard-card__header">
      <slot name="header" />
    </div>

    <slot />

    <div v-if="$slots.footer" class="dashboard-card__footer">
      <slot name="footer" />
    </div>
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

.dashboard-card__footer {
  margin-top: 10px;
}
</style>
