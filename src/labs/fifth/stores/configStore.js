import { defineStore } from 'pinia'

export const useConfigStore = defineStore('fifth-config', {
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
