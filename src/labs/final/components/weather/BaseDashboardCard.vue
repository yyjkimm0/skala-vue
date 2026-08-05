<script setup>
import { ElCard } from 'element-plus'
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

.dashboard-card :deep(.el-card__body) {
  padding: 12px;
}
</style>
