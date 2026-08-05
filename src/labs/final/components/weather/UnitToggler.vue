<script setup>
import { ElSwitch } from 'element-plus'
import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()

const handleUnitChange = (nextUnit) => {
  if (configStore.unit !== nextUnit) {
    configStore.toggleUnit()
  }
}
</script>

<template>
  <div class="unit-toggler">
    <ElSwitch
      :model-value="configStore.unit"
      active-value="fahrenheit"
      inactive-value="celsius"
      active-text="℉"
      inactive-text="℃"
      aria-label="온도 단위 전환"
      @change="handleUnitChange"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  white-space: nowrap;
}

.unit-toggler__label {
  color: #475569;
  font-size: 0.8rem;
  font-weight: 700;
}
</style>
