/**
 * id와 name은 카드 key·route·화면 식별에, query는 OpenWeather 도시 검색에 사용한다.
 * 앱 내부 값과 외부 요청값을 분리해 Router와 API가 각자 필요한 형식을 사용하게 한다.
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
