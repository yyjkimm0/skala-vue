// API 요청이 실패한 도시만 대체할 수 있도록 내부 weather model과 같은 형태로 유지한다.
export const weatherList = [
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 55,
    windSpeed: 2.5,
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 68,
    windSpeed: 3.1,
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 72,
    windSpeed: 4.2,
  },
]
