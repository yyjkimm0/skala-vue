<script setup>
import { ElSwitch } from 'element-plus'
import { useConfigStore } from '../../stores/configStore.js'

/**
 * ElSwitch가 Current Weather와 두 Forecast View의 공통 final Store 단위를 표시한다.
 * 로컬 상태를 복제하지 않고 실제 전환 규칙은 Store action에 위임한다.
 */
const configStore = useConfigStore()

// 같은 문자열 값이 다시 전달되면 action을 생략해 한 조작이 중복 전환되지 않게 한다.
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
