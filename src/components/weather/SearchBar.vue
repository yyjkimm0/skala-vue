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
  <label for="city-search">도시 검색어</label>
  <input
    id="city-search"
    :value="props.searchQuery"
    type="text"
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
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
}

input {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #a9b9cc;
  border-radius: 8px;
}

input:focus {
  border-color: #2563eb;
  outline: 3px solid #dbeafe;
}

.input-status {
  margin: 12px 0 0;
  color: #526276;
}
</style>
