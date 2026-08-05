/**
 * Current Weather와 Forecast의 섭씨 원본을 Store 단위에 맞는 표시 숫자로 변환한다.
 * 원본 모델과 Store를 변경하지 않아 반복 전환에도 원본값을 보존한다.
 */
export const convertTemperature = (celsius, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32)
  }

  return celsius
}
