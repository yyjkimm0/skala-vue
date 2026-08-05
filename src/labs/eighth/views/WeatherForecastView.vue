<script setup>
import { computed, ref, watch } from 'vue'
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

/**
 * 전체 3시간 Forecast를 현지 날짜로 묶고 각 날짜의 정오에 가장 가까운 대표값을 만든다.
 * 대표값을 날짜순 최대 5개로 제한한 뒤 도시 선택과 전체·비 예보 필터를 화면 상태에 연결한다.
 * Forecast는 fallback 없이 자체 loading·error·empty를 관리하고 Store 단위는 표시 단계에만 적용한다.
 */
const configStore = useConfigStore()
const forecasts = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const selectedCityId = ref('city_01')
const forecastFilter = ref('all')
const RAIN_PROBABILITY_THRESHOLD = 0.3
let latestRequestId = 0

const selectedCity = computed(() => findWeatherCityById(selectedCityId.value))

// reduce와 spread로 같은 localDate의 항목을 새 배열에 모아 원본 forecasts를 변경하지 않는다.
const forecastsByDate = computed(() =>
  forecasts.value.reduce((groups, forecast) => {
    const dateForecasts = groups[forecast.localDate] ?? []

    return {
      ...groups,
      [forecast.localDate]: [...dateForecasts, forecast],
    }
  }, {}),
)

// 한 날짜의 3시간 예보 중 현지 12시와 시간 차이가 가장 작은 항목을 대표값으로 선택한다.
const selectRepresentativeForecast = (dateForecasts) =>
  dateForecasts.reduce((closest, forecast) => {
    if (!closest) {
      return forecast
    }

    const currentDistance = Math.abs(forecast.localHour - 12)
    const closestDistance = Math.abs(closest.localHour - 12)

    return currentDistance < closestDistance ? forecast : closest
  }, null)

// 그룹을 배열로 바꾸고 대표값 생성 → 날짜 정렬 → 최대 5일 제한 순서로 처리한다.
const dailyForecasts = computed(() =>
  Object.entries(forecastsByDate.value)
    .map(([localDate, dateForecasts]) => {
      const representativeForecast = selectRepresentativeForecast(dateForecasts)

      // 객체 spread로 대표 예보 필드를 보존하면서 그룹의 localDate를 명시한다.
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

// 상태 문구에 비가 포함되거나 강수확률이 30% 이상이면 비 예보로 분류한다.
const isRainyForecast = (forecast) =>
  forecast.status.includes('비') || forecast.precipitationProbability >= RAIN_PROBABILITY_THRESHOLD

const visibleForecasts = computed(() => {
  // spread로 대표 배열을 복사해 필터 과정이 dailyForecasts 원본에 영향을 주지 않게 한다.
  const source = [...dailyForecasts.value]

  if (forecastFilter.value === 'rainy') {
    // filter는 비 예보 보기에서 조건에 맞는 대표 카드만 남긴다.
    return source.filter(isRainyForecast)
  }

  return source
})

const formatLocalDate = (localDate) => {
  const [year, month, day] = localDate.split('-')

  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

const formatLocalTime = (localDateTime) => localDateTime?.split(' ')[1] ?? '정보 없음'

const displayTemperature = (temperature) => convertTemperature(temperature, configStore.unit)

const toPercentage = (probability) =>
  Math.min(100, Math.max(0, Math.round((probability ?? 0) * 100)))

/**
 * 도시가 바뀔 때 이전 예보와 오류를 초기화한 뒤 새 Forecast를 요청한다.
 * 요청 번호가 일치하는 최신 결과만 반영해 빠른 도시 전환에서 늦은 응답이 화면을 덮지 못하게 한다.
 */
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
        <!-- 선택 id는 도시 설정을 거쳐 API query로 연결되고 watch가 새 요청을 시작한다. -->
        <ElSelect
          v-model="selectedCityId"
          class="forecast-controls__city"
          placeholder="도시 선택"
          aria-label="예보 도시 선택"
          size="small"
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

      <!-- loading → error → 원본 없음 → 필터 결과 없음 → 성공 카드 순서로 상태를 구분한다. -->
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
        <!-- 비 필터는 전체 3시간 배열이 아니라 날짜별 대표 예보 카드에만 적용된다. -->
        <ElCard
          v-for="forecast in visibleForecasts"
          :key="forecast.id"
          class="forecast-card"
          shadow="hover"
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

/* Element Plus가 생성한 Card 내부 중 Forecast 패널의 header와 body 여백만 조정한다. */
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
}

/* 대표 Forecast Card 내부 body의 정보 밀도를 eighth 화면 폭에 맞춘다. */
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
