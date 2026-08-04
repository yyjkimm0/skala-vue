<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { weatherList } from '../../data/weatherData.js'
import { fetchCurrentWeather } from '../../services/weatherApi.js'
import { useConfigStore } from '../../stores/configStore.js'
import { convertTemperature } from '../../utils/temperature.js'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const router = useRouter()
const configStore = useConfigStore()

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherItems = ref([...weatherList])
const isLoadingWeather = ref(false)
const weatherErrorMessage = ref('')

const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherItems.value
  }

  return weatherItems.value.filter((weather) =>
    weather.name.toLowerCase().includes(normalizedQuery),
  )
})

const selectedTemperature = computed(() => {
  if (!selectedCityInfo.value) {
    return null
  }

  return convertTemperature(selectedCityInfo.value.temp, configStore.unit)
})

const selectCity = (weather) => {
  selectedCityInfo.value = weather
}

const updateSearchQuery = (value) => {
  searchQuery.value = value
}

const loadSeoulWeather = async () => {
  isLoadingWeather.value = true
  weatherErrorMessage.value = ''

  try {
    const seoulWeather = await fetchCurrentWeather('Seoul')

    weatherItems.value = weatherItems.value.map((weather) =>
      weather.id === 'city_01' ? seoulWeather : weather,
    )
  } catch {
    weatherErrorMessage.value =
      '서울 실시간 날씨를 불러오지 못해 Mock Data를 표시하고 있습니다.'
  } finally {
    isLoadingWeather.value = false
  }
}

onMounted(loadSeoulWeather)

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
  router.push({
    name: 'weather-detail',
    params: {
      cityId: weather.id,
    },
  })
}
</script>

<template>
  <section class="weather-mockup">
    <BaseDashboardCard class="search-panel">
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="weather-list-title">
      <h2 id="weather-list-title">🏙️ 지역별 날씨 현황</h2>
      <p v-if="isLoadingWeather" class="weather-load-status" role="status">
        서울 실시간 날씨를 불러오는 중입니다.
      </p>
      <p v-else-if="weatherErrorMessage" class="weather-load-status" role="alert">
        {{ weatherErrorMessage }}
      </p>
      <div v-if="filteredWeatherList.length" class="weather-grid">
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
      <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="selection-status" role="status" aria-live="polite">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다. 현재 기온은 ${selectedTemperature}${configStore.unitSymbol}이고 날씨는 ${selectedCityInfo.status}입니다.`
          : '카드를 클릭하거나 검색해 보세요.'
      }}
    </div>
  </section>
</template>

<style scoped>
.weather-mockup {
  display: grid;
  gap: 12px;
}

#weather-list-title {
  margin: 0 0 10px;
  font-size: 1rem;
}

.weather-load-status {
  margin: 0 0 10px;
  font-size: 0.78rem;
}

.weather-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selection-status {
  padding: 10px 12px;
  border: 1px solid #a7d7b7;
  border-radius: 5px;
  background: #ecfdf3;
  font-size: 0.78rem;
  font-weight: 700;
}
</style>
