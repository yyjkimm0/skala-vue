/**
 * OpenWeather Forecast의 list를 화면이 사용할 3시간 예보 모델 배열로 변환한다.
 * optional chaining과 nullish coalescing으로 누락 가능한 응답에 안전한 기본 구조를 제공한다.
 */
export const mapForecastResponse = (responseData, cityConfig) => {
  const forecastList = responseData?.list ?? []
  const timezoneOffset = responseData?.city?.timezone ?? 0

  // map은 외부 배열의 각 시점을 독립적인 내부 예보 객체로 바꾸며 원본 응답은 수정하지 않는다.
  return forecastList.map((item) => {
    const safeItem = item ?? {}
    const main = safeItem.main ?? {}
    const weather = safeItem.weather ?? []
    const wind = safeItem.wind ?? {}
    const normalizedItem = {
      dt: safeItem.dt,
      dt_txt: safeItem.dt_txt,
      main,
      weather,
      wind,
      pop: safeItem.pop,
    }
    // 구조 분해로 중첩된 API 필드를 이후 화면 모델에서 사용할 이름으로 한 번에 꺼낸다.
    const {
      dt,
      dt_txt: dateTime,
      main: { temp, feels_like: feelsLike, humidity },
      weather: [condition],
      wind: { speed: windSpeed },
      pop,
    } = normalizedItem
    const status = condition?.description ?? '정보 없음'
    const precipitationProbability = pop ?? 0
    const id = `${cityConfig.id}-${dateTime ?? dt}`
    const cityId = cityConfig.id
    const cityName = cityConfig.name
    // UTC timestamp에 API의 도시별 시차를 더해 브라우저 시간대와 무관한 현지 시각을 만든다.
    const localIsoString = Number.isFinite(dt)
      ? new Date((dt + timezoneOffset) * 1000).toISOString()
      : ''
    const [localDate = '', localTime = ''] = localIsoString.split('T')
    const [localHourText = ''] = localTime.split(':')
    const localHour = Number.parseInt(localHourText, 10)
    const localDateTime =
      localDate && localTime ? `${localDate} ${localTime.slice(0, 5)}` : undefined

    // 화면은 외부의 main.temp나 weather[0] 경로 대신 이 평탄한 공통 모델만 사용한다.
    return {
      id,
      cityId,
      cityName,
      dateTime,
      timestamp: dt,
      temp,
      feelsLike,
      status,
      humidity,
      windSpeed,
      precipitationProbability,
      localDate,
      localHour,
      localDateTime,
    }
  })
}
