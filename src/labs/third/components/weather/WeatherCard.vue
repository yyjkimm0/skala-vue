<script setup>
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
  <article
    class="weather-card"
    tabindex="0"
    @click="selectCard"
    @keydown.enter="selectCard"
  >
    <div class="weather-card__info">
      <h3>{{ props.weather.name }} ({{ props.weather.status }})</h3>
      <p class="weather-card__temperature">현재 기온: {{ props.weather.temp }}℃</p>
      <span
        v-if="props.weather.temp >= 25"
        class="temperature-label hot"
      >
        🔥 더움 (25도 이상)
      </span>
      <span
        v-else
        class="temperature-label cool"
      >
        ❄️ 선선함 (25도 미만)
      </span>
    </div>

    <button
      type="button"
      @click.stop="clickDetail"
      @keydown.enter.stop
    >
      상세보기
    </button>
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
