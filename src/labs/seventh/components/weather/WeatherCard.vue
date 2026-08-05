<script setup>
import { computed } from 'vue'
import { ElButton, ElTag } from 'element-plus'
import { convertTemperature } from '../../utils/temperature.js'

/**
 * API와 fallback이 공유하는 내부 모델을 기존 article 선택 흐름과 동일하게 표시한다.
 * ElTag와 ElButton은 상태와 행동을 표현하고, 선택과 상세 의도는 각각 부모에 전달한다.
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

const displayTemperature = computed(() => convertTemperature(props.weather.temp, props.unit))

// 하나의 Tag 인스턴스에서 원본 섭씨 기준에 따라 색상과 문구만 바꿔 상태 위치를 유지한다.
const isHot = computed(() => props.weather.temp >= 25)

const selectCard = () => {
  emit('select-card', props.weather)
}

const clickDetail = () => {
  emit('click-detail', props.weather)
}
</script>

<template>
  <!-- 포인터 클릭과 Enter가 같은 선택 이벤트를 사용하며 실제 선택 상태는 부모가 소유한다. -->
  <article class="weather-card" tabindex="0" @click="selectCard" @keydown.enter="selectCard">
    <div class="weather-card__info">
      <h3>{{ props.weather.name }} ({{ props.weather.status }})</h3>
      <p class="weather-card__temperature">
        현재 기온: {{ displayTemperature }}{{ props.unitSymbol }}
      </p>
      <div class="temperature-tag-slot">
        <ElTag
          class="temperature-tag"
          :type="isHot ? 'danger' : 'primary'"
          size="small"
          effect="light"
        >
          {{ isHot ? '🔥 더움 (25도 이상)' : '❄️ 선선함 (25도 미만)' }}
        </ElTag>
      </div>
    </div>
    <!-- 상세 버튼 입력이 article의 카드 선택 이벤트로 전파되지 않도록 기존 책임을 분리한다. -->
    <ElButton
      class="weather-card__detail"
      size="small"
      plain
      @click.stop="clickDetail"
      @keydown.enter.stop
    >
      상세보기
    </ElButton>
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
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  text-align: left;
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

.temperature-tag-slot {
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 24px;
  margin-top: 5px;
  text-align: left;
}

.temperature-tag {
  flex: 0 0 auto;
  margin-right: auto;
}

.weather-card__detail {
  flex: 0 0 auto;
  margin: 0;
}

@media (max-width: 340px) {
  .weather-card {
    flex-wrap: wrap;
  }
}
</style>
