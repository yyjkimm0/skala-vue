<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { weatherList } from '../data/weatherData.js'

const route = useRoute()

const city = computed(() =>
  weatherList.find((weather) => weather.id === route.params.cityId),
)
</script>

<template>
  <section class="weather-detail">
    <h1>지역별 날씨 상세 정보</h1>

    <dl v-if="city" class="weather-detail__list">
      <div>
        <dt>지역</dt>
        <dd>{{ city.name }}</dd>
      </div>
      <div>
        <dt>날씨</dt>
        <dd>{{ city.status }}</dd>
      </div>
      <div>
        <dt>현재 기온</dt>
        <dd>{{ city.temp }}℃</dd>
      </div>
      <div>
        <dt>습도</dt>
        <dd>{{ city.humidity }}%</dd>
      </div>
      <div>
        <dt>풍속</dt>
        <dd>{{ city.windSpeed }}m/s</dd>
      </div>
    </dl>

    <p v-else>해당 도시 정보를 찾을 수 없습니다.</p>

    <RouterLink class="back-link" to="/">메인 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.weather-detail {
  padding: 20px;
  border: 1px solid #d6e0ed;
  border-radius: 12px;
  background: #ffffff;
}

.weather-detail h1 {
  margin-top: 0;
  color: #163a63;
}

.weather-detail__list {
  display: grid;
  gap: 12px;
  margin: 0 0 24px;
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
  color: #2563eb;
  font-weight: 700;
}
</style>
