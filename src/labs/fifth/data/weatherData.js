// 외부 API 도입 전 목록 카드와 상세 View가 함께 조회하는 고정 날씨 Mock Data다.
// id는 반복 key와 route param의 조회 기준이며 temp는 변환 전 섭씨 원본값으로 보존한다.
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
