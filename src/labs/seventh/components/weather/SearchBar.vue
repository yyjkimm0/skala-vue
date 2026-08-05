<script setup>
import { ElInput } from 'element-plus'

const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

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

  if (target instanceof HTMLInputElement) {
    emitQuery(target.value)
  }
}
</script>

<template>
  <div class="search-bar">
    <label for="seventh-city-search">🔍 도시 검색</label>
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
