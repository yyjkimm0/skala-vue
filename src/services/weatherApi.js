import axios from 'axios'

const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
})

export const fetchCurrentWeather = async (cityName) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error('OpenWeather API Key가 설정되지 않았습니다.')
  }

  const response = await openWeatherApi.get('/weather', {
    params: {
      q: `${cityName},KR`,
      units: 'metric',
      lang: 'kr',
      appid: apiKey,
    },
  })

  return response.data
}
