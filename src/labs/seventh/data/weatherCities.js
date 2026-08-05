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

export const findWeatherCityById = (cityId) =>
  weatherCities.find((city) => city.id === cityId)

export const findWeatherCityByQueryName = (queryName) =>
  weatherCities.find((city) => city.query.split(',')[0] === queryName)
