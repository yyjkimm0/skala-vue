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
      humidity,
      windSpeed,
      precipitationProbability,
      localDate,
      localHour,
      localDateTime,
    }
  })
}
