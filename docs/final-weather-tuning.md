# Final Weather Tuning

## 1. 작업 목적

이 브랜치는 final 날씨 앱을 대상으로 동작 비교 실험, 구조 리팩터링, 실제 성능 튜닝을 구분해 진행했다.

- **동작 비교 실험:** native input의 `v-model.trim.lazy`와 `watch`의 `immediate` 실행 시점을 확인했다.
- **구조 리팩터링:** 카드 액션과 대시보드 영역을 Slot으로 확장하고 검색 책임을 Composable로 분리했다.
- **실제 성능 튜닝:** Current Weather 카드의 불필요한 update를 줄이고 Forecast 응답과 진행 중 요청을 재사용했다.

## 2. 기준 구조

- Current Weather Home은 서울·수원·부산 3건을 요청한다.
- Current Weather Detail은 선택한 도시 1건을 다시 요청한다.
- Forecast 목록과 상세는 기존에 같은 도시 데이터를 각각 요청했다.
- Forecast 성공 결과 캐시와 진행 중 Promise 공유가 없었다.
- Current Weather 화면은 WeatherCard 3개를 렌더링한다.
- WeatherCard는 선택 footer처럼 카드 입력과 무관한 부모 상태가 바뀔 때도 update될 수 있었다.

## 3. 변경 요약

| 작업 | 분류 | 최종 유지 |
| --- | --- | --- |
| `v-model.trim.lazy` | experiment | second에 비교 실습으로 유지 |
| `watch immediate` | experiment | 비교 후 원복 |
| 3단계 온도 라벨 | feature | final에 유지 |
| WeatherCard actions Slot | refactor | final에 유지 |
| BaseDashboardCard header/footer Slot | refactor | final에 유지 |
| `useWeatherSearch` | refactor | final에 유지 |
| WeatherCard `v-memo` | tuning | final에 유지 |
| Forecast cache/TTL | tuning | final에 유지 |
| Forecast in-flight Promise 공유 | tuning | final에 유지 |

## 4. `v-model.trim.lazy` 비교

second의 native input에서 기존 `:value`와 `@input` 조합을 `v-model.trim.lazy`로 교체했다.

- 기존 구조는 `input` 이벤트마다 검색 상태와 computed 결과가 갱신됐다.
- `.lazy` 적용 후에는 native `change` 이벤트 시점에 상태가 갱신됐다.
- Enter만으로 `change` 발생이 항상 보장되지는 않았고, blur 시점에는 변경이 반영됐다.
- `.trim`은 상태에 반영되는 문자열의 앞뒤 공백을 제거했다.
- final 검색은 즉시 필터링과 한글 IME 처리가 중요하므로 `.lazy`를 적용하지 않았다.

이 변경은 성능 개선이 아니라 입력 반영 시점 비교를 위한 실습이며 second에만 유지했다.

## 5. `watch immediate` 비교

final의 선택 도시 `watch`에 `immediate: true`를 임시 적용해 최초 실행과 이후 선택 변경을 비교했다.

- 최초 callback 인자는 `newValue: null`, `oldValue: undefined`였다.
- 기존 로그 포맷에서는 최초 선택 없음 상태가 출력됐다.
- 카드 선택 후에는 새 날씨 객체와 이전 선택 객체가 callback 인자로 전달됐다.
- API 응답이 같은 도시의 새 객체로 선택 상태를 교체하면 도시명이 같아도 참조 변경으로 실행될 수 있었다.
- callback이 초기화가 아닌 관찰 로그만 담당해 기능상 최초 실행이 필요하지 않았다.

따라서 이 실험은 완료 후 원복했으며 최종 코드에는 `immediate: true`와 관련 `[experiment]` 주석이 남아 있지 않다.

## 6. 3단계 온도 라벨

WeatherCard 상태 라벨은 변환 전 원본 섭씨값 `weather.temp`를 기준으로 분기한다.

- 25℃ 초과: 더움
- 정확히 25℃: 보통
- 25℃ 미만: 선선함

섭씨·화씨 전환은 표시 숫자에만 적용되므로 25℃가 77℉로 표시되어도 라벨은 보통으로 유지된다. 정확히 25℃인 실제 API 카드 UI는 별도 수동 확인이 필요하다.

## 7. Slot 리팩터링

### WeatherCard

- `actions` Named Slot을 추가했다.
- Scoped Slot props로 `weather`와 `openDetail`을 제공한다.
- 부모가 Slot을 제공하지 않으면 기존 상세보기 버튼을 fallback으로 렌더링한다.
- 상세 route 이동 책임과 현재 weather 전달 책임은 부모에 유지했다.
- 버튼의 이벤트 전파 방지와 기존 `click-detail` emit 흐름을 유지했다.

### BaseDashboardCard

- `header`와 `footer` Named Slot을 추가했다.
- Slot이 없으면 해당 wrapper를 렌더링하지 않는다.
- 검색 카드는 기본 Slot만 사용한다.
- Element Plus native header/footer의 padding과 경계선으로 간격이 커지는 회귀가 있어 Named Slot wrapper를 ElCard body 안으로 이동했다.

## 8. `useWeatherSearch`

Composable로 이동한 책임은 다음과 같다.

- `searchQuery`
- `filteredWeatherList`
- `updateSearchQuery`
- 검색 상태를 관찰하는 `watchEffect`

WeatherParent에는 다음 책임을 유지했다.

- Current Weather API 요청과 fallback
- 카드 선택 상태
- 상세 route 이동
- Pinia 단위 상태 연결
- 화면 영역 구성과 렌더링

이 작업은 렌더링 성능 튜닝이 아니라 검색 관련 반응형 상태와 파생 결과의 구조 리팩터링이다.

## 9. `v-memo` 측정

임시 `onUpdated`와 `console.count`로 WeatherCard update를 측정한 뒤 측정 코드는 제거했다.

### 적용 전 임시 측정

| 시나리오 | update 횟수 |
| --- | ---: |
| 초기/API 완료 | 6 |
| 서울 선택 | 3 |
| `수` 검색 | 1 |
| clear | 1 |
| 단위 전환 | 3 |
| 합계 | 14 |

### 적용 후 최초 임시 측정

| 시나리오 | update 횟수 |
| --- | ---: |
| 초기/API 완료 | 3 |
| 서울 선택 | 0 |
| `수` 검색 | 1 |
| clear | 1 |
| 단위 전환 | 3 |
| 합계 | 8 |

UI 복구 후 재확인에서는 카드 선택 시 update 0회, API 객체 교체와 단위 전환 시 필요한 update가 유지되는 것을 확인했다. 검색 결과에서 카드가 사라지거나 다시 나타나는 동작은 update가 아니라 unmount/mount와 구분했다.

memo 의존성은 `[weather, configStore.unit]`이다.

- `weather` 변경은 Mock/fallback에서 API 객체로 교체될 때 카드 내용과 Scoped Slot payload를 갱신한다.
- `configStore.unit` 변경은 표시 온도와 단위 기호를 갱신한다.
- `unitSymbol`은 `unit`에서 파생되므로 별도 의존성에 포함하지 않았다.

카드가 3개이므로 절대적인 체감 성능 효과는 작다. 다만 선택 footer처럼 카드 입력과 무관한 부모 상태 변경에서 불필요한 update가 감소한 것은 임시 측정으로 확인했다.

## 10. UI 회귀와 수정

- BaseDashboardCard가 Element Plus native header/footer를 사용하면서 기본 padding과 경계선 때문에 제목과 카드 목록 간격이 증가했다.
- Named Slot API는 유지하면서 header/footer를 body 내부 조건부 wrapper로 변경해 eighth와 유사한 간격으로 복원했다.
- 온도 Tag는 조건부 컴포넌트 교체와 transition 과정에서 Mock→API 갱신 시 위치가 흔들렸다.
- 모든 상태 Tag가 같은 grid cell을 사용하도록 고정하고 해당 Tag transition을 제거해 왼쪽 위치를 유지했다.
- `v-if / v-else-if / v-else`의 3단계 라벨 실습과 actions Slot은 그대로 유지했다.

## 11. Forecast 캐시

Forecast 캐시는 View와 분리된 메모리 모듈이 담당한다.

- key: `cityConfig.id`
- TTL: 10분 (`10 * 60 * 1000`)
- 저장 값: 매핑된 성공 Forecast 배열과 `cachedAt`
- 유효한 성공 결과는 목록과 상세 View가 재사용한다.
- 만료된 항목은 제거하고 새 요청을 실행한다.
- 실패 결과는 저장하지 않는다.
- 기존 공개 함수 `fetchWeatherForecast(cityConfig)`를 유지해 View 호출부를 변경하지 않았다.

실제 10분을 기다린 TTL 만료 검증은 수행하지 않았으며 만료 정책은 코드상 확인했다. Current Weather에는 캐시를 적용하지 않았다.

## 12. in-flight Promise 공유

동일 도시 Forecast 요청이 진행 중이면 새 Axios 요청 대신 기존 Promise를 반환한다.

- 같은 도시 동시 호출 Promise 동일성: `true`
- 테스트 요청 함수 호출: 1회
- 두 호출의 반환 데이터 동일성: `true`
- 성공 캐시 재조회 시 추가 테스트 요청 없음
- 실패 요청을 두 번 순차 호출했을 때 테스트 요청 함수 호출: 2회
- `finally`에서 진행 중 Promise를 제거해 성공과 실패 모두 다음 상태로 정리한다.

위 결과는 캐시 모듈에 테스트용 요청 함수를 전달한 검증 결과이며 실제 OpenWeather Network 탭 계수는 아니다.

## 13. Forecast 요청 전후

다음 표는 실제 Network 실측값이 아니라 코드 정책과 캐시 모듈 검증에 따른 예상 비교다.

| 흐름 | 적용 전 | 같은 SPA 세션·TTL 내 적용 후 |
| --- | ---: | ---: |
| 목록 최초 진입 | 1 | 1 |
| 같은 도시 상세 진입 | 1 추가 | 추가 0 |
| 같은 도시 목록 복귀 | 1 추가 | 추가 0 |
| 같은 도시 상세 재진입 | 1 추가 | 추가 0 |
| 다른 도시 최초 선택 | 1 | 1 |
| 기존 도시 재선택 | 1 추가 | 추가 0 |

브라우저에서 서울 목록→상세→목록, 서울→부산→서울 화면 흐름은 확인했다. 실제 Network 요청 건수는 개발자 도구에서 수동 확인이 필요하다.

## 14. 상태와 책임

| 계층 | 책임 |
| --- | --- |
| 로컬 UI 상태 | 검색어, 카드 선택, 도시·필터 선택, loading/error/empty 표시 |
| Pinia | 앱 route 간 공유되는 섭씨·화씨 단위 상태 |
| 서버 요청 상태 | 각 View의 비동기 요청과 `latestRequestId`를 이용한 늦은 응답 보호 |
| Forecast 캐시 모듈 | 성공 결과 TTL과 동일 도시 in-flight Promise 공유 |
| 표현 계층 | Element Plus 카드·상태·Slot 렌더링과 사용자 이벤트 전달 |

Forecast 캐시는 View의 loading, error, fallback 상태를 소유하지 않는다. 캐시 miss와 API 오류는 기존 공개 함수의 Promise를 통해 각 View로 전달되며 기존 상태 처리 흐름을 유지한다.

## 15. 주석 태그

- `[experiment]`: 동작 비교를 위해 유지한 second의 `.lazy` 입력 지점을 표시한다.
- `[feature]`: 원본 섭씨 25℃를 기준으로 추가한 3단계 라벨을 표시한다.
- `[refactor]`: Slot과 Composable로 책임을 분리한 지점을 표시한다.
- `[fix]`: Slot 확장 이후 발생한 UI 정렬 회귀 수정 지점을 표시한다.
- `[tuning]`: `v-memo`, Forecast TTL, in-flight Promise 공유 지점을 표시한다.

임시 측정용 `[measure]`, `console.count`, `onUpdated`는 최종 코드에 남아 있지 않다. 원복한 watch immediate 실험 태그도 남아 있지 않다.

## 16. 검증 결과

### 자동 검증

- `npm run format:check`
- `npm run lint`
- `npm run build`
- `git diff --check`

위 명령의 최종 실행 결과는 모두 통과했다.

### 브라우저에서 확인한 흐름

- `/final/forecast?cityId=city_01`의 서울 Forecast 목록 표시
- 서울 날짜 카드에서 상세 route 이동
- 상세에서 서울 목록으로 복귀
- 부산 Forecast로 전환
- 부산에서 서울로 재전환

### 수동 확인 필요

- 개발자 도구 Network 탭의 실제 Forecast 요청 건수
- 실제 10분 경과 후 TTL 만료 및 새 요청
- 실제 API 실패 후 UI 재시도와 오류/fallback 표시
- 한글 IME 입력 전체 시나리오
- 정확히 25℃인 실제 카드의 보통 라벨
- Current Weather와 Forecast 전체 흐름의 Console 오류 여부

## 17. 남은 개선 후보

이번 PR에서는 다음 항목을 제외했다.

- Current Weather 캐시
- 캐시 hit 시 loading 깜빡임 제거
- stale-while-revalidate
- `AbortController`
- Forecast cache size 제한과 제거 정책
- 렌더링·캐시 동작 자동 테스트

이번 작업은 교수님 실습 범위와 현재 앱의 책임 분리를 확인하는 데 집중했다. 캐시 정책과 요청 취소까지 동시에 확장하면 오류·fallback·늦은 응답 처리의 검증 범위가 크게 늘어나므로 후속 작업으로 남겼다.

