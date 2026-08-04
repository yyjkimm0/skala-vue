<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { weatherList } from '../data/weatherData.js'
import { fetchCurrentWeather } from '../services/weatherApi.js'
import { useConfigStore } from '../stores/configStore.js'
import { convertTemperature } from '../utils/temperature.js'

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
  const loadId = ++latestLoadId
  const cityId = route.params.cityId
  const mockCity = weatherList.find((weather) => weather.id === cityId)

  city.value = null
  isLoading.value = cityId === 'city_01'
  errorMessage.value = ''
  isUsingMockFallback.value = false

  try {
    if (cityId === 'city_01') {
      const seoulWeather = await fetchCurrentWeather('Seoul')

      if (loadId === latestLoadId) {
        city.value = seoulWeather
      }
    } else {
      city.value = mockCity ?? null
    }
  } catch {
    if (loadId === latestLoadId) {
      city.value = mockCity ?? null
      errorMessage.value =
        '서울 실시간 날씨를 불러오지 못해 Mock Data를 표시하고 있습니다.'
      isUsingMockFallback.value = true
    }
  } finally {
    if (loadId === latestLoadId) {
      isLoading.value = false
    }
  }
}

watch(() => route.params.cityId, loadWeatherDetail, { immediate: true })
</script>

<template>
  <section class="weather-detail">
    <h1>📊 지역별 상세 기상 관측 정보</h1>

    <p v-if="isLoading" role="status">서울 상세 날씨를 불러오는 중입니다.</p>

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

      <p v-else>해당 도시 정보를 찾을 수 없습니다.</p>
    </template>

    <RouterLink class="back-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.weather-detail {
  padding: 14px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #ffffff;
}

.weather-detail h1 {
  margin: 0 0 12px;
  color: #163a63;
  font-size: 1.05rem;
}

.weather-detail__notice {
  margin: 0 0 12px;
  font-size: 0.8rem;
}

.weather-detail__list {
  display: grid;
  gap: 8px;
  margin: 0 0 12px;
  padding: 12px;
  border-radius: 4px;
  background: #f3f4f6;
  font-size: 0.8rem;
}

.weather-detail__list div {
  display: flex;
  gap: 8px;
}

.weather-detail__list dt {
  font-weight: 700;
}

.weather-detail__list dd {
  margin: 0;
}

.back-link {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 3px;
  color: #ffffff;
  background: #374151;
  font-weight: 700;
  text-decoration: none;
}
</style>
