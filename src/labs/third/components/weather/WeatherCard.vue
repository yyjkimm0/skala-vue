<script setup>
/**
 * 날씨 객체 한 건을 표시하고 선택과 상세보기 의도를 서로 다른 이벤트로 전달한다.
 * 부모 상태를 직접 변경하거나 alert 같은 후속 동작을 결정하지 않는다.
 */
// 부모가 소유한 카드 표시 데이터를 읽기 전용 입력으로 받는다.
const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
})

// 사용자의 두 행동을 구분해 부모가 각각의 상태 변경과 후속 동작을 처리하게 한다.
const emit = defineEmits(['select-card', 'click-detail'])

const selectCard = () => {
  emit('select-card', props.weather)
}

const clickDetail = () => {
  emit('click-detail', props.weather)
}
</script>

<template>
  <!-- 카드 전체는 클릭과 Enter로 선택하며, 상세 버튼은 이벤트 전파를 막아 별도로 동작한다. -->
  <article class="weather-card" tabindex="0" @click="selectCard" @keydown.enter="selectCard">
    <div class="weather-card__info">
      <h3>{{ props.weather.name }} ({{ props.weather.status }})</h3>
      <p class="weather-card__temperature">현재 기온: {{ props.weather.temp }}℃</p>
      <span v-if="props.weather.temp >= 25" class="temperature-label hot">
        🔥 더움 (25도 이상)
      </span>
      <span v-else class="temperature-label cool"> ❄️ 선선함 (25도 미만) </span>
    </div>

    <button type="button" @click.stop="clickDetail" @keydown.enter.stop>상세보기</button>
  </article>
</template>

<style scoped>
/* 개별 카드의 표시와 상호작용 스타일은 다른 컴포넌트로 퍼지지 않는다. */
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
