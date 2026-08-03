<script setup>
const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article
    class="weather-card"
    tabindex="0"
    @click="emit('select-card', props.weather)"
    @keydown.enter="emit('select-card', props.weather)"
  >
    <div class="weather-card__info">
      <h3>{{ props.weather.name }}</h3>
      <p class="weather-status">날씨 상태: {{ props.weather.status }}</p>
      <p class="temperature">{{ props.weather.temp }}℃</p>
      <p v-if="props.weather.temp >= 25" class="temperature-label hot">
        🔥 더움 (25도 이상)
      </p>
      <p v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</p>
    </div>
    <button
      type="button"
      @click.stop="emit('click-detail', props.weather)"
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
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid #d6e0ed;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgb(35 61 89 / 8%);
  cursor: pointer;
}

.weather-card__info {
  min-width: 0;
}

.weather-card:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.weather-card h3 {
  margin: 0;
  font-size: 1.35rem;
}

.weather-status {
  margin: 4px 0;
}

.temperature {
  margin: 4px 0;
  color: #163a63;
  font-size: 1rem;
  font-weight: 700;
}

.temperature-label {
  display: inline-block;
  margin: 6px 0 0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 700;
}

.hot {
  color: #c2410c;
  background: #ffedd5;
}

.cool {
  color: #2563eb;
  background: #dbeafe;
}

.weather-card button {
  width: auto;
  flex-shrink: 0;
  margin-top: 0;
  padding: 8px 12px;
  border: 0;
  border-radius: 8px;
  color: #ffffff;
  background: #2563eb;
  font-weight: 700;
  cursor: pointer;
}

.weather-card button:hover {
  background: #1d4ed8;
}

.weather-card button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

@media (max-width: 540px) {
  .weather-card {
    align-items: stretch;
    flex-direction: column;
  }

  .weather-card button {
    align-self: flex-start;
  }
}
</style>
