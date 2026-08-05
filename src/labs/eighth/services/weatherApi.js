import axios from 'axios'
import { findWeatherCityByQueryName } from '../data/weatherCities.js'
import { mapForecastResponse } from '../utils/forecastMapper.js'
import { mapOpenWeatherToWeather } from '../utils/weatherMapper.js'

const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
})

export const fetchCurrentWeather = async (city) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  const cityConfig = typeof city === 'string' ? findWeatherCityByQueryName(city) : city

  if (!apiKey) {
    throw new Error('OpenWeather API Key가 설정되지 않았습니다.')
  }

  if (!cityConfig) {
    throw new Error('지원하지 않는 도시입니다.')
  }

  const response = await openWeatherApi.get('/weather', {
    params: {
      q: cityConfig.query,
      units: 'metric',
      lang: 'kr',
      appid: apiKey,
    },
  })

  return mapOpenWeatherToWeather(response.data, cityConfig)
}

export const fetchWeatherForecast = async (cityConfig) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error('OpenWeather API Key가 설정되지 않았습니다.')
  }

  if (!cityConfig) {
    throw new Error('지원하지 않는 도시입니다.')
  }

  const response = await openWeatherApi.get('/forecast', {
    params: {
      q: cityConfig.query,
      units: 'metric',
      lang: 'kr',
      appid: apiKey,
    },
  })

  return mapForecastResponse(response.data, cityConfig)
}
