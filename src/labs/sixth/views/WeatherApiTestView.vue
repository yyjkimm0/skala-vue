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
    <h1>서울 현재 날씨 API 테스트</h1>

    <p v-if="isLoading">서울 날씨를 불러오는 중입니다.</p>

    <p v-else-if="errorMessage" role="alert">{{ errorMessage }}</p>

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
  background: #ffffff;
}

.weather-api-test h1 {
  margin: 0 0 12px;
  color: #163a63;
  font-size: 1.05rem;
}

.weather-api-test__details {
  display: grid;
  gap: 8px;
  margin: 0;
}

.weather-api-test__details div {
  display: flex;
  gap: 8px;
}

.weather-api-test__details dt {
  font-weight: 700;
}

.weather-api-test__details dd {
  margin: 0;
}
</style>
