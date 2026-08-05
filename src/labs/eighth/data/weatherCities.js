/**
 * id와 name은 카드·route·Forecast selector에, query는 OpenWeather 요청에 사용한다.
 * 같은 설정을 Current Weather와 Forecast가 공유해 내부 식별값과 외부 도시값을 일치시킨다.
 */
export const weatherCities = [
  {
    id: 'city_01',
    name: '서울',
    query: 'Seoul,KR',
  },
  {
    id: 'city_02',
    name: '수원',
    query: 'Suwon,KR',
  },
  {
    id: 'city_03',
    name: '부산',
    query: 'Busan,KR',
  },
]

export const findWeatherCityById = (cityId) => weatherCities.find((city) => city.id === cityId)

export const findWeatherCityByQueryName = (queryName) =>
  weatherCities.find((city) => city.query.split(',')[0] === queryName)
