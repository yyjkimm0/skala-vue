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

/**
 * sixth의 데이터 소유와 API fallback 흐름을 유지하면서 요청 상태를 Element Plus UI에 연결한다.
 * 상태 영역은 loading Skeleton과 fallback Alert를 순서대로 구분하고 카드 목록은 별도로 유지한다.
 * 검색·선택은 로컬, 단위는 Pinia, 날씨·요청은 서버 상태이고 Element Plus는 표현만 맡는다.
 */
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

// 실패 도시 목록을 Alert가 표시할 하나의 안내 문구로 파생한다.
const fallbackMessage = computed(() =>
  failedCityNames.value.length
    ? `${failedCityNames.value.join(', ')}의 실시간 날씨를 불러오지 못해 Mock Data를 표시하고 있습니다.`
    : '',
)

// API와 fallback을 합친 내부 모델의 도시명을 검색하고 빈 검색어이면 전체 목록을 반환한다.
// trim과 부분 문자열 비교만 적용하며 현재 서버 결과 배열은 직접 변경하지 않는다.
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
  // WeatherCard가 payload로 전달한 도시 객체는 Home 부모의 선택 상태로 보관한다.
  selectedCityInfo.value = weather
}

const updateSearchQuery = (value) => {
  // ElInput의 model update·clear·IME 입력을 하나의 부모 검색 상태에 반영한다.
  searchQuery.value = value
}

const loadWeather = async () => {
  isLoadingWeather.value = true
  failedCityIds.value = []

  try {
    // 병렬 요청 중 일부가 실패해도 allSettled 결과 순서로 도시별 성공값과 fallback을 결합한다.
    const results = await Promise.allSettled(
      weatherCities.map((cityConfig) => fetchCurrentWeather(cityConfig)),
    )
    const mockWeatherById = new Map(weatherList.map((weather) => [weather.id, weather]))

    weatherItems.value = results.map((result, index) =>
      result.status === 'fulfilled' ? result.value : mockWeatherById.get(weatherCities[index].id),
    )

    // 실패 도시만 별도 기록해 대체 데이터가 포함됐음을 warning Alert로 숨김없이 알린다.
    failedCityIds.value = results.flatMap((result, index) =>
      result.status === 'rejected' ? [weatherCities[index].id] : [],
    )

    if (selectedCityInfo.value) {
      // API 결과 배열이 교체되면 선택 도시도 id로 다시 찾아 오래된 객체 참조를 갱신한다.
      selectedCityInfo.value =
        weatherItems.value.find((weather) => weather.id === selectedCityInfo.value.id) ?? null
    }
  } finally {
    isLoadingWeather.value = false
  }
}

onMounted(loadWeather)

watch(selectedCityInfo, (newCity, oldCity) => {
  // immediate 옵션이 없어 최초 마운트가 아니라 실제 선택 객체 변경부터 비교한다.
  console.log('[watch] 선택 도시 변경')
  console.log(`이전 도시: ${oldCity?.name ?? '선택 없음'}`)
  console.log(`현재 도시: ${newCity?.name ?? '선택 없음'}`)
})

watchEffect(() => {
  // 최초 실행 후 검색어와 computed 결과를 자동 추적하며 API 목록 교체에도 다시 실행된다.
  const query = searchQuery.value.trim()
  const resultNames = filteredWeatherList.value.map((weather) => weather.name)

  console.log('[watchEffect] 검색 상태')
  console.log(`검색어: ${query || '입력 없음'}`)
  console.log(`검색 결과: ${resultNames.length ? resultNames.join(', ') : '검색 결과 없음'}`)
})

const showDetail = (weather) => {
  // 카드가 Router를 직접 다루지 않도록 부모가 내부 도시 id를 동적 route param으로 전달한다.
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
    <!-- ElCard 공통 외곽의 기본 slot에 검색 UI를 조합한다. -->
    <BaseDashboardCard>
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="seventh-weather-list-title">
      <h2 id="seventh-weather-list-title">🏙️ 지역별 날씨 현황</h2>
      <!-- 요청 중에는 Skeleton을 우선 표시하고 완료 후에만 fallback 안내를 판정한다. -->
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
      <!-- 검색 결과 없음은 API 오류가 아니므로 Alert 대신 기존 빈 결과 안내로 구분한다. -->
      <div v-if="filteredWeatherList.length" class="weather-grid">
        <!-- 도시 id를 안정적인 key로 쓰고 Store의 표시 단위만 카드에 전달한다. -->
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
