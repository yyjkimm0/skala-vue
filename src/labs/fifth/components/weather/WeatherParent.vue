<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { weatherList } from '../../data/weatherData.js'
import { useConfigStore } from '../../stores/configStore.js'
import { convertTemperature } from '../../utils/temperature.js'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

/**
 * fourth의 Router 구조를 유지하면서 Pinia의 전역 표시 단위를 목록에 연결한 단계다.
 * Mock Data의 섭씨 원본값은 보존하고 Store 단위에 맞춘 값만 화면에 전달한다.
 * 외부 API 연동은 아직 도입하지 않는다.
 */
const router = useRouter()
// 최상위 Pinia 컨텍스트에서 UnitToggler와 상세 View가 사용하는 동일 Store에 접근한다.
const configStore = useConfigStore()
const searchQuery = ref('')
const selectedCityInfo = ref(null)

const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherList
  }

  return weatherList.filter((weather) => weather.name.toLowerCase().includes(normalizedQuery))
})

// 선택 상태바도 카드와 같은 단위 정책을 따르도록 섭씨 원본에서 표시값만 계산한다.
const selectedTemperature = computed(() => {
  if (!selectedCityInfo.value) {
    return null
  }

  return convertTemperature(selectedCityInfo.value.temp, configStore.unit)
})

const updateSearchQuery = (value) => {
  searchQuery.value = value
}

const selectCity = (weather) => {
  selectedCityInfo.value = weather
}

const showDetail = (weather) => {
  router.push({
    name: 'fifth-weather-detail',
    params: {
      cityId: weather.id,
    },
  })
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
    <BaseDashboardCard>
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="fifth-weather-list-title">
      <h2 id="fifth-weather-list-title">🏙️ 지역별 날씨 현황</h2>

      <div v-if="filteredWeatherList.length" class="weather-grid">
        <!-- Store에서 읽은 단위와 기호를 각 카드에 내려 동일한 표시 정책을 적용한다. -->
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          :unit="configStore.unit"
          :unit-symbol="configStore.unitSymbol"
          @select-card="selectCity"
          @click-detail="showDetail"
        />
      </div>

      <p v-else class="empty-state">검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="selection-status" role="status" aria-live="polite">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다. 현재 기온은 ${selectedTemperature}${configStore.unitSymbol}이고 날씨는 ${selectedCityInfo.status}입니다.`
          : '검색 후 원하는 날씨 카드를 선택해 보세요.'
      }}
    </div>
  </div>
</template>

<style scoped>
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
