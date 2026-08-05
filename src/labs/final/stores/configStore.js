import { defineStore } from 'pinia'

// final 전용 Store ID로 단위 상태를 이전 lab과 공유하지 않고 독립적으로 유지한다.
export const useConfigStore = defineStore('final-config', {
  state: () => ({
    unit: 'celsius',
  }),

  getters: {
    unitSymbol: (state) => (state.unit === 'celsius' ? '℃' : '℉'),
  },

  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
