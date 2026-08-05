<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import LabSelector from './components/LabSelector.vue'
import { labs } from './labs/index.js'
import './assets/app-shell.css'

const route = useRoute()
const router = useRouter()

const currentLabId = computed(() => route.meta.labId ?? 'sixth')
const currentLab = computed(() => labs.find((lab) => lab.id === currentLabId.value) ?? labs[5])

const changeLab = async (labId) => {
  const lab = labs.find((item) => item.id === labId)

  if (lab) {
    await router.push(lab.path)
  }
}
</script>

<template>
  <main class="app-container">
    <section class="lab-frame">
      <header class="lab-header">
        <h1>⛅ {{ currentLab.title }}</h1>
        <LabSelector :labs="labs" :model-value="currentLabId" @update:model-value="changeLab" />
      </header>

      <div class="lab-content">
        <RouterView />
      </div>
    </section>
  </main>
</template>
