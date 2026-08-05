import { defineStore } from 'pinia'

/**
 * fifth에서 사용할 화면 표시 단위를 전역으로 관리한다.
 * 목록과 상세 화면이 prop 연결 없이도 같은 단위 정책과 변경 규칙을 공유한다.
 * SPA의 route 이동 중에는 유지되지만 별도 영속화가 없어 새로고침하면 초기값으로 시작한다.
 */
// 여러 lab Store가 같은 Pinia에 등록되므로 fifth 전용 id로 상태 모듈을 구분한다.
export const useConfigStore = defineStore('fifth-config', {
  // 원본 날씨값과 분리된 표시 단위이며, 변경 시 이 Store를 읽는 화면이 함께 갱신된다.
  state: () => ({
    unit: 'celsius',
  }),

  getters: {
    // 현재 state에서 표시 기호를 파생해 컴포넌트마다 같은 조건문을 반복하지 않게 한다.
    unitSymbol: (state) => (state.unit === 'celsius' ? '℃' : '℉'),
  },

  actions: {
    // 단위 전환 규칙을 Store에 모아 컴포넌트가 unit 문자열을 직접 대입하지 않게 한다.
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
