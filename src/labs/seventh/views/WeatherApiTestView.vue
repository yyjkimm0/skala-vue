<script setup>
import { onMounted, ref } from 'vue'
import { fetchCurrentWeather } from '../services/weatherApi.js'

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

    <p
      v-if="isLoading"
      class="weather-api-test__status weather-api-test__status--loading"
    >
      서울 날씨를 불러오는 중입니다.
    </p>

    <p
      v-else-if="errorMessage"
      class="weather-api-test__status weather-api-test__status--error"
      role="alert"
    >
      {{ errorMessage }}
    </p>

    <dl v-else-if="weather" class="weather-api-test__details">
      <div>
        <dt>도시명</dt>
        <dd>{{ weather.name }}</dd>
      </div>
      <div>
        <dt>현재 기온</dt>
        <dd>{{ weather.temp }}°C</dd>
      </div>
      <div>
        <dt>날씨 설명</dt>
        <dd>{{ weather.status }}</dd>
      </div>
      <div>
        <dt>습도</dt>
        <dd>{{ weather.humidity }}%</dd>
      </div>
      <div>
        <dt>풍속</dt>
        <dd>{{ weather.windSpeed }}m/s</dd>
      </div>
    </dl>
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

.weather-api-test__status {
  margin: 0;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 0.76rem;
}

.weather-api-test__status--loading {
  color: #1e40af;
  background: #eff6ff;
}

.weather-api-test__status--error {
  color: #991b1b;
  background: #fef2f2;
}

.weather-api-test__details {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 10px;
  border-radius: 5px;
  background: #f1f5f9;
}

.weather-api-test__details div {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 8px;
  font-size: 0.78rem;
}

.weather-api-test__details dt {
  font-weight: 700;
}

.weather-api-test__details dd {
  margin: 0;
}
</style>
