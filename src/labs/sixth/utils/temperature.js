/**
 * API 또는 fallback의 섭씨 원본을 현재 표시 단위의 숫자로 변환한다.
 * 원본 객체와 Store를 변경하지 않아 단위 전환을 반복해도 원본값을 보존한다.
 */
export const convertTemperature = (celsius, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32)
  }

  return celsius
}
