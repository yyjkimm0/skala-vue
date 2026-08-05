/**
 * 단일 Current Weather 응답을 카드와 현재 날씨 상세용 평탄한 내부 객체로 변환한다.
 * 여러 3시간 시점을 만드는 forecastMapper와 분리되며 metric 응답의 섭씨 원본을 유지한다.
 */
export const mapOpenWeatherToWeather = (openWeatherData, city) => ({
  id: city.id,
  name: city.name,
  temp: openWeatherData.main.temp,
  status: openWeatherData.weather[0].description,
  humidity: openWeatherData.main.humidity,
  windSpeed: openWeatherData.wind.speed,
})
