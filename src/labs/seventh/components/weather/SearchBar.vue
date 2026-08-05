<script setup>
import { ElInput } from 'element-plus'

/**
 * ElInput으로 검색과 clear UI를 제공하지만 검색어의 실제 소유자는 부모다.
 * Element Plus 이벤트와 native input 모두 문자열만 같은 emit 흐름으로 전달한다.
 */
const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

// 두 입력 경로가 같은 값을 연속 전달할 수 있어 현재 prop과 같으면 중복 emit을 생략한다.
const emitQuery = (value) => {
  if (typeof value !== 'string' || value === props.searchQuery) {
    return
  }

  emit('update-query', value)
}

const handleModelValueUpdate = (value) => {
  emitQuery(value)
}

const handleNativeInput = (event) => {
  const target = event.target

  // 한글 조합 중에도 내부 input에 실제로 표시된 현재 문자열을 capture 단계에서 부모로 전달한다.
  if (target instanceof HTMLInputElement) {
    emitQuery(target.value)
  }
}
</script>

<template>
  <div class="search-bar">
    <label for="seventh-city-search">🔍 도시 검색</label>
    <!-- wrapper는 ElInput 내부 native input 이벤트를 받아 IME 조합 중인 값도 검색 상태와 동기화한다. -->
    <div class="search-input-wrapper" @input.capture="handleNativeInput">
      <ElInput
        id="seventh-city-search"
        class="search-input"
        :model-value="props.searchQuery"
        placeholder="도시명을 입력하세요"
        clearable
        @update:model-value="handleModelValueUpdate"
      />
    </div>
    <p class="input-status">
      {{
        props.searchQuery.trim()
          ? `검색 중인 도시: ${props.searchQuery.trim()}`
          : '검색어를 입력하지 않았습니다.'
      }}
    </p>
  </div>
</template>

<style scoped>
.search-bar {
  display: grid;
  gap: 7px;
}

label {
  display: block;
  color: #334155;
  font-size: 0.88rem;
  font-weight: 700;
}

.search-input-wrapper,
.search-input {
  width: 100%;
  min-width: 0;
}

.input-status {
  margin: 0;
  color: #64748b;
  font-size: 0.75rem;
}
</style>
