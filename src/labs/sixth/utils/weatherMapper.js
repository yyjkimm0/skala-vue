export const mapOpenWeatherToWeather = (openWeatherData, city) => ({
  id: city.id,
  name: city.name,
  temp: openWeatherData.main.temp,
  status: openWeatherData.weather[0].description,
  humidity: openWeatherData.main.humidity,
  windSpeed: openWeatherData.wind.speed,
})
