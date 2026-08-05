/**
 * 섭씨 원본값을 요청한 화면 표시 단위로 변환한다.
 * 변환 결과를 상태에 저장하지 않아 반복 전환에도 원본 섭씨값을 보존한다.
 */
export const convertTemperature = (celsius, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32)
  }

  return celsius
}
