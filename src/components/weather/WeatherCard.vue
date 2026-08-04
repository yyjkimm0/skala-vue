<script setup>
import { computed } from 'vue'
import { convertTemperature } from '../../utils/temperature.js'

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

const displayTemperature = computed(() =>
  convertTemperature(props.weather.temp, props.unit),
)
</script>

<template>
  <article
    class="weather-card"
    tabindex="0"
    @click="emit('select-card', props.weather)"
    @keydown.enter="emit('select-card', props.weather)"
  >
    <div class="weather-card__info">
      <h3>{{ props.weather.name }} <span>({{ props.weather.status }})</span></h3>
      <p class="temperature">현재 기온: {{ displayTemperature }}{{ props.unitSymbol }}</p>
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
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #d6e0ed;
  border-radius: 5px;
  background: #ffffff;
  box-shadow: 0 2px 7px rgb(35 61 89 / 7%);
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
  font-size: 0.95rem;
}

.weather-card h3 span {
  color: #526276;
  font-size: 0.78rem;
  font-weight: 500;
}

.temperature {
  margin: 4px 0 0;
  color: #163a63;
  font-size: 0.8rem;
  font-weight: 700;
}

.temperature-label {
  display: inline-block;
  margin: 5px 0 0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
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
  padding: 5px 8px;
  border: 1px solid #9ca3af;
  border-radius: 3px;
  color: #374151;
  background: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.weather-card button:hover {
  background: #f3f4f6;
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
