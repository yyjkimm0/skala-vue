<script setup>
import { ref } from 'vue'

/**
 * Mock Data, 입력값, 카드 선택을 한 컴포넌트에서 다루는 초기 학습 단계다.
 * 검색 필터·컴포넌트 분리·상세 Router·Pinia·API 연동은 이후 lab에서 확장한다.
 */
const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
]

// 입력 문자열은 필터링하지 않고 native input 이벤트로 받은 값을 그대로 표시한다.
const cityInput = ref('')
// 카드 선택 결과를 보존해 화면 하단의 상태 안내에 반영한다.
const selectedCity = ref('')

const selectCity = (cityName) => {
  selectedCity.value = cityName
}

const showDetail = (cityName, status) => {
  // 상세 route를 도입하기 전 단계이므로 현재는 단순 alert로 선택 도시의 상태를 안내한다.
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <section class="weather-mockup">
    <div class="search-panel">
      <label for="first-city-search">🔍 도시 검색</label>
      <input
        id="first-city-search"
        :value="cityInput"
        type="text"
        placeholder="도시명을 입력하세요"
        @input="cityInput = $event.target.value"
      />
      <p class="input-status">입력한 도시: {{ cityInput || '아직 입력하지 않았습니다.' }}</p>
    </div>

    <section class="weather-panel" aria-labelledby="first-weather-list-title">
      <h2 id="first-weather-list-title">🏙️ 지역별 날씨 현황</h2>
      <div class="weather-grid">
        <!-- 고유 id는 카드 정체성을 보존하고, tabindex와 Enter는 키보드 선택을 지원한다. -->
        <article
          v-for="weather in weatherList"
          :key="weather.id"
          class="weather-card"
          tabindex="0"
          @click="selectCity(weather.name)"
          @keydown.enter="selectCity(weather.name)"
        >
          <div class="weather-card__info">
            <h3 class="weather-card__name">{{ weather.name }} ({{ weather.status }})</h3>
            <p class="temperature">현재 기온: {{ weather.temp }}℃</p>
            <!-- 25도를 기준으로 서로 다른 온도 상태를 조건부 렌더링한다. -->
            <p v-if="weather.temp >= 25" class="temperature-label hot">🔥 더움 (25도 이상)</p>
            <p v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</p>
          </div>
          <!-- 상세 버튼 클릭이 카드 선택까지 발생시키지 않도록 이벤트 전파를 중단한다. -->
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
