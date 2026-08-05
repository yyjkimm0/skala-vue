import { defineStore } from 'pinia'

/**
 * Home·현재 날씨 Detail·Forecast가 공유하는 표시 단위만 eighth 전용 Store에서 관리한다.
 * SPA route 이동에는 유지되지만 영속화가 없어 전체 새로고침 후 celsius로 초기화된다.
 */
export const useConfigStore = defineStore('eighth-config', {
  // Current Weather와 Forecast의 섭씨 원본이 아니라 화면 표시 정책이다.
  state: () => ({
    unit: 'celsius',
  }),

  getters: {
    // 단위 기호를 state에서 파생해 모든 날씨 화면이 같은 표기를 사용한다.
    unitSymbol: (state) => (state.unit === 'celsius' ? '℃' : '℉'),
  },

  actions: {
    // 컴포넌트가 unit 문자열을 직접 조작하지 않도록 전환 규칙을 Store에 둔다.
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
