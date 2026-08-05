<script setup>
import { computed } from 'vue'
import { ElButton, ElTag } from 'element-plus'
import { convertTemperature } from '../../utils/temperature.js'

/**
 * Current Weather API와 fallback이 공유하는 내부 모델을 현재 날씨 카드로 표시한다.
 * ElTag·ElButton은 상태와 행동만 표현하며 선택과 상세 의도는 부모에 각각 emit한다.
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

// 단위별 표시값만 계산하고 Tag 상태는 변환과 무관하게 원본 섭씨 25도를 기준으로 한다.
const displayTemperature = computed(() => convertTemperature(props.weather.temp, props.unit))

const selectCard = () => {
  emit('select-card', props.weather)
}

const clickDetail = () => {
  emit('click-detail', props.weather)
}
</script>

<template>
  <!-- 카드 클릭과 Enter가 같은 선택 이벤트를 사용하고 실제 선택 상태는 부모가 소유한다. -->
  <article class="weather-card" tabindex="0" @click="selectCard" @keydown.enter="selectCard">
    <div class="weather-card__info">
      <h3>{{ props.weather.name }} ({{ props.weather.status }})</h3>
      <p class="weather-card__temperature">
        현재 기온: {{ displayTemperature }}{{ props.unitSymbol }}
      </p>
      <!-- [feature] 표시 단위와 무관하게 원본 섭씨 25℃의 초과·동일·미만을 구분한다. -->
      <div class="temperature-tag-slot">
        <ElTag
          v-if="props.weather.temp > 25"
          class="temperature-tag"
          type="danger"
          size="small"
          effect="light"
        >
          🔥 더움 (25도 초과)
        </ElTag>
        <ElTag
          v-else-if="props.weather.temp === 25"
          class="temperature-tag"
          type="warning"
          size="small"
          effect="light"
        >
          🌤️ 보통 (25도)
        </ElTag>
        <ElTag v-else class="temperature-tag" type="success" size="small" effect="light">
          ❄️ 선선함 (25도 미만)
        </ElTag>
      </div>
    </div>
    <!-- [refactor] 부모가 weather와 기존 상세 emit 함수로 카드별 액션 UI를 구성하게 한다. -->
    <div class="weather-card__detail">
      <slot name="actions" :weather="props.weather" :open-detail="clickDetail">
        <!-- click.stop으로 상세 이동과 article 선택이 한 입력에서 함께 실행되지 않게 한다. -->
        <ElButton size="small" plain @click.stop="clickDetail" @keydown.enter.stop>
          상세보기
        </ElButton>
      </slot>
    </div>
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
