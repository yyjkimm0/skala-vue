/**
 * OpenWeather 중첩 응답을 카드와 상세 화면이 공유하는 평탄한 내부 모델로 변환한다.
 * metric 응답의 섭씨 원본을 유지하며 Store나 화면 상태를 변경하지 않는 순수 함수다.
 */
export const mapOpenWeatherToWeather = (openWeatherData, city) => ({
  id: city.id,
  name: city.name,
  temp: openWeatherData.main.temp,
  status: openWeatherData.weather[0].description,
  humidity: openWeatherData.main.humidity,
  windSpeed: openWeatherData.wind.speed,
})
