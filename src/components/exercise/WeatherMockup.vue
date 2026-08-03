<script setup>
import { computed, ref } from 'vue'

const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
]

const searchQuery = ref('')
const selectedCity = ref('')

const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherList
  }

  return weatherList.filter((weather) => weather.name.toLowerCase().includes(normalizedQuery))
})

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
        :value="searchQuery"
        type="text"
        placeholder="도시명을 입력하세요"
        @input="searchQuery = $event.target.value"
      />
      <p class="input-status">
        {{
          searchQuery.trim()
            ? `검색 중인 도시: ${searchQuery.trim()}`
            : '검색어를 입력하지 않았습니다.'
        }}
      </p>
    </div>

    <section aria-labelledby="weather-list-title">
      <h2 id="weather-list-title">지역별 날씨</h2>
      <div v-if="filteredWeatherList.length" class="weather-grid">
        <article
          v-for="weather in filteredWeatherList"
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
      <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>
    </section>

    <div class="selection-status" role="status" aria-live="polite">
      {{ selectedCity ? `${selectedCity}이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.' }}
    </div>
  </section>
</template>
