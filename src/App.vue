<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import LabSelector from './components/LabSelector.vue'
import { labs } from './labs/index.js'
import './assets/app-shell.css'

/**
 * 모든 lab에 공통으로 적용되는 제목과 선택 메뉴를 구성한다.
 * 실제 과제 화면은 현재 route에 맞춰 RouterView에서 렌더링된다.
 */
const route = useRoute()
const router = useRouter()

// 부모 route의 meta와 labs metadata를 연결해 URL, 제목, selector의 기준을 하나로 유지한다.
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
