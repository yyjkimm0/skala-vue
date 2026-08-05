<script setup>
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
    <label for="seventh-city-search">🔍 도시 검색</label>
    <input
      id="seventh-city-search"
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
