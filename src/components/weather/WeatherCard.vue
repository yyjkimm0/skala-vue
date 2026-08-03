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
    <h3>{{ props.weather.name }}</h3>
    <p class="temperature">{{ props.weather.temp }}℃</p>
    <p>날씨 상태: {{ props.weather.status }}</p>
    <p v-if="props.weather.temp >= 25" class="temperature-label hot">
      🔥 더움 (25도 이상)
    </p>
    <p v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</p>
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
  padding: 22px;
  border: 1px solid #d6e0ed;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgb(35 61 89 / 8%);
  cursor: pointer;
}

.weather-card:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.weather-card h3 {
  margin: 0;
  font-size: 1.35rem;
}

.temperature {
  margin: 14px 0 8px;
  color: #163a63;
  font-size: 2rem;
  font-weight: 800;
}

.temperature-label {
  font-weight: 700;
}

.hot {
  color: #c2410c;
}

.cool {
  color: #2563eb;
}

.weather-card button {
  width: 100%;
  margin-top: 8px;
  padding: 10px 14px;
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
</style>
