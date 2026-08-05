<script setup>
/**
 * 날씨 객체 한 건을 표시하고 카드 선택과 상세 route 이동 의도를 서로 다른 이벤트로 전달한다.
 * 자식은 부모 상태와 실제 route 구성을 알지 않고 사용자 행동만 payload와 함께 알린다.
 */
const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const selectCard = () => {
  emit('select-card', props.weather)
}

const clickDetail = () => {
  emit('click-detail', props.weather)
}
</script>

<template>
  <!-- 카드는 route를 알지 않고 상세 의도만 전달하며, click.stop으로 선택과 이동을 분리한다. -->
  <article class="weather-card" tabindex="0" @click="selectCard" @keydown.enter="selectCard">
    <div class="weather-card__info">
      <h3>{{ props.weather.name }} ({{ props.weather.status }})</h3>
      <p class="weather-card__temperature">현재 기온: {{ props.weather.temp }}℃</p>
      <!-- 원본 기온은 변경하지 않고 25도 기준으로 카드의 상태 문구만 선택한다. -->
      <span v-if="props.weather.temp >= 25" class="temperature-label hot">
        🔥 더움 (25도 이상)
      </span>
      <span v-else class="temperature-label cool"> ❄️ 선선함 (25도 미만) </span>
    </div>

    <button type="button" @click.stop="clickDetail" @keydown.enter.stop>상세보기</button>
  </article>
</template>

<style scoped>
/* 개별 카드의 표시·초점·상호작용 스타일은 이 컴포넌트 범위에 한정한다. */
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
