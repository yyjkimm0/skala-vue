import axios from 'axios'
import { findWeatherCityByQueryName } from '../data/weatherCities.js'
import { mapForecastResponse } from '../utils/forecastMapper.js'
import { mapOpenWeatherToWeather } from '../utils/weatherMapper.js'
import { getCachedWeatherForecast } from './forecastCache.js'

/** Current Weather와 Forecast가 공유하는 OpenWeather base URL을 한 Axios instance에 둔다. */
const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
})

/**
 * 한 도시의 /weather 응답을 현재 상태 객체로 변환해 Home·Detail·API Test에 반환한다.
 * Key·도시·Axios 오류는 호출자에게 전달해 화면이 fallback 또는 error를 결정하게 한다.
 */
export const fetchCurrentWeather = async (city) => {
  // Vite 환경변수는 하드코딩을 피하지만 브라우저 번들에 포함돼 완전한 비밀 저장소는 아니다.
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

  // 단일 현재 날씨 응답은 Forecast 배열과 다른 mapper 책임으로 평탄화한다.
  return mapOpenWeatherToWeather(response.data, cityConfig)
}

/**
 * /forecast 전체 응답을 도시 현지 시간 기반 3시간 내부 모델 배열로 변환한다.
 * 목록과 상세 View는 같은 공개 함수를 사용하고 오류 상태 판단은 각 호출자에게 맡긴다.
 */
const fetchWeatherForecastFromApi = async (cityConfig) => {
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

export const fetchWeatherForecast = (cityConfig) =>
  getCachedWeatherForecast(cityConfig, fetchWeatherForecastFromApi)
