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

/**
 * 선택 도시의 5일 범위·3시간 간격 Forecast를 별도 endpoint에서 요청한다.
 * 전체 응답은 mapper에서 도시 현지 시간 기반 내부 예보 배열로 바꿔 반환하며 오류는 호출자에게 전달한다.
 */
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

  // Current Weather의 한 시점 객체와 달리 Forecast는 여러 시점의 내부 모델 배열을 반환한다.
  return mapForecastResponse(response.data, cityConfig)
}
