<script setup>
import { onMounted, ref } from 'vue'
import { ElAlert, ElDescriptions, ElDescriptionsItem, ElSkeleton } from 'element-plus'
import { fetchCurrentWeather } from '../services/weatherApi.js'

/**
 * fallback 없는 API 확인 목적은 유지하고 loading·error·success 표현만 Element Plus로 바꾼다.
 * Skeleton, error Alert, Descriptions가 서로 배타적으로 현재 요청 결과를 나타낸다.
 * API Key나 오류 객체를 노출하지 않고 실패 시 안전한 사용자 메시지만 표시한다.
 */
const weather = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const loadSeoulWeather = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    weather.value = await fetchCurrentWeather('Seoul')
  } catch {
    weather.value = null
    errorMessage.value = '날씨 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadSeoulWeather)
</script>

<template>
  <section class="weather-api-test">
    <h2>서울 현재 날씨 API 테스트</h2>

    <!-- 실제 요청 결과를 확인하는 화면이므로 오류를 warning이 아닌 error Alert로 표시한다. -->
    <ElSkeleton
      v-if="isLoading"
      class="weather-api-test__skeleton"
      :rows="5"
      animated
      aria-label="서울 날씨를 불러오는 중입니다."
    />

    <ElAlert
      v-else-if="errorMessage"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />

    <ElDescriptions
      v-else-if="weather"
      title="OpenWeather API 응답"
      :column="1"
      border
      size="small"
    >
      <ElDescriptionsItem label="도시명">
        {{ weather.name }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="현재 기온"> {{ weather.temp }}°C </ElDescriptionsItem>
      <ElDescriptionsItem label="날씨 상태">
        {{ weather.status }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="습도"> {{ weather.humidity }}% </ElDescriptionsItem>
      <ElDescriptionsItem label="풍속"> {{ weather.windSpeed }}m/s </ElDescriptionsItem>
    </ElDescriptions>
  </section>
</template>

<style scoped>
.weather-api-test {
  padding: 14px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #fff;
}

.weather-api-test h2 {
  margin: 0 0 12px;
  color: #163a63;
  font-size: 1rem;
}

.weather-api-test__skeleton {
  margin: 0;
}
</style>
