<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { weatherList } from '../../data/weatherData.js'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

/**
 * Mock Data와 검색·선택 상태를 소유하고 자식의 입력·선택 이벤트를 후속 동작으로 연결한다.
 * 상세보기는 자식이 전달한 도시 id로 route를 구성해 직접 접근 가능한 Detail View로 이동한다.
 * Pinia와 API 연동 전이므로 Home과 Detail은 같은 고정 데이터를 사용한다.
 */
const router = useRouter()
const searchQuery = ref('')
const selectedCityInfo = ref(null)

// 검색어의 앞뒤 공백을 제거한 뒤 도시 이름의 부분 문자열과 비교해 화면용 목록을 파생한다.
// 빈 검색어는 전체 목록을 반환하며 원본 Mock Data 배열은 수정하지 않는다.
const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherList
  }

  return weatherList.filter((weather) => weather.name.toLowerCase().includes(normalizedQuery))
})

const updateSearchQuery = (value) => {
  // SearchBar가 emit한 문자열을 부모 상태에 반영하면 새 검색 결과가 카드 props로 다시 내려간다.
  searchQuery.value = value
}

const selectCity = (weather) => {
  // WeatherCard가 전달한 객체 전체를 저장해 Home의 선택 상태 안내에 필요한 값을 함께 유지한다.
  selectedCityInfo.value = weather
}

const showDetail = (weather) => {
  // 자식이 전달한 도시가 실행 시점에 결정되므로 부모가 route name과 params로 목적지를 구성한다.
  // router.push로 남은 URL 기록은 브라우저 뒤로가기·앞으로가기에서도 같은 상세 상태를 복원한다.
  router.push({
    name: 'fourth-weather-detail',
    params: {
      cityId: weather.id,
    },
  })
}

// 선택 객체의 참조 변경을 감시해 이전·현재 도시를 비교하며 최초 마운트에는 실행되지 않는다.
watch(selectedCityInfo, (newCity, oldCity) => {
  console.log('[watch] 선택 도시 변경')
  console.log(`이전 도시: ${oldCity?.name ?? '선택 없음'}`)
  console.log(`현재 도시: ${newCity?.name ?? '선택 없음'}`)
})

// 검색어와 computed 결과를 자동 추적해 최초 한 번, 이후 두 값이 바뀔 때마다 검색 상태를 기록한다.
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
    <!-- 공통 외곽의 기본 slot에 검색 UI를 넣고 prop·emit으로 부모 상태와 연결한다. -->
    <BaseDashboardCard>
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="fourth-weather-list-title">
      <h2 id="fourth-weather-list-title">🏙️ 지역별 날씨 현황</h2>

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
/* Home 부모가 조합하는 검색 패널·카드 목록·선택 상태의 배치를 이 View 범위에 한정한다. */
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
