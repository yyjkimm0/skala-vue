<script setup>
import { computed, ref, watch } from 'vue'
import { ElAlert, ElDescriptions, ElDescriptionsItem, ElSkeleton } from 'element-plus'
import { RouterLink, useRoute } from 'vue-router'
import { findWeatherCityById } from '../data/weatherCities.js'
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
    if (loadId === latestLoadId) {
      city.value = mockCity ?? null
      errorMessage.value = `${cityConfig.name} 실시간 날씨를 불러오지 못해 Mock Data를 표시하고 있습니다.`
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
    <ElSkeleton
      v-if="isLoading"
      class="weather-detail__skeleton"
      :rows="5"
      animated
      aria-label="상세 날씨를 불러오는 중입니다."
    />

    <template v-else>
      <ElAlert
        v-if="isUsingMockFallback"
        class="weather-detail__alert"
        :title="errorMessage"
        type="warning"
        show-icon
        :closable="false"
      />

      <ElDescriptions
        v-if="city"
        class="weather-detail__descriptions"
        title="📊 지역별 상세 기상 관측 정보"
        :column="1"
        border
        size="small"
      >
        <ElDescriptionsItem label="지역">
          {{ locationNames[city.id] }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="날씨 상태">
          {{ city.status }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="현재 기온">
          {{ displayTemperature }}{{ configStore.unitSymbol }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="습도"> {{ city.humidity }}% </ElDescriptionsItem>
        <ElDescriptionsItem label="풍속"> {{ city.windSpeed }}m/s </ElDescriptionsItem>
      </ElDescriptions>

      <p v-else class="missing-city">해당 도시 정보를 찾을 수 없습니다.</p>
    </template>

    <RouterLink class="back-link" :to="{ name: 'eighth-weather-home' }">
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

.weather-detail__skeleton,
.weather-detail__alert {
  margin: 0 0 12px;
}

.weather-detail__descriptions {
  margin: 0 0 12px;
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
