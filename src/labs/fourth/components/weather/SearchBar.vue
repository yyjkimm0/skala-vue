<script setup>
/**
 * 부모가 소유한 검색어를 읽기 전용 prop으로 표시하고 native input의 새 값을 이벤트로 돌려준다.
 * Router 도입 후에도 임시 검색 상태는 이 자식이 직접 수정하거나 소유하지 않는다.
 */
const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const handleInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <label for="fourth-city-search">🔍 도시 검색</label>
    <input
      id="fourth-city-search"
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
/* 검색 입력과 현재 검색어 안내 스타일은 이 컴포넌트 내부에만 적용한다. */
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
