<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { weatherList } from '../data/weatherData.js'

const route = useRoute()

const city = computed(() => weatherList.find((weather) => weather.id === route.params.cityId))
</script>

<template>
  <section class="weather-detail">
    <h2>📊 지역별 상세 기상 관측 정보</h2>

    <dl v-if="city" class="weather-detail__list">
      <div>
        <dt>지역</dt>
        <dd>{{ city.name }}</dd>
      </div>
      <div>
        <dt>날씨 상태</dt>
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

    <p v-else class="missing-city">해당 도시 정보를 찾을 수 없습니다.</p>

    <RouterLink class="back-link" :to="{ name: 'fourth-weather-home' }">
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
  grid-template-columns: 72px 1fr;
  gap: 8px;
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
