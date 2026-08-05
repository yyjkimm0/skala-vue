<script setup>
/**
 * 부모가 소유한 검색어를 읽기 전용 prop으로 표시하고 입력값만 이벤트로 돌려준다.
 * Router나 Store를 알지 않으며 검색 상태를 직접 보관하거나 prop을 변경하지 않는다.
 */
const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const handleInput = (event) => {
  // native input의 현재 문자열을 전달하면 부모가 원본 상태를 갱신한다.
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <label for="fifth-city-search">🔍 도시 검색</label>
    <input
      id="fifth-city-search"
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
  font-size: 0.88rem;
  font-weight: 700;
  color: #334155;
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

.input-status {
  margin: 0;
  color: #64748b;
  font-size: 0.75rem;
}

input:focus {
  border-color: #2563eb;
  outline: 3px solid #dbeafe;
}
</style>
