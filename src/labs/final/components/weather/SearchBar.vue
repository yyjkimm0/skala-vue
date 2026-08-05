<script setup>
import { ElInput } from 'element-plus'

/**
 * ElInput은 부모가 소유한 검색어를 표시하고 model update·clear 값을 같은 emit으로 전달한다.
 * Router·Store·API를 모르며 검색 상태나 전달받은 prop을 직접 변경하지 않는다.
 */
const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

// model과 native 입력 경로가 같은 값을 연속 전달하면 현재 prop과 비교해 중복 emit을 생략한다.
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

  // capture 단계에서 실제 input 값을 읽어 한글 조합 중 화면에 보이는 문자열도 부모에 반영한다.
  if (target instanceof HTMLInputElement) {
    emitQuery(target.value)
  }
}
</script>

<template>
  <div class="search-bar">
    <label for="final-city-search">🔍 도시 검색</label>
    <div class="search-input-wrapper" @input.capture="handleNativeInput">
      <ElInput
        id="final-city-search"
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
