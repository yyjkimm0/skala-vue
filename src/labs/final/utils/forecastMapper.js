/**
 * Forecast list를 도시 현지 날짜·시간과 날씨 필드를 가진 3시간 내부 모델 배열로 변환한다.
 * 목록은 날짜 대표값 계산에, 상세는 시간순 카드에 같은 모델과 OpenWeather icon을 사용한다.
 * 원본 응답과 View·Store 상태는 변경하지 않는 순수 변환이다.
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
    // UTC timestamp와 API timezone offset을 결합해 사용자 PC와 무관한 도시 현지 시각을 만든다.
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
