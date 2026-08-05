// Current Weather 요청이 실패한 도시만 대체하는 fallback이며 Forecast에는 사용하지 않는다.
// weather mapper와 같은 내부 필드 및 섭씨 원본을 유지해 현재 날씨 UI가 출처에 의존하지 않는다.
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
