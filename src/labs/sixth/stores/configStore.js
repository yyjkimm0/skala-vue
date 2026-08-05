import { defineStore } from 'pinia'

/**
 * 목록과 상세 route가 공유하는 온도 표시 정책만 sixth 전용 Store에서 관리한다.
 * SPA 이동 중에는 유지되지만 영속화가 없어 전체 새로고침 후 celsius로 초기화된다.
 */
export const useConfigStore = defineStore('sixth-config', {
  // API와 fallback의 섭씨 원본이 아니라 화면에 적용할 단위 상태다.
  state: () => ({
    unit: 'celsius',
  }),

  getters: {
    // 단위 기호를 state에서 파생해 모든 Store 소비자가 같은 표시 규칙을 사용한다.
    unitSymbol: (state) => (state.unit === 'celsius' ? '℃' : '℉'),
  },

  actions: {
    // 컴포넌트가 문자열을 직접 대입하지 않도록 전환 규칙을 Store에 둔다.
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
