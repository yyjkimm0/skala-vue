<script setup>
import { ElSwitch } from 'element-plus'
import { useConfigStore } from '../../stores/configStore.js'

/**
 * ElSwitch의 celsius·fahrenheit 값을 config Store의 전역 단위 상태와 연결한다.
 * 자체 상태를 복제하지 않고 변경 이벤트를 기존 Store action에 위임한다.
 */
const configStore = useConfigStore()

// 같은 값이 다시 전달된 경우 action을 호출하지 않아 한 번의 조작이 한 번의 전환만 만들게 한다.
const handleUnitChange = (nextUnit) => {
  if (configStore.unit !== nextUnit) {
    configStore.toggleUnit()
  }
}
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-toggler__label">온도 단위:</span>
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
