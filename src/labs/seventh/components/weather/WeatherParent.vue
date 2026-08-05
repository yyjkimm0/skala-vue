<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { ElAlert, ElSkeleton } from 'element-plus'
import { useRouter } from 'vue-router'
import { weatherCities } from '../../data/weatherCities.js'
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
const failedCityIds = ref([])

const failedCityNames = computed(() =>
  weatherCities.filter((city) => failedCityIds.value.includes(city.id)).map((city) => city.name),
)

const fallbackMessage = computed(() =>
  failedCityNames.value.length
    ? `${failedCityNames.value.join(', ')}의 실시간 날씨를 불러오지 못해 Mock Data를 표시하고 있습니다.`
    : '',
)

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

const loadWeather = async () => {
  isLoadingWeather.value = true
  failedCityIds.value = []

  try {
    const results = await Promise.allSettled(
      weatherCities.map((cityConfig) => fetchCurrentWeather(cityConfig)),
    )
    const mockWeatherById = new Map(weatherList.map((weather) => [weather.id, weather]))

    weatherItems.value = results.map((result, index) =>
      result.status === 'fulfilled' ? result.value : mockWeatherById.get(weatherCities[index].id),
    )

    failedCityIds.value = results.flatMap((result, index) =>
      result.status === 'rejected' ? [weatherCities[index].id] : [],
    )

    if (selectedCityInfo.value) {
      selectedCityInfo.value =
        weatherItems.value.find((weather) => weather.id === selectedCityInfo.value.id) ?? null
    }
  } finally {
    isLoadingWeather.value = false
  }
}

onMounted(loadWeather)

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
    name: 'seventh-weather-detail',
    params: {
      cityId: weather.id,
    },
  })
}
</script>

<template>
  <div class="weather-mockup">
    <BaseDashboardCard>
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="seventh-weather-list-title">
      <h2 id="seventh-weather-list-title">🏙️ 지역별 날씨 현황</h2>
      <ElSkeleton
        v-if="isLoadingWeather"
        class="weather-load-skeleton"
        :rows="1"
        animated
        aria-label="실시간 날씨를 불러오는 중입니다."
      />
      <ElAlert
        v-else-if="fallbackMessage"
        class="weather-fallback-alert"
        :title="fallbackMessage"
        type="warning"
        show-icon
        :closable="false"
      />
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
      <p v-else class="empty-state">검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="selection-status" role="status" aria-live="polite">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다. 현재 기온은 ${selectedTemperature}${configStore.unitSymbol}이고 날씨는 ${selectedCityInfo.status}입니다.`
          : '카드를 클릭하거나 검색해 보세요.'
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

.weather-load-skeleton,
.weather-fallback-alert {
  margin: 0 0 8px;
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
