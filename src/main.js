import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 하나의 루트 앱에 공통 Pinia와 Router를 등록해 모든 lab이 같은 실행 기반을 사용한다.
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
