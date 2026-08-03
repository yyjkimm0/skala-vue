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
  <h2>🔍 도시 검색</h2>
  <label for="city-search">도시 이름</label>
  <input
    id="city-search"
    :value="props.searchQuery"
    type="text"
    placeholder="검색할 도시 이름 입력"
    @input="handleInput"
  />
  <p class="input-status">
    {{
      `검색 중인 도시: ${props.searchQuery.trim()}`
    }}
  </p>
</template>

<style scoped>
h2 {
  margin: 0 0 10px;
  font-size: 1rem;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.8rem;
  font-weight: 700;
}

input {
  width: 100%;
  padding: 7px 9px;
  border: 1px solid #a9b9cc;
  border-radius: 4px;
}

input:focus {
  border-color: #2563eb;
  outline: 3px solid #dbeafe;
}

.input-status {
  margin: 7px 0 0;
  color: #526276;
  font-size: 0.8rem;
}
</style>
