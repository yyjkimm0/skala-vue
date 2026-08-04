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
    <select :value="modelValue" @change="handleChange">
      <option v-for="lab in labs" :key="lab.id" :value="lab.id">
        {{ lab.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.lab-selector {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}

.lab-selector select {
  width: auto;
  min-width: 112px;
  max-width: 140px;
  padding: 6px 8px;
  border: 1px solid #9ca3af;
  border-radius: 4px;
  color: #1f2937;
  background: #ffffff;
  font: inherit;
}

@media (max-width: 460px) {
  .lab-selector__label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}

@media (max-width: 340px) {
  .lab-selector select {
    width: 100%;
    max-width: none;
  }
}
</style>
