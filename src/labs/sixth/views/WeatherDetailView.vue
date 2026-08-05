<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { findWeatherCityById } from '../data/weatherCities.js'
import { weatherList } from '../data/weatherData.js'
import { fetchCurrentWeather } from '../services/weatherApi.js'
import { useConfigStore } from '../stores/configStore.js'
import { convertTemperature } from '../utils/temperature.js'

/**
 * route의 도시 설정으로 상세 날씨를 다시 요청하고 실패하면 같은 도시의 Mock Data를 표시한다.
 * 목록 데이터를 공유하지 않아 상세 URL로 직접 진입해도 자체적으로 데이터를 준비할 수 있다.
 */
const route = useRoute()
const configStore = useConfigStore()

const city = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const isUsingMockFallback = ref(false)
let latestLoadId = 0

const displayTemperature = computed(() => {
  if (!city.value) {
    return null
  }

  return convertTemperature(city.value.temp, configStore.unit)
})

const locationNames = {
  city_01: '대한민국 서울특별시',
  city_02: '대한민국 경기도 수원시',
  city_03: '대한민국 부산광역시',
}

const loadWeatherDetail = async () => {
  // 연속 route 변경 시 먼저 시작한 요청이 늦게 끝나 최신 화면을 덮어쓰지 못하게 한다.
  const loadId = ++latestLoadId
  const cityId = route.params.cityId
  const cityConfig = findWeatherCityById(cityId)
  const mockCity = weatherList.find((weather) => weather.id === cityId)

  city.value = null
  isLoading.value = Boolean(cityConfig)
  errorMessage.value = ''
  isUsingMockFallback.value = false

  try {
    if (!cityConfig) {
      return
    }

    const currentWeather = await fetchCurrentWeather(cityConfig)

    if (loadId === latestLoadId) {
      city.value = currentWeather
    }
  } catch {
    // 현재 요청의 실패만 반영하며 API 실패를 사용자에게 알리고 Mock 사용 상태를 구분한다.
    if (loadId === latestLoadId) {
      city.value = mockCity ?? null
      errorMessage.value = `${cityConfig.name} 실시간 날씨를 불러오지 못해 Mock Data를 표시하고 있습니다.`
      isUsingMockFallback.value = true
    }
  } finally {
    // 오래된 요청은 최신 요청의 loading 상태도 종료하지 않는다.
    if (loadId === latestLoadId) {
      isLoading.value = false
    }
  }
}

watch(() => route.params.cityId, loadWeatherDetail, { immediate: true })
</script>

<template>
  <section class="weather-detail">
    <h2>📊 지역별 상세 기상 관측 정보</h2>

    <p v-if="isLoading" class="weather-detail__loading" role="status">
      상세 날씨를 불러오는 중입니다.
    </p>

    <template v-else>
      <p v-if="isUsingMockFallback" class="weather-detail__notice" role="alert">
        {{ errorMessage }}
      </p>

      <dl v-if="city" class="weather-detail__list">
        <div>
          <dt>📍 지점 지역:</dt>
          <dd>{{ locationNames[city.id] }}</dd>
        </div>
        <div>
          <dt>실시간 기온:</dt>
          <dd>{{ displayTemperature }}{{ configStore.unitSymbol }}</dd>
        </div>
        <div>
          <dt>기상 현황:</dt>
          <dd>{{ city.status }}</dd>
        </div>
        <div>
          <dt>대기 습도:</dt>
          <dd>{{ city.humidity }}%</dd>
        </div>
        <div>
          <dt>현재 풍속:</dt>
          <dd>{{ city.windSpeed }}m/s</dd>
        </div>
      </dl>

      <p v-else class="missing-city">해당 도시 정보를 찾을 수 없습니다.</p>
    </template>

    <RouterLink class="back-link" :to="{ name: 'sixth-weather-home' }">
      ← 메인 대시보드로 돌아가기
    </RouterLink>
  </section>
</template>

<style scoped>
.weather-detail {
  padding: 14px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #fff;
}

h2 {
  margin: 0 0 12px;
  color: #163a63;
  font-size: 1rem;
}

.weather-detail__loading,
.weather-detail__notice {
  margin: 0 0 12px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 0.74rem;
}

.weather-detail__loading {
  color: #1e40af;
  background: #eff6ff;
}

.weather-detail__notice {
  color: #92400e;
  background: #fffbeb;
}

.weather-detail__list {
  display: grid;
  gap: 6px;
  margin: 0 0 12px;
  padding: 10px;
  border-radius: 5px;
  background: #f1f5f9;
}

.weather-detail__list div {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 8px;
  min-width: 0;
  font-size: 0.78rem;
}

dt {
  font-weight: 700;
}

dd {
  margin: 0;
}

.missing-city {
  margin: 0 0 12px;
  color: #526276;
  font-size: 0.78rem;
}

.back-link {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 4px;
  color: #fff;
  background: #374151;
  font-size: 0.74rem;
  font-weight: 700;
  text-decoration: none;
}
</style>
