<script setup>
import { useConfigStore } from '../../stores/configStore.js'

/**
 * 단위를 로컬에 복제하지 않고 config Store의 현재 값과 기호를 표시한다.
 * 버튼 입력을 Store action에 위임해 목록과 상세 화면을 함께 갱신한다.
 */
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span>현재 단위: {{ configStore.unitSymbol }}</span>
    <button type="button" @click="configStore.toggleUnit">
      {{ configStore.unit === 'celsius' ? '화씨로 전환' : '섭씨로 전환' }}
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 6px;
  color: #526276;
  font-size: 0.7rem;
  font-weight: 700;
}

button {
  padding: 4px 6px;
  border: 1px solid #2563eb;
  border-radius: 4px;
  color: #2563eb;
  background: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  color: #fff;
  background: #2563eb;
}

button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}
</style>
