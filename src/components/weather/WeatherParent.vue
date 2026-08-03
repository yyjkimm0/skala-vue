<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
]

const searchQuery = ref('')
const selectedCityInfo = ref(null)

const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherList
  }

  return weatherList.filter((weather) => weather.name.toLowerCase().includes(normalizedQuery))
})

const selectCity = (weather) => {
  selectedCityInfo.value = weather
}

const updateSearchQuery = (value) => {
  searchQuery.value = value
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

const showDetail = (weather) => {
  window.alert(`${weather.name}의 현재 날씨는 [${weather.status}] 상태입니다.`)
}
</script>

<template>
  <section class="weather-mockup">
    <BaseDashboardCard class="search-panel">
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="weather-list-title">
      <h2 id="weather-list-title">지역별 날씨</h2>
      <div v-if="filteredWeatherList.length" class="weather-grid">
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          @select-card="selectCity"
          @click-detail="showDetail"
        />
      </div>
      <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="selection-status" role="status" aria-live="polite">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다. 현재 기온은 ${selectedCityInfo.temp}℃이고 날씨는 ${selectedCityInfo.status}입니다.`
          : '검색 후 원하는 날씨 카드를 선택해 보세요.'
      }}
    </div>
  </section>
</template>
