<script setup>
/**
 * API 출처와 무관한 내부 모델의 도시명을 검색하도록 부모 검색어를 prop으로 표시한다.
 * 입력 문자열만 emit하며 Router, Store, 서버 상태를 알거나 prop을 직접 변경하지 않는다.
 */
const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const handleInput = (event) => {
  // 검색 원본 상태는 이 이벤트를 받는 Home 부모가 소유한다.
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <label for="sixth-city-search">🔍 도시 검색</label>
    <input
      id="sixth-city-search"
      type="text"
      :value="props.searchQuery"
      placeholder="도시명을 입력하세요"
      @input="handleInput"
    />
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

input {
  width: 100%;
  min-width: 0;
  padding: 8px 9px;
  border: 1px solid #cbd5e1;
  border-radius: 5px;
  box-sizing: border-box;
  font: inherit;
}

input:focus {
  border-color: #2563eb;
  outline: 3px solid #dbeafe;
}

.input-status {
  margin: 0;
  color: #64748b;
  font-size: 0.75rem;
}
</style>
