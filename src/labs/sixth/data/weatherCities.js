/**
 * id와 name은 route·화면 식별에, query는 OpenWeather의 도시 검색에 사용한다.
 * 화면 표시값과 외부 API 요청값을 분리해 각 책임의 형식이 서로 영향을 주지 않게 한다.
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
