import { defineStore } from 'pinia'

/**
 * Home과 Detail이 공유하는 온도 표시 정책만 seventh 전용 Store에서 관리한다.
 * SPA route 이동 중에는 유지되지만 영속화가 없어 새로고침하면 celsius로 초기화된다.
 */
export const useConfigStore = defineStore('seventh-config', {
  // API와 fallback의 섭씨 원본이 아닌 화면 표시 단위 상태다.
  state: () => ({
    unit: 'celsius',
  }),

  getters: {
    // 단위 기호를 파생해 ElSwitch와 날씨 화면이 같은 표시 규칙을 사용한다.
    unitSymbol: (state) => (state.unit === 'celsius' ? '℃' : '℉'),
  },

  actions: {
    // 컴포넌트가 unit 문자열을 직접 조작하지 않도록 전환 규칙을 한 곳에 둔다.
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
