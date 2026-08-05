<template>
  <section class="forecast-view">
    <h2>단기 예보</h2>
    <p>선택한 도시의 5일 단기 예보를 확인할 수 있습니다.</p>
    <p class="forecast-view__status">
      예보 데이터 연동 준비 중입니다.
    </p>
  </section>
</template>

<style scoped>
.forecast-view {
  padding: 14px;
  border: 1px solid #d6e0ed;
  border-radius: 6px;
  background: #fff;
}

h2,
p {
  margin-top: 0;
}

h2 {
  color: #163a63;
  font-size: 1rem;
}

p {
  font-size: 0.78rem;
  line-height: 1.6;
}

.forecast-view__status {
  margin-bottom: 0;
  color: #64748b;
}
</style>
