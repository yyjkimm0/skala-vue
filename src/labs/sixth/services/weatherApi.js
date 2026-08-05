import axios from 'axios'
import { findWeatherCityByQueryName } from '../data/weatherCities.js'
import { mapOpenWeatherToWeather } from '../utils/weatherMapper.js'

/**
 * OpenWeather 현재 날씨 요청에 공통으로 사용할 base URL을 한 곳에서 관리한다.
 * endpoint와 도시별 query parameter는 실제 요청 함수가 구성한다.
 */
const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
})

/**
 * 도시 설정을 받아 현재 날씨를 요청한 뒤 화면 공통 모델로 변환해 반환한다.
 * Current Weather endpoint에 도시 query, metric 단위, 한국어 응답 설정과 API Key를 전달한다.
 * 요청이나 설정 검증 오류는 숨기지 않고 호출자에게 전달해 fallback 여부를 결정하게 한다.
 */
export const fetchCurrentWeather = async (city) => {
  // API Key는 소스에 직접 작성하지 않고 Vite의 VITE_ 환경변수에서 읽는다.
  // 클라이언트 번들에 포함되는 값이므로 서버 비밀키처럼 완전히 보호되지는 않는다.
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  const cityConfig = typeof city === 'string' ? findWeatherCityByQueryName(city) : city

  // 키가 없으면 불완전한 네트워크 요청을 보내지 않고 호출자가 처리할 오류를 만든다.
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

  // 외부 응답 구조를 컴포넌트에 노출하지 않고 내부 weather model만 반환한다.
  return mapOpenWeatherToWeather(response.data, cityConfig)
}
