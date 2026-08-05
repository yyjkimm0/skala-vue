<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

/**
 * first의 Mockup 기능에 ref, computed, watch, watchEffect를 적용한 단계다.
 * 검색과 상태 감시를 추가하되 컴포넌트 분리·상세 Router·Pinia·API 연동 전 구조를 유지한다.
 */
// 외부 API 도입 전이므로 화면에 필요한 이름·기온·상태를 고정 데이터로 제공한다.
// 각 id는 v-for에서 도시 카드의 정체성을 유지하는 식별값으로 사용한다.
// 배열을 바꾸지 않는 현재 예제에서도 Composition API의 반응형 상태 구조를 학습하도록 ref로 관리한다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 검색어 원본을 소유하며, 값이 바뀌면 이를 읽는 computed가 화면용 결과를 다시 계산한다.
const searchQuery = ref('')
// 이름·기온·상태를 함께 표시하고 감시할 수 있도록 선택한 weather 객체 전체를 보관한다.
const selectedCityInfo = ref(null)

// 원본 목록은 수정하지 않고 검색어가 도시 이름에 포함되는 항목만 화면용 배열로 계산한다.
// 앞뒤 공백을 제거한 검색어가 비어 있으면 전체 도시를 반환한다.
const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherList.value
  }

  return weatherList.value.filter((weather) => weather.name.toLowerCase().includes(normalizedQuery))
})

// 카드 클릭과 Enter 입력이 같은 함수를 사용하며, 상태 안내에 필요한 weather 객체 전체를 보관한다.
const selectCity = (weather) => {
  selectedCityInfo.value = weather
}

// 선택 객체의 참조가 바뀔 때만 실행해 이전 도시와 현재 도시를 비교한다.
// immediate 옵션이 없으므로 최초 마운트에는 실행되지 않으며, 객체 내부를 바꾸지 않아 deep 감시도 필요 없다.
watch(selectedCityInfo, (newCity, oldCity) => {
  console.log('[watch] 선택 도시 변경')
  console.log(`이전 도시: ${oldCity?.name ?? '선택 없음'}`)
  console.log(`현재 도시: ${newCity?.name ?? '선택 없음'}`)
})

// 콜백에서 읽는 검색어와 필터 결과를 Vue가 자동 추적한다.
// 설정 시 한 번 실행된 뒤 두 값 중 하나가 바뀌면 현재 검색 상태를 다시 기록한다.
watchEffect(() => {
  const query = searchQuery.value.trim()
  const resultNames = filteredWeatherList.value.map((weather) => weather.name)

  console.log('[watchEffect] 검색 상태')
  console.log(`검색어: ${query || '입력 없음'}`)
  console.log(`검색 결과: ${resultNames.length ? resultNames.join(', ') : '검색 결과 없음'}`)
})

const showDetail = (cityName, status) => {
  // 상세 route 도입 전 단계이므로 별도 이동 없이 현재 도시 상태를 alert로 확인한다.
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <section class="weather-mockup">
    <div class="search-panel">
      <label for="second-city-search">🔍 도시 검색</label>
      <!--
        [experiment] lazy는 change 시점에 trim된 값을 반영하므로 기존 즉시 검색 UX와 다르다.
      -->
      <input
        id="second-city-search"
        v-model.trim.lazy="searchQuery"
        type="text"
        placeholder="도시명을 입력하세요"
      />
      <p class="input-status">
        {{
          searchQuery.trim()
            ? `검색 중인 도시: ${searchQuery.trim()}`
            : '검색어를 입력하지 않았습니다.'
        }}
      </p>
    </div>

    <section class="weather-panel" aria-labelledby="second-weather-list-title">
      <h2 id="second-weather-list-title">🏙️ 지역별 날씨 현황</h2>
      <!-- 파생 목록이 있으면 고유 id로 카드를 렌더링하고, 비어 있으면 안내 문구로 전환한다. -->
      <div v-if="filteredWeatherList.length" class="weather-grid">
        <article
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          class="weather-card"
          tabindex="0"
          @click="selectCity(weather)"
          @keydown.enter="selectCity(weather)"
        >
          <div class="weather-card__info">
            <h3 class="weather-card__name">{{ weather.name }} ({{ weather.status }})</h3>
            <p class="temperature">현재 기온: {{ weather.temp }}℃</p>
            <!-- 25도 기준은 원본 기온을 변경하지 않고 카드의 상태 문구만 선택한다. -->
            <p v-if="weather.temp >= 25" class="temperature-label hot">🔥 더움 (25도 이상)</p>
            <p v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</p>
          </div>
          <!-- alert 동작이 부모 카드의 선택 이벤트까지 발생시키지 않도록 전파를 중단한다. -->
          <button type="button" @click.stop="showDetail(weather.name, weather.status)">
            상세보기
          </button>
        </article>
      </div>
      <p v-else class="empty-state">검색 결과와 일치하는 도시가 없습니다.</p>
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
