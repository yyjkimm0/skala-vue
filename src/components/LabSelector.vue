<script setup>
defineProps({
  labs: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <label class="lab-selector">
    <span class="lab-selector__label">과제 선택</span>
    <select :value="modelValue" @change="handleChange">
      <option v-for="lab in labs" :key="lab.id" :value="lab.id">
        {{ lab.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.lab-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
}

.lab-selector select {
  padding: 6px 8px;
  border: 1px solid #9ca3af;
  border-radius: 4px;
  color: #1f2937;
  background: #ffffff;
  font: inherit;
}
</style>
