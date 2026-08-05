<script setup>
import { computed } from 'vue'
import { convertTemperature } from '../../utils/temperature.js'

/**
 * API와 fallback이 공유하는 내부 weather model을 받아 같은 카드 표현에 사용한다.
 * 섭씨 원본은 보존한 채 단위별 표시값만 계산하고 선택·상세 의도는 부모에 emit한다.
 */
const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  unitSymbol: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

// 단위 prop이 바뀌면 표시값만 다시 계산하며 더움·선선함은 원본 섭씨 25도를 기준으로 한다.
const displayTemperature = computed(() => convertTemperature(props.weather.temp, props.unit))

const selectCard = () => {
  emit('select-card', props.weather)
}

const clickDetail = () => {
  emit('click-detail', props.weather)
}
</script>

<template>
  <!-- 카드 클릭과 Enter는 같은 선택 이벤트를 내보내 포인터와 키보드 입력을 함께 지원한다. -->
  <article class="weather-card" tabindex="0" @click="selectCard" @keydown.enter="selectCard">
    <div class="weather-card__info">
      <h3>{{ props.weather.name }} ({{ props.weather.status }})</h3>
      <p class="weather-card__temperature">
        현재 기온: {{ displayTemperature }}{{ props.unitSymbol }}
      </p>
      <span v-if="props.weather.temp >= 25" class="temperature-label hot">
        🔥 더움 (25도 이상)
      </span>
      <span v-else class="temperature-label cool"> ❄️ 선선함 (25도 미만) </span>
    </div>
    <!-- 상세 입력의 전파를 막아 카드 선택과 route 이동 의도가 한 번에 겹치지 않게 한다. -->
    <button type="button" @click.stop="clickDetail" @keydown.enter.stop>상세보기</button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid #dbe4ef;
  border-radius: 5px;
  background: #f8fafc;
  cursor: pointer;
}

.weather-card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.weather-card__info {
  min-width: 0;
}

h3,
p {
  margin: 0;
}

h3 {
  color: #1e293b;
  font-size: 0.88rem;
}

.weather-card__temperature {
  margin-top: 3px;
  color: #475569;
  font-size: 0.78rem;
}

.temperature-label {
  display: inline-block;
  margin-top: 5px;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.68rem;
  font-weight: 700;
}

.hot {
  color: #fff;
  background: #ff6b6b;
}

.cool {
  color: #fff;
  background: #38bdf8;
}

button {
  flex: 0 0 auto;
  padding: 5px 8px;
  border: 1px solid #9ca3af;
  border-radius: 2px;
  color: #374151;
  background: #fff;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

button:hover {
  background: #f3f4f6;
}

button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

@media (max-width: 340px) {
  .weather-card {
    flex-wrap: wrap;
  }
}
</style>
