const FORECAST_CACHE_TTL = 10 * 60 * 1000

const forecastCache = new Map()
const inFlightForecastRequests = new Map()

const getForecastCacheKey = (cityConfig) => cityConfig?.id

export const getCachedWeatherForecast = (cityConfig, requestForecast) => {
  const cacheKey = getForecastCacheKey(cityConfig)

  if (!cacheKey) {
    return requestForecast(cityConfig)
  }

  const cachedForecast = forecastCache.get(cacheKey)

  // [tuning] 10분 안에 성공한 같은 도시 Forecast는 목록과 상세 View가 함께 재사용한다.
  if (cachedForecast && Date.now() - cachedForecast.cachedAt < FORECAST_CACHE_TTL) {
    return Promise.resolve(cachedForecast.data)
  }

  if (cachedForecast) {
    forecastCache.delete(cacheKey)
  }

  // [tuning] 동일 도시 요청이 진행 중이면 기존 Promise를 반환해 중복 요청을 막는다.
  if (inFlightForecastRequests.has(cacheKey)) {
    return inFlightForecastRequests.get(cacheKey)
  }

  const request = Promise.resolve()
    .then(() => requestForecast(cityConfig))
    .then((data) => {
      forecastCache.set(cacheKey, {
        data,
        cachedAt: Date.now(),
      })

      return data
    })
    .finally(() => {
      inFlightForecastRequests.delete(cacheKey)
    })

  inFlightForecastRequests.set(cacheKey, request)

  return request
}
