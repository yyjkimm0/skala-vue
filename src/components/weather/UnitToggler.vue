<script setup>
import { useConfigStore } from '../../stores/configStore.js'

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
  gap: 10px;
  color: #526276;
  font-weight: 700;
}

.unit-toggler button {
  padding: 8px 12px;
  border: 1px solid #2563eb;
  border-radius: 8px;
  color: #2563eb;
  background: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.unit-toggler button:hover {
  color: #ffffff;
  background: #2563eb;
}

.unit-toggler button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}
</style>
