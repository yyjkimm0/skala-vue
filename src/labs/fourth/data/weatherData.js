// 외부 API 도입 전이므로 Home 카드와 Detail View가 함께 사용할 고정 날씨 데이터를 제공한다.
// id는 목록 key와 상세 route param·조회 기준이며 나머지 필드는 카드와 상세 화면의 표시값이다.
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
