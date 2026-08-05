import { defineStore } from 'pinia'

/**
 * Current Weather와 두 Forecast View가 공유하는 표시 단위를 final 전용 ID로 관리한다.
 * 이전 lab과 상태를 분리하고 SPA 이동 중 유지하지만 영속화가 없어 새로고침하면 초기화된다.
 */
export const useConfigStore = defineStore('final-config', {
  // API의 섭씨 원본이 아닌 화면 표시 정책이며 변경 시 모든 final 소비자가 함께 반응한다.
  state: () => ({
    unit: 'celsius',
  }),

  getters: {
    // 단위 기호를 state에서 파생해 각 View의 중복 조건을 없앤다.
    unitSymbol: (state) => (state.unit === 'celsius' ? '℃' : '℉'),
  },

  actions: {
    // 컴포넌트가 unit 문자열을 직접 조작하지 않도록 전환 규칙을 Store에 둔다.
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
