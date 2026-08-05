<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElAlert, ElButton, ElCard, ElEmpty, ElIcon, ElSkeleton, ElTooltip } from 'element-plus'
import { findWeatherCityById } from '../data/weatherCities.js'
import { fetchWeatherForecast } from '../services/weatherApi.js'
import { useConfigStore } from '../stores/configStore.js'
import { convertTemperature } from '../utils/temperature.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const forecasts = ref([])
const failedIconIds = ref(new Set())
const isLoading = ref(false)
const errorMessage = ref('')
const validationMessage = ref('')
const threeHourListRef = ref(null)
let latestRequestId = 0

const cityId = computed(() => String(route.params.cityId ?? ''))
const selectedLocalDate = computed(() => String(route.params.localDate ?? ''))
const cityConfig = computed(() => findWeatherCityById(cityId.value))

const selectedDateForecasts = computed(() =>
  [...forecasts.value]
    .filter((forecast) => forecast.localDate === selectedLocalDate.value)
    .sort((firstForecast, secondForecast) => firstForecast.timestamp - secondForecast.timestamp),
)

const isValidLocalDate = (localDate) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate)) {
    return false
  }

  const parsedDate = new Date(`${localDate}T00:00:00Z`)

  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === localDate
}

const formatLocalDate = (localDate) => {
  const [year, month, day] = localDate.split('-')

  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

const formatLocalTime = (localDateTime) => localDateTime?.split(' ')[1] ?? '정보 없음'

const pageTitle = computed(() => {
  if (!cityConfig.value || !isValidLocalDate(selectedLocalDate.value)) {
    return '3시간 간격 상세 예보'
  }

  return `${cityConfig.value.name} · ${formatLocalDate(selectedLocalDate.value)}`
})

const displayTemperature = (temperature) => {
  const convertedTemperature = convertTemperature(temperature, configStore.unit)

  return Number.isFinite(convertedTemperature)
    ? Math.round(convertedTemperature * 10) / 10
    : convertedTemperature
}

const toPercentage = (probability) =>
  Math.min(100, Math.max(0, Math.round((probability ?? 0) * 100)))

const getWeatherIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`

const getWeatherFallbackLabel = (status) => {
  if (status.includes('비')) return '비'
  if (status.includes('눈')) return '눈'
  if (status.includes('구름') || status.includes('흐림')) return '구름'
  if (status.includes('맑')) return '맑음'

  return '날씨'
}

const hasWeatherIcon = (forecast) => Boolean(forecast.icon) && !failedIconIds.value.has(forecast.id)

const handleWeatherIconError = (forecastId) => {
  failedIconIds.value.add(forecastId)
}

const goBackToForecastList = () =>
  router.push({
    name: 'final-weather-forecast',
    query: {
      cityId: cityConfig.value?.id ?? 'city_01',
    },
  })

const getCityLocalToday = () => {
  const referenceForecast = forecasts.value.find(
    (forecast) => Number.isFinite(forecast.timestamp) && forecast.localDateTime,
  )

  if (!referenceForecast) {
    return ''
  }

  const [localDate, localTime = '00:00'] = referenceForecast.localDateTime.split(' ')
  const localTimestampAsUtc = Date.parse(`${localDate}T${localTime}:00Z`)

  if (Number.isNaN(localTimestampAsUtc)) {
    return ''
  }

  const timezoneOffset = localTimestampAsUtc - referenceForecast.timestamp * 1000

  return new Date(Date.now() + timezoneOffset).toISOString().slice(0, 10)
}

const currentForecastIndex = computed(() => {
  if (selectedLocalDate.value !== getCityLocalToday()) {
    return -1
  }

  const nowTimestamp = Date.now() / 1000

  return selectedDateForecasts.value.findIndex((forecast, index, dateForecasts) => {
    const nextForecast = dateForecasts[index + 1]
    const blockEndTimestamp = nextForecast?.timestamp ?? forecast.timestamp + 3 * 60 * 60

    return forecast.timestamp <= nowTimestamp && nowTimestamp < blockEndTimestamp
  })
})

const nextForecastIndex = computed(() => {
  if (selectedLocalDate.value !== getCityLocalToday() || currentForecastIndex.value >= 0) {
    return -1
  }

  const nowTimestamp = Date.now() / 1000

  return selectedDateForecasts.value.findIndex((forecast) => forecast.timestamp > nowTimestamp)
})

const focusForecastIndex = computed(() => {
  if (selectedLocalDate.value !== getCityLocalToday() || !selectedDateForecasts.value.length) {
    return -1
  }

  if (currentForecastIndex.value >= 0) {
    return currentForecastIndex.value
  }

  if (nextForecastIndex.value >= 0) {
    return nextForecastIndex.value
  }

  return selectedDateForecasts.value.length - 1
})

const getForecastAriaLabel = (forecast, index) => {
  const focusLabel =
    index === currentForecastIndex.value
      ? '현재 시간대, '
      : index === nextForecastIndex.value
        ? '다음 예보, '
        : ''
  const time = formatLocalTime(forecast.localDateTime)
  const temperature = displayTemperature(forecast.temp)
  const precipitationProbability = toPercentage(forecast.precipitationProbability)

  return `${focusLabel}${time}, ${forecast.status}, 기온 ${temperature}${configStore.unitSymbol}, 강수확률 ${precipitationProbability}퍼센트`
}

const scrollToRelevantForecast = () => {
  const listElement = threeHourListRef.value
  const cardElements = listElement ? [...listElement.children] : []

  if (!cardElements.length) {
    return
  }

  if (focusForecastIndex.value < 0) {
    listElement.scrollTo({ left: 0, behavior: 'auto' })
    return
  }

  const targetCard = cardElements[focusForecastIndex.value]

  if (!targetCard) {
    return
  }

  const targetLeft = targetCard.offsetLeft - (listElement.clientWidth - targetCard.offsetWidth) / 2
  const maximumLeft = listElement.scrollWidth - listElement.clientWidth

  listElement.scrollTo({
    left: Math.min(maximumLeft, Math.max(0, targetLeft)),
    behavior: 'smooth',
  })
}

const loadForecastDetail = async () => {
  const requestId = ++latestRequestId
  const requestedCity = cityConfig.value
  const requestedDate = selectedLocalDate.value

  forecasts.value = []
  failedIconIds.value = new Set()
  errorMessage.value = ''
  validationMessage.value = ''
  isLoading.value = false

  if (!requestedCity) {
    validationMessage.value = '해당 도시 정보를 찾을 수 없습니다.'
    return
  }

  if (!isValidLocalDate(requestedDate)) {
    validationMessage.value = '올바른 예보 날짜가 아닙니다.'
    return
  }

  isLoading.value = true

  try {
    const result = await fetchWeatherForecast(requestedCity)

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
      await nextTick()

      if (requestId === latestRequestId && !errorMessage.value) {
        scrollToRelevantForecast()
      }
    }
  }
}

watch([cityId, selectedLocalDate], loadForecastDetail, { immediate: true })
</script>

<template>
  <section class="forecast-detail-view">
    <ElCard class="forecast-detail-panel" shadow="never">
      <template #header>
        <header class="forecast-detail-panel__header">
          <div class="forecast-detail-heading">
            <h2>{{ pageTitle }}</h2>
            <p>3시간 간격 예보</p>
          </div>

          <ElTooltip content="단기 예보 목록으로 돌아가기" placement="bottom">
            <ElButton
              class="back-button"
              size="small"
              circle
              aria-label="단기 예보 목록으로 돌아가기"
              @click="goBackToForecastList"
            >
              <ElIcon><ArrowLeft /></ElIcon>
            </ElButton>
          </ElTooltip>
        </header>
      </template>

      <ElSkeleton
        v-if="isLoading"
        :rows="5"
        animated
        aria-label="3시간 간격 예보를 불러오는 중입니다."
      />

      <ElAlert
        v-else-if="errorMessage"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
      />

      <ElAlert
        v-else-if="validationMessage"
        :title="validationMessage"
        type="warning"
        show-icon
        :closable="false"
      />

      <ElEmpty
        v-else-if="!selectedDateForecasts.length"
        description="선택한 날짜의 상세 예보가 없습니다."
        :image-size="72"
      />

      <div
        v-else
        ref="threeHourListRef"
        class="three-hour-list"
        aria-label="선택 날짜의 3시간 간격 예보"
        tabindex="0"
      >
        <ElCard
          v-for="(forecast, index) in selectedDateForecasts"
          :key="forecast.id"
          class="three-hour-card"
          :class="{
            'three-hour-card--current': index === currentForecastIndex,
            'three-hour-card--next': index === nextForecastIndex,
          }"
          shadow="hover"
          :aria-current="index === currentForecastIndex ? 'time' : undefined"
          :aria-label="getForecastAriaLabel(forecast, index)"
        >
          <div class="three-hour-card__time">
            <strong>{{ formatLocalTime(forecast.localDateTime) }}</strong>
          </div>

          <span
            v-if="index === currentForecastIndex"
            class="three-hour-card__badge three-hour-card__badge--current"
          >
            현재
          </span>
          <span
            v-else-if="index === nextForecastIndex"
            class="three-hour-card__badge three-hour-card__badge--next"
          >
            다음 예보
          </span>

          <div class="weather-icon-shell">
            <img
              v-if="hasWeatherIcon(forecast)"
              class="weather-icon"
              :src="getWeatherIconUrl(forecast.icon)"
              :alt="forecast.status"
              :title="forecast.status"
              width="38"
              height="38"
              @error="handleWeatherIconError(forecast.id)"
            />
            <span v-else class="weather-icon-fallback" :aria-label="forecast.status">
              {{ getWeatherFallbackLabel(forecast.status) }}
            </span>
          </div>

          <span
            class="precipitation-probability"
            :aria-label="`강수확률 ${toPercentage(forecast.precipitationProbability)}퍼센트`"
          >
            💧 {{ toPercentage(forecast.precipitationProbability) }}%
          </span>

          <strong class="three-hour-card__temperature">
            {{ displayTemperature(forecast.temp) }}{{ configStore.unitSymbol }}
          </strong>
        </ElCard>
      </div>
    </ElCard>
  </section>
</template>

<style scoped>
.forecast-detail-view,
.forecast-detail-panel {
  min-width: 0;
}

.forecast-detail-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.forecast-detail-heading {
  display: grid;
  min-width: 0;
  gap: 4px;
}

h2,
p {
  margin: 0;
}

h2 {
  color: #163a63;
  font-size: 1rem;
  line-height: 1.35;
  overflow-wrap: break-word;
}

p {
  font-size: 0.78rem;
  line-height: 1.6;
}

.forecast-detail-panel :deep(.el-card__header),
.forecast-detail-panel :deep(.el-card__body) {
  padding: 12px;
}

.three-hour-list {
  --forecast-card-width: 64px;
  --forecast-card-gap: 12px;

  display: flex;
  flex-wrap: nowrap;
  position: relative;
  gap: var(--forecast-card-gap);
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 2px 12px 12px 4px;
  overscroll-behavior-x: contain;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color) var(--el-fill-color-light);
  -webkit-overflow-scrolling: touch;
}

.three-hour-list::-webkit-scrollbar {
  height: 8px;
}

.three-hour-list::-webkit-scrollbar-track {
  border-radius: 999px;
  background: var(--el-fill-color-light);
}

.three-hour-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--el-border-color);
}

.three-hour-list::-webkit-scrollbar-thumb:hover {
  background: var(--el-text-color-placeholder);
}

.three-hour-card {
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
  position: relative;
  width: var(--forecast-card-width);
  flex: 0 0 var(--forecast-card-width);
  scroll-snap-align: start;
  background: #f8fafc;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.three-hour-card--current {
  border-color: #409eff;
  background: #eff6ff;
  box-shadow: 0 3px 10px rgb(37 99 235 / 14%);
}

.three-hour-card--next {
  border-color: #94a3b8;
  background: #f1f5f9;
  box-shadow: 0 2px 8px rgb(71 85 105 / 10%);
}

.three-hour-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  min-height: 132px;
  overflow: hidden;
  padding: 22px 6px 9px;
  text-align: center;
}

.three-hour-card__time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #1e293b;
  font-size: 0.82rem;
  white-space: nowrap;
}

.three-hour-card__badge {
  position: absolute;
  top: 5px;
  right: 5px;
  max-width: calc(100% - 10px);
  overflow: hidden;
  padding: 2px 5px;
  border-radius: 999px;
  font-size: 0.64rem;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.three-hour-card__badge--current {
  color: #fff;
  background: #409eff;
}

.three-hour-card__badge--next {
  color: #475569;
  background: #e2e8f0;
}

.weather-icon-shell {
  display: grid;
  width: 42px;
  height: 42px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  place-items: center;
  overflow: visible;
  background: linear-gradient(145deg, var(--el-color-primary-light-8), var(--el-fill-color-light));
}

.weather-icon {
  display: block;
  width: 38px;
  height: 38px;
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 12%));
  object-fit: contain;
}

.weather-icon-fallback {
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;
}

.precipitation-probability {
  color: var(--el-text-color-secondary);
  font-size: 0.7rem;
  white-space: nowrap;
}

.three-hour-card__temperature {
  color: #1e293b;
  font-size: 0.9rem;
  white-space: nowrap;
}

.back-button {
  flex: 0 0 auto;
}

@media (max-width: 600px) {
  .forecast-detail-panel__header {
    gap: 8px;
  }
}
</style>
