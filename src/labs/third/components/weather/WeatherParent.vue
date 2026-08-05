<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

/**
 * second의 단일 컴포넌트를 부모와 표현·입력 자식으로 분리한 단계다.
 * 부모가 상태와 흐름을 소유하고 자식은 props로 값을 받아 emit으로 사용자 의도를 전달한다.
 * 상세 Router·Pinia·API 연동 전의 Mock Data 구조는 유지한다.
 */
// 외부 API 도입 전이므로 부모가 이름·기온·상태를 담은 고정 도시 데이터를 소유한다.
// 각 id는 검색 결과가 바뀌어도 v-for 카드의 정체성을 유지하는 식별값이다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 검색어와 선택 객체를 부모에서 관리해 여러 자식과 상태 안내가 같은 값을 사용하게 한다.
const searchQuery = ref('')
const selectedCityInfo = ref(null)

// 검색어의 앞뒤 공백을 제거한 뒤 도시 이름의 부분 문자열과 비교해 화면용 목록을 파생한다.
// 빈 검색어는 전체 목록을 반환하며 원본 Mock Data 배열은 직접 수정하지 않는다.
const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherList.value
  }

  return weatherList.value.filter((weather) => weather.name.toLowerCase().includes(normalizedQuery))
})

const updateSearchQuery = (value) => {
  // SearchBar가 전달한 새 입력을 부모 상태에 반영하면 계산된 목록이 자식 카드로 다시 내려간다.
  searchQuery.value = value
}

const selectCity = (weather) => {
  // WeatherCard가 payload로 보낸 객체 전체를 저장해 선택 상태바에서 모든 표시값을 함께 사용한다.
  selectedCityInfo.value = weather
}

const showDetail = (weather) => {
  // 상세 route 도입 전이므로 WeatherCard는 의도만 전달하고 alert 후속 동작은 부모가 결정한다.
  window.alert(`${weather.name}의 현재 날씨는 [${weather.status}] 상태입니다.`)
}

// 선택 객체의 참조 변경을 명시적으로 감시해 이전 도시와 현재 도시를 비교한다.
// immediate 옵션이 없어 최초 마운트에는 실행되지 않고 실제 카드 선택 이후부터 동작한다.
watch(selectedCityInfo, (newCity, oldCity) => {
  console.log('[watch] 선택 도시 변경')
  console.log(`이전 도시: ${oldCity?.name ?? '선택 없음'}`)
  console.log(`현재 도시: ${newCity?.name ?? '선택 없음'}`)
})

// 콜백에서 읽는 검색어와 computed 결과를 자동 추적하며 설정 시 최초 한 번 실행된다.
// 이후 입력이나 필터 결과가 바뀌면 현재 검색 상태를 다시 기록해 명시적 watch와 역할을 나눈다.
watchEffect(() => {
  const query = searchQuery.value.trim()
  const resultNames = filteredWeatherList.value.map((weather) => weather.name)

  console.log('[watchEffect] 검색 상태')
  console.log(`검색어: ${query || '입력 없음'}`)
  console.log(`검색 결과: ${resultNames.length ? resultNames.join(', ') : '검색 결과 없음'}`)
})
</script>

<template>
  <div class="weather-mockup">
    <!-- 부모 상태가 props로 내려가고 입력 이벤트가 부모 handler로 올라오는 단방향 흐름이다. -->
    <BaseDashboardCard>
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="third-weather-list-title">
      <h2 id="third-weather-list-title">🏙️ 지역별 날씨 현황</h2>

      <!-- 파생 목록은 id를 key로 카드에 전달하고, 결과가 없으면 별도 안내로 전환한다. -->
      <div v-if="filteredWeatherList.length" class="weather-grid">
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          @select-card="selectCity"
          @click-detail="showDetail"
        />
      </div>

      <p v-else class="empty-state">검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="selection-status" role="status" aria-live="polite">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다. 현재 기온은 ${selectedCityInfo.temp}℃이고 날씨는 ${selectedCityInfo.status}입니다.`
          : '검색 후 원하는 날씨 카드를 선택해 보세요.'
      }}
    </div>
  </div>
</template>

<style scoped>
/* 부모가 조합하는 패널 간 배치와 검색 결과 상태 */
.weather-mockup {
  display: grid;
  gap: 10px;
  min-width: 0;
}

h2 {
  margin: 0 0 8px;
  color: #1e293b;
  font-size: 0.9rem;
}

.weather-grid {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.empty-state {
  margin: 0;
  padding: 12px;
  border-radius: 5px;
  color: #64748b;
  background: #f8fafc;
  font-size: 0.78rem;
  text-align: center;
}

/* 부모가 소유한 선택 결과 상태바 */
.selection-status {
  margin: 0;
  padding: 9px 10px;
  border: 1px solid #bbf7d0;
  border-radius: 5px;
  color: #166534;
  background: #f0fdf4;
  font-size: 0.76rem;
}
</style>
