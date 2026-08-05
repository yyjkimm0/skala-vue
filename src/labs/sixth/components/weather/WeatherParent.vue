<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
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
 * 세 도시의 실시간 날씨를 병렬로 요청하고 결과를 기존 카드 모델로 구성한다.
 * 요청 중에는 loading을 표시하고 실패한 도시만 Mock Data로 대체해 나머지 성공 결과를 보존한다.
 * 검색·선택은 로컬, 단위는 Pinia, 날씨와 요청 상태는 비동기 서버 상태로 나눠 관리한다.
 */
const router = useRouter()
const configStore = useConfigStore()

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherItems = ref([...weatherList])
const isLoadingWeather = ref(false)
const failedCityIds = ref([])

// 실패한 도시 id를 사용자 안내에 필요한 표시명으로 변환한다.
const failedCityNames = computed(() =>
  weatherCities.filter((city) => failedCityIds.value.includes(city.id)).map((city) => city.name),
)

// API와 fallback을 합친 현재 내부 모델 목록에서 검색하며, 빈 검색어이면 전체를 반환한다.
// trim과 부분 문자열 비교만 적용하고 서버 결과 배열 자체는 변경하지 않는다.
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
  // WeatherCard가 전달한 객체 전체를 Home의 선택 상태로 보관한다.
  selectedCityInfo.value = weather
}

const updateSearchQuery = (value) => {
  // SearchBar의 입력 이벤트를 받아 부모가 검색 원본 상태를 갱신한다.
  searchQuery.value = value
}

const loadWeather = async () => {
  isLoadingWeather.value = true
  failedCityIds.value = []

  try {
    // allSettled는 요청을 병렬로 시작하고 일부 실패도 전체 목록 실패로 만들지 않는다.
    // 반환 순서가 입력 설정 순서와 같아 index로 각 도시의 성공값 또는 fallback을 연결한다.
    const results = await Promise.allSettled(
      weatherCities.map((cityConfig) => fetchCurrentWeather(cityConfig)),
    )
    const mockWeatherById = new Map(weatherList.map((weather) => [weather.id, weather]))

    // 성공값과 Mock fallback이 같은 내부 모델이므로 이후 검색과 카드 렌더링은 출처를 구분하지 않는다.
    weatherItems.value = results.map((result, index) =>
      result.status === 'fulfilled' ? result.value : mockWeatherById.get(weatherCities[index].id),
    )

    // fallback을 성공처럼 숨기지 않고 실패한 도시만 별도 상태로 기록한다.
    failedCityIds.value = results.flatMap((result, index) =>
      result.status === 'rejected' ? [weatherCities[index].id] : [],
    )

    if (selectedCityInfo.value) {
      // 이미 선택한 카드도 새 API 또는 fallback 결과 객체로 교체해 화면 정보를 최신 상태로 맞춘다.
      selectedCityInfo.value =
        weatherItems.value.find((weather) => weather.id === selectedCityInfo.value.id) ?? null
    }
  } finally {
    isLoadingWeather.value = false
  }
}

onMounted(loadWeather)

watch(selectedCityInfo, (newCity, oldCity) => {
  // immediate 옵션이 없어 최초 마운트가 아닌 실제 선택 객체 변경부터 이전·현재 값을 비교한다.
  console.log('[watch] 선택 도시 변경')
  console.log(`이전 도시: ${oldCity?.name ?? '선택 없음'}`)
  console.log(`현재 도시: ${newCity?.name ?? '선택 없음'}`)
})

watchEffect(() => {
  // 최초 실행 후 검색어와 computed 결과를 자동 추적하며 API 배열 교체에도 다시 반응한다.
  const query = searchQuery.value.trim()
  const resultNames = filteredWeatherList.value.map((weather) => weather.name)

  console.log('[watchEffect] 검색 상태')
  console.log(`검색어: ${query || '입력 없음'}`)
  console.log(`검색 결과: ${resultNames.length ? resultNames.join(', ') : '검색 결과 없음'}`)
})

const showDetail = (weather) => {
  // 자식 카드 대신 부모가 내부 id를 동적 route param으로 전달해 상세 이동을 담당한다.
  router.push({
    name: 'sixth-weather-detail',
    params: {
      cityId: weather.id,
    },
  })
}
</script>

<template>
  <div class="weather-mockup">
    <!-- 공통 외곽의 기본 slot에 API와 Store를 모르는 검색 입력을 조합한다. -->
    <BaseDashboardCard>
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="sixth-weather-list-title">
      <h2 id="sixth-weather-list-title">🏙️ 지역별 날씨 현황</h2>
      <!-- loading 안내가 fallback 안내보다 먼저 표시되고, 완료 후에만 실패 도시를 알린다. -->
      <p
        v-if="isLoadingWeather"
        class="weather-load-status weather-load-status--loading"
        role="status"
      >
        실시간 날씨를 불러오는 중입니다.
      </p>
      <p
        v-else-if="failedCityNames.length"
        class="weather-load-status weather-load-status--fallback"
        role="alert"
      >
        {{ failedCityNames.join(', ') }}의 실시간 날씨를 불러오지 못해 Mock Data를 표시하고
        있습니다.
      </p>
      <div v-if="filteredWeatherList.length" class="weather-grid">
        <!-- 내부 도시 id를 key로 쓰고 전역 표시 단위만 각 카드에 전달한다. -->
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
      <!-- 요청 상태와 별개로 현재 검색 computed가 비었을 때 표시하는 empty 상태다. -->
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

.weather-load-status {
  margin: 0 0 8px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  line-height: 1.4;
}

.weather-load-status--loading {
  color: #1e40af;
  background: #eff6ff;
}

.weather-load-status--fallback {
  color: #92400e;
  background: #fffbeb;
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
