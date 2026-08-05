<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ElAlert,
  ElCard,
  ElEmpty,
  ElOption,
  ElProgress,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
  ElSkeleton,
  ElTag,
} from 'element-plus'
import { findWeatherCityById, weatherCities } from '../data/weatherCities.js'
import { fetchWeatherForecast } from '../services/weatherApi.js'
import { useConfigStore } from '../stores/configStore.js'
import { convertTemperature } from '../utils/temperature.js'

const configStore = useConfigStore()
const route = useRoute()
const router = useRouter()
const forecasts = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const forecastFilter = ref('all')
const RAIN_PROBABILITY_THRESHOLD = 0.3
const DEFAULT_CITY_ID = 'city_01'
let latestRequestId = 0

const getQueryCityId = (queryCityId) => {
  const cityId = Array.isArray(queryCityId) ? queryCityId[0] : queryCityId

  return typeof cityId === 'string' && findWeatherCityById(cityId) ? cityId : DEFAULT_CITY_ID
}

const selectedCityId = ref(getQueryCityId(route.query.cityId))

const selectedCity = computed(() => findWeatherCityById(selectedCityId.value))

const forecastsByDate = computed(() =>
  forecasts.value.reduce((groups, forecast) => {
    const dateForecasts = groups[forecast.localDate] ?? []

    return {
      ...groups,
      [forecast.localDate]: [...dateForecasts, forecast],
    }
  }, {}),
)

const selectRepresentativeForecast = (dateForecasts) =>
  dateForecasts.reduce((closest, forecast) => {
    if (!closest) {
      return forecast
    }

    const currentDistance = Math.abs(forecast.localHour - 12)
    const closestDistance = Math.abs(closest.localHour - 12)

    return currentDistance < closestDistance ? forecast : closest
  }, null)

const dailyForecasts = computed(() =>
  Object.entries(forecastsByDate.value)
    .map(([localDate, dateForecasts]) => {
      const representativeForecast = selectRepresentativeForecast(dateForecasts)

      return {
        ...representativeForecast,
        localDate,
      }
    })
    .sort((firstForecast, secondForecast) =>
      firstForecast.localDate.localeCompare(secondForecast.localDate),
    )
    .slice(0, 5),
)

const isRainyForecast = (forecast) =>
  forecast.status.includes('비') || forecast.precipitationProbability >= RAIN_PROBABILITY_THRESHOLD

const visibleForecasts = computed(() => {
  const source = [...dailyForecasts.value]

  if (forecastFilter.value === 'rainy') {
    return source.filter(isRainyForecast)
  }

  return source
})

const openForecastDetail = (localDate) => {
  router.push({
    name: 'final-weather-forecast-detail',
    params: {
      cityId: selectedCityId.value,
      localDate,
    },
  })
}

const syncSelectedCityQuery = (cityId) => {
  if (route.name !== 'final-weather-forecast') {
    return
  }

  const resolvedCityId = getQueryCityId(cityId)

  if (
    getQueryCityId(route.query.cityId) === resolvedCityId &&
    route.query.cityId === resolvedCityId
  ) {
    return
  }

  router.replace({
    name: 'final-weather-forecast',
    query: {
      ...route.query,
      cityId: resolvedCityId,
    },
  })
}

const formatLocalDate = (localDate) => {
  const [year, month, day] = localDate.split('-')

  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

const formatLocalTime = (localDateTime) => localDateTime?.split(' ')[1] ?? '정보 없음'

const displayTemperature = (temperature) => convertTemperature(temperature, configStore.unit)

const toPercentage = (probability) =>
  Math.min(100, Math.max(0, Math.round((probability ?? 0) * 100)))

const loadForecast = async () => {
  const requestId = ++latestRequestId
  const cityConfig = selectedCity.value

  isLoading.value = true
  errorMessage.value = ''
  forecasts.value = []

  try {
    const result = await fetchWeatherForecast(cityConfig)

    if (requestId === latestRequestId) {
      forecasts.value = result
    }
  } catch {
    if (requestId === latestRequestId) {
      errorMessage.value = '단기 예보를 불러오지 못했습니다.'
    }
  } finally {
    if (requestId === latestRequestId) {
      isLoading.value = false
    }
  }
}

watch(selectedCityId, loadForecast, { immediate: true })

watch(
  () => route.query.cityId,
  (queryCityId) => {
    if (route.name !== 'final-weather-forecast') {
      return
    }

    const resolvedCityId = getQueryCityId(queryCityId)

    if (selectedCityId.value !== resolvedCityId) {
      selectedCityId.value = resolvedCityId
    }

    syncSelectedCityQuery(resolvedCityId)
  },
  { immediate: true },
)
</script>

<template>
  <section class="forecast-view">
    <ElCard class="forecast-panel" shadow="never">
      <template #header>
        <div class="forecast-panel__header">
          <h2>{{ selectedCity.name }} 5일 단기 예보</h2>
          <p>3시간 간격 예보에서 날짜별 정오에 가장 가까운 항목을 표시합니다.</p>
        </div>
      </template>

      <div class="forecast-controls">
        <ElSelect
          v-model="selectedCityId"
          class="forecast-controls__city"
          placeholder="도시 선택"
          aria-label="예보 도시 선택"
          size="small"
          @change="syncSelectedCityQuery"
        >
          <ElOption
            v-for="city in weatherCities"
            :key="city.id"
            :label="city.name"
            :value="city.id"
          />
        </ElSelect>

        <ElRadioGroup v-model="forecastFilter" size="small">
          <ElRadioButton value="all">전체 예보</ElRadioButton>
          <ElRadioButton value="rainy">비 예보만</ElRadioButton>
        </ElRadioGroup>
      </div>

      <ElSkeleton
        v-if="isLoading"
        :rows="4"
        animated
        :aria-label="`${selectedCity.name} 단기 예보를 불러오는 중입니다.`"
      />

      <ElAlert
        v-else-if="errorMessage"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
      />

      <ElEmpty
        v-else-if="!forecasts.length"
        description="표시할 예보 데이터가 없습니다."
        :image-size="72"
      />

      <ElEmpty
        v-else-if="forecastFilter === 'rainy' && !visibleForecasts.length"
        description="선택한 기간에 비 예보가 없습니다."
        :image-size="72"
      />

      <div v-else class="forecast-list">
        <ElCard
          v-for="forecast in visibleForecasts"
          :key="forecast.id"
          class="forecast-card"
          shadow="hover"
          role="button"
          tabindex="0"
          :aria-label="`${formatLocalDate(forecast.localDate)} 상세 예보 보기`"
          @click="openForecastDetail(forecast.localDate)"
          @keydown.enter="openForecastDetail(forecast.localDate)"
          @keydown.space.prevent="openForecastDetail(forecast.localDate)"
        >
          <div class="forecast-card__layout">
            <div class="forecast-card__summary">
              <strong>{{ formatLocalDate(forecast.localDate) }}</strong>
              <span>대표 시각: {{ formatLocalTime(forecast.localDateTime) }}</span>
              <ElTag
                :type="isRainyForecast(forecast) ? 'warning' : 'success'"
                size="small"
                effect="light"
              >
                {{ isRainyForecast(forecast) ? '🌧️' : '☀️' }} {{ forecast.status }}
              </ElTag>
            </div>

            <div class="forecast-card__metrics">
              <span>
                기온: {{ displayTemperature(forecast.temp) }}{{ configStore.unitSymbol }}
              </span>
              <span>
                체감온도: {{ displayTemperature(forecast.feelsLike) }}{{ configStore.unitSymbol }}
              </span>
              <span>습도: {{ forecast.humidity }}%</span>
              <div class="forecast-precipitation">
                <span>강수확률</span>
                <ElProgress
                  :percentage="toPercentage(forecast.precipitationProbability)"
                  :stroke-width="8"
                />
              </div>
            </div>
          </div>
        </ElCard>
      </div>
    </ElCard>
  </section>
</template>

<style scoped>
.forecast-view {
  min-width: 0;
}

h2,
p {
  margin: 0;
}

h2 {
  color: #163a63;
  font-size: 1rem;
}

p {
  font-size: 0.78rem;
  line-height: 1.6;
}

.forecast-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.forecast-controls__city {
  width: 120px;
}

.forecast-panel {
  min-width: 0;
}

.forecast-panel__header {
  display: grid;
  gap: 4px;
}

.forecast-panel :deep(.el-card__header),
.forecast-panel :deep(.el-card__body) {
  padding: 12px;
}

.forecast-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
}

.forecast-card {
  min-width: 0;
  cursor: pointer;
}

.forecast-card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.forecast-card :deep(.el-card__body) {
  padding: 10px;
}

.forecast-card__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(150px, 1fr);
  gap: 12px;
  color: #475569;
  font-size: 0.76rem;
}

.forecast-card__summary,
.forecast-card__metrics {
  display: grid;
  align-content: start;
  gap: 5px;
  min-width: 0;
}

.forecast-card__summary strong {
  color: #1e293b;
}

.forecast-card__summary .el-tag {
  justify-self: start;
}

.forecast-precipitation {
  display: grid;
  gap: 3px;
}

@media (max-width: 390px) {
  .forecast-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .forecast-controls__city {
    width: 100%;
  }

  .forecast-card__layout {
    grid-template-columns: 1fr;
  }
}
</style>
