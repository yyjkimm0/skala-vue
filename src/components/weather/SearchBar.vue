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
