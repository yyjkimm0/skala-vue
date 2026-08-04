<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { weatherList } from '../../data/weatherData.js'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const router = useRouter()
const searchQuery = ref('')
const selectedCityInfo = ref(null)

const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherList
  }

  return weatherList.filter((weather) =>
    weather.name.toLowerCase().includes(normalizedQuery),
  )
})

const updateSearchQuery = (value) => {
  searchQuery.value = value
}

const selectCity = (weather) => {
  selectedCityInfo.value = weather
}

const showDetail = (weather) => {
  router.push({
    name: 'fourth-weather-detail',
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
      <SearchBar
        :search-query="searchQuery"
        @update-query="updateSearchQuery"
      />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="fourth-weather-list-title">
      <h2 id="fourth-weather-list-title">🏙️ 지역별 날씨 현황</h2>

      <div
        v-if="filteredWeatherList.length"
        class="weather-grid"
      >
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          @select-card="selectCity"
          @click-detail="showDetail"
        />
      </div>

      <p
        v-else
        class="empty-state"
      >
        검색 결과와 일치하는 도시가 없습니다.
      </p>
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
