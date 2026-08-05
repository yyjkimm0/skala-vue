/**
 * OpenWeather의 중첩 응답에서 필요한 값만 꺼내 카드와 상세 화면의 공통 모델로 변환한다.
 * metric 요청의 섭씨 원본을 유지하며 화면 상태나 Store를 변경하지 않는 순수 변환 함수다.
 */
export const mapOpenWeatherToWeather = (openWeatherData, city) => ({
  id: city.id,
  name: city.name,
  temp: openWeatherData.main.temp,
  status: openWeatherData.weather[0].description,
  humidity: openWeatherData.main.humidity,
  windSpeed: openWeatherData.wind.speed,
})
