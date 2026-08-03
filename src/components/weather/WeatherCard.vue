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
    <button type="button" @click.stop="emit('click-detail', props.weather)">상세보기</button>
  </article>
</template>
