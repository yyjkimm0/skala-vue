<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
]

const searchQuery = ref('')
const selectedCityInfo = ref(null)

const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherList
  }

  return weatherList.filter((weather) => weather.name.toLowerCase().includes(normalizedQuery))
})

const selectCity = (weather) => {
  selectedCityInfo.value = weather
}

watch(selectedCityInfo, (newCity, oldCity) => {
  console.log('[watch] 선택 도시 변경')
  console.log(`이전 도시: ${oldCity?.name ?? '선택 없음'}`)
  console.log(`현재 도시: ${newCity?.name ?? '선택 없음'}`)
})

watchEffect(() => {
  const query = searchQuery.value.trim()
  const resultNames = filteredWeatherList.value.map((weather) => weather.name)

  console.log('[watchEffect] 검색 상태')
  console.log(`검색어: ${query || '입력 없음'}`)
  console.log(`검색 결과: ${resultNames.length ? resultNames.join(', ') : '검색 결과 없음'}`)
})

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
          @click="selectCity(weather)"
          @keydown.enter="selectCity(weather)"
        >
          <h3>{{ weather.name }}</h3>
          <p class="temperature">{{ weather.temp }}℃</p>
          <p>날씨 상태: {{ weather.status }}</p>
          <p v-if="weather.temp >= 25" class="temperature-label hot">🔥 더움 (25도 이상)</p>
          <p v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</p>
          <button type="button" @click.stop="showDetail(weather.name, weather.status)">
            상세보기
          </button>
        </article>
      </div>
      <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>
    </section>

    <div class="selection-status" role="status" aria-live="polite">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다. 현재 기온은 ${selectedCityInfo.temp}℃이고 날씨는 ${selectedCityInfo.status}입니다.`
          : '검색 후 원하는 날씨 카드를 선택해 보세요.'
      }}
    </div>
  </section>
</template>
