<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { weatherList } from '../../data/weatherData.js'
import { useConfigStore } from '../../stores/configStore.js'
import { convertTemperature } from '../../utils/temperature.js'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

/**
 * 검색과 카드 선택은 이 Home 부모의 로컬 상태로 관리하고 자식 이벤트를 받아 갱신한다.
 * 여러 route가 공유하는 표시 단위만 Pinia에서 읽어 Mock Data의 섭씨 원본과 분리한다.
 * 카드의 상세 의도는 cityId 동적 route 이동으로 연결하며 외부 API는 아직 사용하지 않는다.
 */
const router = useRouter()
// 최상위 Pinia 컨텍스트에서 UnitToggler와 상세 View가 사용하는 동일 Store에 접근한다.
const configStore = useConfigStore()
const searchQuery = ref('')
const selectedCityInfo = ref(null)

// 검색어를 정규화한 뒤 도시명의 부분 문자열을 찾고, 빈 검색어이면 원본 목록 전체를 반환한다.
// filter가 새 배열을 만들므로 공유 Mock Data는 직접 변경하지 않는다.
const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return weatherList
  }

  return weatherList.filter((weather) => weather.name.toLowerCase().includes(normalizedQuery))
})

// 선택 상태바도 카드와 같은 단위 정책을 따르도록 섭씨 원본에서 표시값만 계산한다.
const selectedTemperature = computed(() => {
  if (!selectedCityInfo.value) {
    return null
  }

  return convertTemperature(selectedCityInfo.value.temp, configStore.unit)
})

const updateSearchQuery = (value) => {
  // SearchBar가 emit한 문자열의 원본 상태는 부모가 소유한다.
  searchQuery.value = value
}

const selectCity = (weather) => {
  // WeatherCard가 payload로 보낸 도시 객체를 선택 상태바의 기준으로 보관한다.
  selectedCityInfo.value = weather
}

const showDetail = (weather) => {
  // 자식은 Router를 알지 않고, 부모가 고유 id를 동적 route param으로 전달한다.
  router.push({
    name: 'fifth-weather-detail',
    params: {
      cityId: weather.id,
    },
  })
}

watch(selectedCityInfo, (newCity, oldCity) => {
  // immediate 옵션이 없으므로 최초 마운트가 아니라 실제 선택 변경부터 이전·현재 값을 비교한다.
  console.log('[watch] 선택 도시 변경')
  console.log(`이전 도시: ${oldCity?.name ?? '선택 없음'}`)
  console.log(`현재 도시: ${newCity?.name ?? '선택 없음'}`)
})

watchEffect(() => {
  // 최초 한 번 실행된 뒤 읽은 검색어와 computed 결과를 자동 추적해 검색 상태를 기록한다.
  const query = searchQuery.value.trim()
  const resultNames = filteredWeatherList.value.map((weather) => weather.name)

  console.log('[watchEffect] 검색 상태')
  console.log(`검색어: ${query || '입력 없음'}`)
  console.log(`검색 결과: ${resultNames.length ? resultNames.join(', ') : '검색 결과 없음'}`)
})
</script>

<template>
  <div class="weather-mockup">
    <!-- 공통 외곽의 기본 slot에 검색 기능을 조합한다. -->
    <BaseDashboardCard>
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard aria-labelledby="fifth-weather-list-title">
      <h2 id="fifth-weather-list-title">🏙️ 지역별 날씨 현황</h2>

      <div v-if="filteredWeatherList.length" class="weather-grid">
        <!-- 도시 id를 안정적인 key로 쓰고 Store의 단위와 기호를 각 카드에 내려준다. -->
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          :unit="configStore.unit"
          :unit-symbol="configStore.unitSymbol"
          @select-card="selectCity"
          @click-detail="showDetail"
        />
      </div>

      <!-- computed 결과가 비었을 때만 카드 목록 대신 검색 결과 없음 상태를 표시한다. -->
      <p v-else class="empty-state">검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="selection-status" role="status" aria-live="polite">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다. 현재 기온은 ${selectedTemperature}${configStore.unitSymbol}이고 날씨는 ${selectedCityInfo.status}입니다.`
          : '검색 후 원하는 날씨 카드를 선택해 보세요.'
      }}
    </div>
  </div>
</template>

<style scoped>
.weather-mockup {
  display: grid;
  gap: 10px;
  min-width: 0;
}

h2 {
  margin: 0 0 8px;
  color: #1e293b;
  font-size: 0.9rem;
}

.weather-grid {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.empty-state {
  margin: 0;
  padding: 12px;
  border-radius: 5px;
  color: #64748b;
  background: #f8fafc;
  font-size: 0.78rem;
  text-align: center;
}

.selection-status {
  margin: 0;
  padding: 9px 10px;
  border: 1px solid #bbf7d0;
  border-radius: 5px;
  color: #166534;
  background: #f0fdf4;
  font-size: 0.76rem;
}
</style>
