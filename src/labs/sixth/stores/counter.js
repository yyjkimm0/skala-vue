import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/** 현재 sixth 날씨 기능에서 import하지 않는 초기 Pinia 예제 Store다. */
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
