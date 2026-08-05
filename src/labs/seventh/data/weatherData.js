// 기본 원천이 아니라 API 요청이 실패한 도시만 대체하는 fallback 데이터다.
// mapper 결과와 같은 내부 필드 및 섭씨 원본을 사용해 UI가 데이터 출처에 의존하지 않는다.
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
