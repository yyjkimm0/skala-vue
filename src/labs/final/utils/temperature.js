/**
 * Current Weather와 Forecast의 섭씨 원본을 final Store 단위의 표시 숫자로 변환한다.
 * 원본 모델과 Store를 변경하지 않아 단위 전환에도 API 재요청이나 값 손실이 없다.
 */
export const convertTemperature = (celsius, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32)
  }

  return celsius
}
