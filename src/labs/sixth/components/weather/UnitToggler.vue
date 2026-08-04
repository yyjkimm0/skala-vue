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
  gap: 6px;
  color: #526276;
  font-size: 0.72rem;
  font-weight: 700;
}

.unit-toggler button {
  padding: 4px 6px;
  border: 1px solid #a9b9cc;
  border-radius: 3px;
  color: #526276;
  background: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.unit-toggler button:hover {
  color: #163a63;
  background: #f3f6fb;
}

.unit-toggler button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}
</style>
