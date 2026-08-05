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
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 검색어와 선택 객체를 부모에서 관리해 여러 자식과 상태 안내가 같은 값을 사용하게 한다.
const searchQuery = ref('')
const selectedCityInfo = ref(null)

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
  selectedCityInfo.value = weather
}

const showDetail = (weather) => {
  // WeatherCard는 의도만 전달하고, 현재 단계의 alert 후속 동작은 부모가 결정한다.
  window.alert(`${weather.name}의 현재 날씨는 [${weather.status}] 상태입니다.`)
}

watch(selectedCityInfo, (newCity, oldCity) => {
  console.log('[watch] 선택 도시 변경')
  console.log(`이전 도시: ${oldCity?.name ?? '선택 없음'}`)
  console.log(`현재 도시: ${newCity?.name ?? '선택 없음'}`)
})

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
