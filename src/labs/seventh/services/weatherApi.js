import axios from 'axios'
import { findWeatherCityByQueryName } from '../data/weatherCities.js'
import { mapOpenWeatherToWeather } from '../utils/weatherMapper.js'

/** Current Weather 요청의 공통 base URL을 관리하고 endpoint와 params는 요청 함수에 맡긴다. */
const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
})

/**
 * 도시 설정을 받아 metric·한국어 Current Weather를 요청하고 내부 weather model을 반환한다.
 * Key와 도시 검증 및 Axios 오류는 숨기지 않아 호출 View가 fallback 또는 error를 결정한다.
 */
export const fetchCurrentWeather = async (city) => {
  // Vite 환경변수는 하드코딩을 피하지만 브라우저 번들에 포함되므로 완전한 비밀 저장소는 아니다.
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

  // 외부 중첩 응답을 표현 컴포넌트에 노출하지 않고 mapper를 거친 모델만 전달한다.
  return mapOpenWeatherToWeather(response.data, cityConfig)
}
