<script setup>
/** 부모가 소유한 검색어를 표시하고 새 입력값을 이벤트로 돌려주는 입력 컴포넌트다. */
// prop은 읽기 전용 입력이므로 SearchBar가 직접 바꾸지 않고 부모에 변경 의도를 알린다.
const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

// 부모는 이 이벤트의 payload를 받아 실제 searchQuery 상태를 갱신한다.
const emit = defineEmits(['update-query'])

const handleInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <label for="third-city-search">🔍 도시 검색</label>
    <input
      id="third-city-search"
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
/* 검색 입력과 상태 안내 스타일은 이 컴포넌트 내부에만 한정된다. */
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
