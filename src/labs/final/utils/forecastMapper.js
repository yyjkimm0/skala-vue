/**
 * eighth의 3시간 예보 모델에 OpenWeather 아이콘 코드를 포함한다.
 * 상세 View는 이 값으로 아이콘을 요청하며 원본 날씨 문구는 대체 표시에도 함께 사용한다.
 */
export const mapForecastResponse = (responseData, cityConfig) => {
  const forecastList = responseData?.list ?? []
  const timezoneOffset = responseData?.city?.timezone ?? 0

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
    const {
      dt,
      dt_txt: dateTime,
      main: { temp, feels_like: feelsLike, humidity },
      weather: [condition],
      wind: { speed: windSpeed },
      pop,
    } = normalizedItem
    const status = condition?.description ?? '정보 없음'
    // 아이콘 필드가 없는 응답은 빈 문자열로 두어 상세 View가 텍스트 fallback을 선택하게 한다.
    const icon = condition?.icon ?? ''
    const precipitationProbability = pop ?? 0
    const id = `${cityConfig.id}-${dateTime ?? dt}`
    const cityId = cityConfig.id
    const cityName = cityConfig.name
    const localIsoString = Number.isFinite(dt)
      ? new Date((dt + timezoneOffset) * 1000).toISOString()
      : ''
    const [localDate = '', localTime = ''] = localIsoString.split('T')
    const [localHourText = ''] = localTime.split(':')
    const localHour = Number.parseInt(localHourText, 10)
    const localDateTime =
      localDate && localTime ? `${localDate} ${localTime.slice(0, 5)}` : undefined

    return {
      id,
      cityId,
      cityName,
      dateTime,
      timestamp: dt,
      temp,
      feelsLike,
      status,
      icon,
      humidity,
      windSpeed,
      precipitationProbability,
      localDate,
      localHour,
      localDateTime,
    }
  })
}
