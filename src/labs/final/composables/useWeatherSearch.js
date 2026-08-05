import { computed, ref, watchEffect } from 'vue'

// [refactor] 검색 상태와 파생 결과를 분리해 부모가 API·선택·화면 구성에 집중하게 한다.
export const useWeatherSearch = (weatherItems) => {
  const searchQuery = ref('')

  // API와 fallback을 합친 내부 모델에서 도시명 부분 검색을 수행하고 빈 검색어이면 전체를 반환한다.
  const filteredWeatherList = computed(() => {
    const normalizedQuery = searchQuery.value.trim().toLowerCase()

    if (!normalizedQuery) {
      return weatherItems.value
    }

    return weatherItems.value.filter((weather) =>
      weather.name.toLowerCase().includes(normalizedQuery),
    )
  })

  const updateSearchQuery = (value) => {
    // ElInput의 model update·clear·IME 값을 검색 상태에 반영한다.
    searchQuery.value = value
  }

  watchEffect(() => {
    // 최초 실행 후 검색어와 computed 결과를 자동 추적하고 API 배열 교체에도 다시 반응한다.
    const query = searchQuery.value.trim()
    const resultNames = filteredWeatherList.value.map((weather) => weather.name)

    console.log('[watchEffect] 검색 상태')
    console.log(`검색어: ${query || '입력 없음'}`)
    console.log(`검색 결과: ${resultNames.length ? resultNames.join(', ') : '검색 결과 없음'}`)
  })

  return {
    searchQuery,
    filteredWeatherList,
    updateSearchQuery,
  }
}
