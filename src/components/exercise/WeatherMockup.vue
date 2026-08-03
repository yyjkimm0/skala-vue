<script setup>
import { ref } from 'vue'

const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
]

const cityInput = ref('')
const selectedCity = ref('')

const selectCity = (cityName) => {
  selectedCity.value = cityName
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <section class="weather-mockup">
    <div class="search-panel">
      <label for="city-search">도시 검색어</label>
      <input
        id="city-search"
        :value="cityInput"
        type="text"
        placeholder="도시명을 입력하세요"
        @input="cityInput = $event.target.value"
      />
      <p class="input-status">입력한 도시: {{ cityInput || '아직 입력하지 않았습니다.' }}</p>
    </div>

    <section aria-labelledby="weather-list-title">
      <h2 id="weather-list-title">지역별 날씨</h2>
      <div class="weather-grid">
        <article
          v-for="weather in weatherList"
          :key="weather.id"
          class="weather-card"
          tabindex="0"
          @click="selectCity(weather.name)"
          @keydown.enter="selectCity(weather.name)"
        >
          <h3>{{ weather.name }}</h3>
          <p class="temperature">{{ weather.temp }}℃</p>
          <p>날씨 상태: {{ weather.status }}</p>
          <p v-if="weather.temp >= 25" class="temperature-label hot">
            🔥 더움 (25도 이상)
          </p>
          <p v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</p>
          <button type="button" @click.stop="showDetail(weather.name, weather.status)">
            상세보기
          </button>
        </article>
      </div>
    </section>

    <div class="selection-status" role="status" aria-live="polite">
      {{ selectedCity ? `${selectedCity}이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.' }}
    </div>
  </section>
</template>
