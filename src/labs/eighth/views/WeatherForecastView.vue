<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElAlert, ElSkeleton } from 'element-plus'
import { findWeatherCityById } from '../data/weatherCities.js'
import { fetchWeatherForecast } from '../services/weatherApi.js'

const forecasts = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const seoulConfig = findWeatherCityById('city_01')

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

const formatLocalDate = (localDate) => {
  const [year, month, day] = localDate.split('-')

  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

const formatLocalTime = (localDateTime) =>
  localDateTime?.split(' ')[1] ?? '정보 없음'

const loadSeoulForecast = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    forecasts.value = await fetchWeatherForecast(seoulConfig)
  } catch {
    forecasts.value = []
    errorMessage.value = '단기 예보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadSeoulForecast)
</script>

<template>
  <section class="forecast-view">
    <h2>서울 5일 단기 예보</h2>
    <p>
      3시간 간격 예보를 날짜별로 묶고, 정오에 가장 가까운 시간대를 대표 예보로
      표시합니다.
    </p>

    <ElSkeleton
      v-if="isLoading"
      :rows="5"
      animated
      aria-label="서울 단기 예보를 불러오는 중입니다."
    />

    <ElAlert
      v-else-if="errorMessage"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />

    <ul v-else-if="dailyForecasts.length" class="forecast-list">
      <li
        v-for="forecast in dailyForecasts"
        :key="forecast.id"
        class="forecast-list__item"
      >
        <strong>{{ formatLocalDate(forecast.localDate) }}</strong>
        <span>대표 시각: {{ formatLocalTime(forecast.localDateTime) }}</span>
        <span>기온: {{ forecast.temp }}℃</span>
        <span>체감온도: {{ forecast.feelsLike }}℃</span>
        <span>날씨: {{ forecast.status }}</span>
        <span>습도: {{ forecast.humidity }}%</span>
        <span>
          강수확률: {{ Math.round(forecast.precipitationProbability * 100) }}%
        </span>
      </li>
    </ul>

    <p v-else class="forecast-view__status">
      표시할 예보 데이터가 없습니다.
    </p>
  </section>
</template>

<style scoped>
.forecast-view {
  padding: 14px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #fff;
}

h2,
p {
  margin-top: 0;
}

h2 {
  color: #163a63;
  font-size: 1rem;
}

p {
  font-size: 0.78rem;
  line-height: 1.6;
}

.forecast-view__status {
  margin-bottom: 0;
  color: #64748b;
}

.forecast-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.forecast-list__item {
  display: grid;
  gap: 3px;
  padding: 10px;
  border: 1px solid #dbe4ef;
  border-radius: 5px;
  color: #475569;
  background: #f8fafc;
  font-size: 0.76rem;
}

.forecast-list__item strong {
  color: #1e293b;
}
</style>
