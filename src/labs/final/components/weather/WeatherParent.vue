<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElAlert, ElButton, ElSkeleton } from 'element-plus'
import { useRouter } from 'vue-router'
import { useWeatherSearch } from '../../composables/useWeatherSearch.js'
import { weatherCities } from '../../data/weatherCities.js'
import { weatherList } from '../../data/weatherData.js'
import { fetchCurrentWeather } from '../../services/weatherApi.js'
import { useConfigStore } from '../../stores/configStore.js'
import { convertTemperature } from '../../utils/temperature.js'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

/**
 * Home의 Current Weather 요청·fallback·검색·선택만 관리하며 Forecast 상태는 각 View에 둔다.
 * 검색·선택은 로컬, 단위는 Pinia, 날씨·요청은 서버 상태이고 Element Plus는 표현을 맡는다.
 */
const router = useRouter()
const configStore = useConfigStore()

const selectedCityInfo = ref(null)
const weatherItems = ref([...weatherList])
const isLoadingWeather = ref(false)
const failedCityIds = ref([])
const { searchQuery, filteredWeatherList, updateSearchQuery } = useWeatherSearch(weatherItems)

const failedCityNames = computed(() =>
  weatherCities.filter((city) => failedCityIds.value.includes(city.id)).map((city) => city.name),
)

const fallbackMessage = computed(() =>
  failedCityNames.value.length
    ? `${failedCityNames.value.join(', ')}의 실시간 날씨를 불러오지 못해 Mock Data를 표시하고 있습니다.`
    : '',
)

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

const loadWeather = async () => {
  isLoadingWeather.value = true
  failedCityIds.value = []

  try {
    // allSettled로 요청을 병렬 실행해 일부 실패가 성공 도시 결과까지 막지 않게 한다.
    const results = await Promise.allSettled(
      weatherCities.map((cityConfig) => fetchCurrentWeather(cityConfig)),
    )
    const mockWeatherById = new Map(weatherList.map((weather) => [weather.id, weather]))

    // 입력 도시 순서와 결과 순서를 index로 연결해 성공값 또는 같은 도시 fallback을 선택한다.
    weatherItems.value = results.map((result, index) =>
      result.status === 'fulfilled' ? result.value : mockWeatherById.get(weatherCities[index].id),
    )

    // 대체된 도시만 기록해 warning Alert가 fallback 사용 사실을 숨김없이 알린다.
    failedCityIds.value = results.flatMap((result, index) =>
      result.status === 'rejected' ? [weatherCities[index].id] : [],
    )

    if (selectedCityInfo.value) {
      // 배열 교체 후에도 선택 객체가 같은 id의 최신 API 또는 fallback 결과를 참조하게 한다.
      selectedCityInfo.value =
        weatherItems.value.find((weather) => weather.id === selectedCityInfo.value.id) ?? null
    }
  } finally {
    isLoadingWeather.value = false
  }
}

onMounted(loadWeather)

watch(selectedCityInfo, (newCity, oldCity) => {
  // immediate 옵션이 없어 최초 마운트가 아니라 실제 카드 선택 변경부터 비교한다.
  console.log('[watch] 선택 도시 변경')
  console.log(`이전 도시: ${oldCity?.name ?? '선택 없음'}`)
  console.log(`현재 도시: ${newCity?.name ?? '선택 없음'}`)
})

const showDetail = (weather) => {
  // 자식 카드가 Router를 알지 않도록 부모가 cityId 동적 route 이동을 담당한다.
  router.push({
    name: 'final-weather-detail',
    params: {
      cityId: weather.id,
    },
  })
}
</script>

<template>
  <div class="weather-mockup">
    <!-- 공통 ElCard의 기본 slot에 API와 Store를 모르는 검색 UI를 조합한다. -->
    <BaseDashboardCard>
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="final-weather-list-title">
      <template #header>
        <h2 id="final-weather-list-title">🏙️ 지역별 날씨 현황</h2>
      </template>

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
      <!-- Skeleton·Alert는 요청 안내 영역이고 현재 카드 또는 검색 empty 상태는 별도로 유지된다. -->
      <div v-if="filteredWeatherList.length" class="weather-grid">
        <!-- 내부 도시 id를 key로 쓰고 Store의 표시 단위만 카드에 전달한다. -->
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          :unit="configStore.unit"
          :unit-symbol="configStore.unitSymbol"
          @select-card="selectCity"
          @click-detail="showDetail"
        >
          <template #actions="{ weather, openDetail }">
            <ElButton
              type="primary"
              size="small"
              plain
              :aria-label="`${weather.name} 상세보기`"
              @click.stop="openDetail"
              @keydown.enter.stop
            >
              상세보기
            </ElButton>
          </template>
        </WeatherCard>
      </div>
      <p v-else class="empty-state">검색 결과와 일치하는 도시가 없습니다.</p>

      <template #footer>
        <div class="selection-status" role="status" aria-live="polite">
          {{
            selectedCityInfo
              ? `${selectedCityInfo.name}이 선택되었습니다. 현재 기온은 ${selectedTemperature}${configStore.unitSymbol}이고 날씨는 ${selectedCityInfo.status}입니다.`
              : '카드를 클릭하거나 검색해 보세요.'
          }}
        </div>
      </template>
    </BaseDashboardCard>
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
