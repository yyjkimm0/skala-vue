<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElAlert, ElButton, ElCard, ElEmpty, ElIcon, ElSkeleton, ElTooltip } from 'element-plus'
import { findWeatherCityById } from '../data/weatherCities.js'
import { fetchWeatherForecast } from '../services/weatherApi.js'
import { useConfigStore } from '../stores/configStore.js'
import { convertTemperature } from '../utils/temperature.js'

/**
 * route의 도시와 날짜로 Forecast를 다시 요청하고 해당 날짜의 실제 3시간 예보를 시간순으로 표시한다.
 * 목록 메모리에 의존하지 않아 상세 URL 직접 접근과 새로고침에서도 화면을 구성할 수 있다.
 * 도시 현지 기준 오늘이면 현재·다음·마지막 예보 우선순위로 가로 목록의 초점을 정한다.
 * 요청·icon 오류·DOM 스크롤은 로컬 상태이며 전역 Store에서는 표시 단위만 공유한다.
 */
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

/**
 * 전체 Forecast를 보존한 채 route 날짜와 같은 항목만 복사해 timestamp 오름차순으로 정렬한다.
 * API가 반환한 모든 실제 항목을 유지하며 응답에 없는 과거 시간대는 임의로 생성하지 않는다.
 */
const selectedDateForecasts = computed(() =>
  [...forecasts.value]
    .filter((forecast) => forecast.localDate === selectedLocalDate.value)
    .sort((firstForecast, secondForecast) => firstForecast.timestamp - secondForecast.timestamp),
)

// 날짜 문자열 형식과 실제 달력 날짜를 모두 검사해 잘못된 params를 요청 전에 구분한다.
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

// Store 단위가 바뀌면 API를 다시 요청하지 않고 섭씨 원본의 표시값만 소수점 한 자리로 갱신한다.
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

// 카드별 이미지 실패 id만 로컬 Set에 기록해 다른 예보 아이콘에는 영향을 주지 않는다.
const handleWeatherIconError = (forecastId) => {
  failedIconIds.value.add(forecastId)
}

// 상세 route의 유효한 도시를 query로 넘겨 목록에 돌아왔을 때 같은 도시 선택을 복원한다.
const goBackToForecastList = () =>
  router.push({
    name: 'final-weather-forecast',
    query: {
      cityId: cityConfig.value?.id ?? 'city_01',
    },
  })

/**
 * Forecast의 UTC timestamp와 mapper가 만든 현지 시각의 차이로 도시 timezone offset을 복원한다.
 * 사용자 PC 날짜가 아니라 도시 현지 날짜를 기준으로 선택한 날짜가 오늘인지 판단한다.
 */
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

// 오늘에만 시작 시각 <= 현재 < 다음 시작 시각을 만족하는 실제 3시간 블록을 찾는다.
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

// 현재 블록이 응답에 없을 때 현재 시각 이후의 첫 실제 예보를 '다음 예보'로 선택한다.
const nextForecastIndex = computed(() => {
  if (selectedLocalDate.value !== getCityLocalToday() || currentForecastIndex.value >= 0) {
    return -1
  }

  const nowTimestamp = Date.now() / 1000

  return selectedDateForecasts.value.findIndex((forecast) => forecast.timestamp > nowTimestamp)
})

// 자동 초점은 현재 블록, 다음 예보, 오늘의 마지막 실제 예보 순이며 다른 날짜에는 적용하지 않는다.
// 마지막 fallback은 위치만 맞추고 현재·다음 배지나 aria-current를 부여하지 않는다.
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

/**
 * 렌더링된 고정 폭 카드의 실제 위치로 중앙 좌표를 계산하고 가로 목록 범위 안에서 이동한다.
 * 초점이 없는 날짜는 목록 시작점에 두며 데이터 준비 후 한 번 호출되어 사용자 스크롤을 반복해 덮지 않는다.
 */
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

/**
 * params를 먼저 검증한 뒤 목록과 공유하지 않은 Forecast를 상세 View에서 다시 요청한다.
 * 연속 route 변경에서는 최신 요청 ID와 일치하는 결과와 loading 종료만 반영한다.
 */
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
      // 카드 DOM이 생성된 다음에만 크기와 위치를 읽어 초점 카드를 중앙에 배치할 수 있다.
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

      <!-- loading → 요청 오류 → params 오류 → 데이터 없음 → 성공 시간축 순서로 상태를 판정한다. -->
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

      <!-- 유효하지 않은 params와 유효한 날짜에 데이터가 없는 empty 상태를 별도로 표시한다. -->
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
        <!-- 클릭 대상이 아닌 시간축 카드로, 시각·icon·강수확률·기온만 빠르게 비교한다. -->
        <!-- 현재 블록만 aria-current를 사용하고 다음 예보는 별도 class와 배지로 구분한다. -->
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
            <!-- 이미지가 없거나 로드에 실패하면 날씨 상태에서 만든 짧은 텍스트로 대체한다. -->
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

/* 목록이 가로 overflow와 visible scrollbar를 담당하고 각 카드는 고정 폭 snap 지점이 된다. */
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

/* WebKit 환경에서도 사용자가 현재 가로 위치와 추가 항목 존재 여부를 확인할 수 있게 한다. */
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

/* 카드 자체 overflow는 고정 폭 안에서 배지와 콘텐츠가 이웃 카드 영역을 침범하지 않게 한다. */
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

/* 현재 블록과 다음 예보는 크기를 바꾸지 않고 테두리·배경으로 서로 다른 강도로 강조한다. */
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

/* scoped CSS가 직접 닿지 않는 ElCard body를 세로 시간축 콘텐츠에 맞게 정렬한다. */
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
