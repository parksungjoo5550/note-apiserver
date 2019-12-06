


## REST API server
This server is used to support educational institute.
<br>

## API entries
* **/api/auth**
  * [/api/auth/register](#post-apiauthregister)
  * [/api/auth/login](#post-apiauthlogin) 
  * [/api/auth/resign](#post-apiauthresign) 
  * [/api/auth/validate](#post-apiauthvalidate) 

* **/api/student**
  * [/api/student/set](#post-apistudentset)
  * [/api/student/view](#post-apistudentview)

* **/api/problem**
  * [/api/problem/create](#post-apiproblemcreate)
  * [/api/problem/get](#post-apiproblemget)
  * [/api/problem/inquiry](#post-apiprobleminquiry)
  * [/api/problem/category](#post-apiproblemcategory)

* **/api/exam**
  * [/api/exam/create](#post-apiexamcreate)
  * [/api/exam/list](#post-apiexamlist)
  * [/api/exam/take](#post-apiexamtake)
  * [/api/exam/confirm](#post-apiexamconfirm)
  
* **/api/note**
  * [/api/note/view](#post-apinoteview)
  * [/api/note/rate](#post-apinoterate)

* **/api/category**
  * [/api/category/create](#post-apicategorycreate)
  * [/api/category/list](#post-apicategorylist)

* **/api/room**
  * [/api/room/create](#post-apiroomcreate)
  * [/api/room/list](#post-apiroomlist)

<br>

## API documentation
<!-- /api/auth -->
### POST /api/auth/register
계정을 생성합니다.

#### Parameter 
| Name | Data type | Description | 
---|---|---
| userid | String | 아이디 | 
| password | String | 비밀번호 | 
| password2 | String | 확인용 비밀번호 | 
| name | String | 이름 | 
| school | String | 학교 | 
| admissionYear | String | 입학년도 | 
| mathGrade | String | 수학등급 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>

### POST /api/auth/login
로그인하여 jwt 토큰을 반환합니다.

#### Parameter 
| Name | Data type | Description | 
---|---|---
| userid | String | 아이디 | 
| password | String | 비밀번호 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.token | Json | jwt 토큰 | 
<br>

### POST /api/auth/resign
계정을 탈퇴합니다.

#### Parameter 
| Name | Data type | Description | 
---|---|---
| userid | String | 아이디 | 
| password | String | 비밀번호 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>

### POST /api/auth/validate
로그인한 계정의 토큰 정보를 반환합니다.

#### Parameter
Not required

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.token | Json | Decrypt된 jwt 토큰 | 
<br>
<!-- /api/auth -->

<!-- /api/student -->
### POST /api/student/set
계정 정보를 변경합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| name | String | 이름 | 
| school | String | 학교 | 
| admissionYear | String | 입학년도| 
| mathGrade | String | 수학 등급 |

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>

### POST /api/student/view
로그인한 계정 정보를 반환합니다.

#### Parameter
Not required

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.name | String | 이름 | 
| data.school | String | 학교 | 
| data.admissionYear | String | 입학년도| 
| data.mathGrade | String | 수학 등급 |
<br>
<!-- /api/student -->

<!-- /api/problem -->
### POST /api/problem/create
문제를 생성합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| problemFilename | String | 문제 파일 이름 | 
| solutionFilename | String | 해답 파일 이름 | 
| problemBase64 | String | Base64로 인코딩된 문제 파일 | 
| solutionBase64 | String | Base64로 인코딩된 해답 파일 | 
| isMultipleQuestion | Boolean | 객관식 여부 | 
| answer | String | 답 |
| age | String | 학년 | 
| bigChapter | String | 대단원 | 
| middleChapter | String | 중단원 | 
| smallChapter | String | 소단원 | 
| level | String | 난이도 | 
| source | String | 출처 | 
| date | String | 출제년도 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>

### POST /api/problem/update
문제 정보를 수정합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| problemID | Integer | 문제 번호 (required) | 
| problemID | Integer | 문제 번호 | 
| problemID | Integer | 문제 번호 | 
| problemID | Integer | 문제 번호 | 
#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>

### POST /api/problem/get
문제 번호에 해당하는 문제를 반환합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| problemID | Integer | 문제 번호 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.problemID | Integer | 문제 번호 | 
| data.problemURL | String | 문제 파일 경로 | 
| data.isMultipleQuestion | Boolean | 객관식 여부 | 
<br>

### POST /api/problem/inquiry
조건에 맞는 문제를 반환합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| problemID | Integer | 문제 고유 번호 | 
| age | String | 학년 | 
| bigChapter | String | 대단원 | 
| middleChapter | String | 중단원 | 
| smallChapter | String | 소단원 | 
| level | String | 난이도 | 
| source | String | 문제 출처 | 
| startDate | String | 출체범위 시작 | 
| endDate | String | 출체범위 끝 | 
| active | Boolean | 문제 사용여부 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.problemList | Array | 조건에 맞는 모든 문제 | 
| data.problemList[i].problemID | Integer | 문제 고유 번호 | 
| data.problemList[i].problemURL | String | 문제 파일 경로 | 
| data.problemList[i].isMultipleQuestion | Boolean | 객관식 여부 | 
| data.problemList[i].problemCondition.age | String | 학년 | 
| data.problemList[i].problemCondition.bigChapter | String | 대단원 | 
| data.problemList[i].problemCondition.middleChapter | String | 중단원 | 
| data.problemList[i].problemCondition.smallChapter | String | 소단원 | 
| data.problemList[i].problemCondition.level | String | 난이도 | 
| data.problemList[i].problemCondition.source | String | 출처 | 
<br>

### POST /api/problem/category
등록된 문제의 카테고리를 반환합니다.

#### Parameter
Not required.

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.bigChapterList | 대단원 리스트 |
| data.middleChapterList | Array | 중단원 리스트 | 
| data.smallChapterList | Array | 소단원 리스트 | 
| data.sourceList | Array | 출처 리스트 | 
<br>
<!-- /api/problem -->

<!-- /api/exam -->
### POST /api/exam/create
시험지를 생성합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| title | String | 시험지 제목 | 
| problemIDList | Array | 시험지에 포함될 문제 번호 리스트 | 
| problemIDList[i].problemID | Integer | 문제 고유 번호 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>

### POST /api/exam/list
로그인한 계정이 생성한 시험지 리스트를 반환합니다.

#### Parameter
Not required

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.examList | Array | 조건에 맞는 모든 시험지 | 
| data.examList[i].examID | Integer | 시험지 고유 번호 | 
| data.examList[i].title | String | 시험지 제목 | 
| data.examList[i].isDone | Boolean | 제출 완료 여뷰 | 
| data.examList[i].createdAt | String | 만든 날짜 | 
<br>

### POST /api/exam/take
시험지 번호에 해당하는 시험지의 정보를 반환합니다.

#### Parameter
Not required

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.title | String | 시험지 제목 | 
| data.problemList | Array | 시험지에 포함된 모든 문제 | 
| data.problemList[i].problemID | Integer | 문제 고유 번호 | 
| data.problemList[i].problemURL | String | 문제 파일 경로 | 
| data.problemList[i].isMultipleQuestion | Boolean | 객관식 여부 | 
<br>

### POST /api/exam/confirm
시험지를 채점합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| examID | Integer | 시험지 고유 번호 | 
| problemIDList | Array | 문제 번호 리스트 | 
| answerList | Array | 제출 답안 리스트 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>
<!-- /api/exam -->

<!-- /api/note -->
### POST /api/note/view
제출된 시험지에 대한 정보를 조회합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| examID | Integer | 시험 번호 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.problemList | Array | 오답인 문제의 번호 리스트 | 
| data.problemList[i].problemID | Integer | 문제 고유 번호 | 
| data.problemList[i].answer | String | 문제 정답 | 
| data.problemList[i].submit | String | 사용자가 제출한 답 | 
| data.problemList[i].problemURL | String | 문제 파일 경로 | 
| data.problemList[i].solutionURL | String | 해설 파일 경로 | 
| data.problemList[i].state | Integer | 문제 처리 상태 | 
| data.correctCnt | Integer | 맞은 문제 개수 | 
| data.incorrectCnt | Integer | 맞은 문제 개수 | 
| data.unconfirmedCnt | Integer | 채점 대기중인 문제 개수 | 
<br>

### POST /api/note/view/:mode
제출된 시험지에 대한 정보를 상태에 따라 조회합니다. <br>
{ mode: 'correct' } - 맞은 문제 <br>
{ mode: 'imcorrect' } - 틀린 문제 <br>
{ mode: 'unconfirmed' } - 주관식 채점 대기 문제 <br>
{ mode: 'assigned' } - 관리자가 공유한 시험 문제

#### Parameter
| Name | Data type | Description | 
---|---|---
| examID | Integer | 시험 번호 | 
| startDate | String | 검색 시작 범위 (optional) | 
| endDate | String | 검색 끝 범위 (optional) |  
| bigChapter | String | 문제 대단원 (optional) | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.problemList | Array | 오답인 문제의 번호 리스트 | 
| data.problemList[i].problemID | Integer | 문제 고유 번호 | 
| data.problemList[i].answer | String | 문제 정답 | 
| data.problemList[i].submit | String | 사용자가 제출한 답 | 
| data.problemList[i].problemURL | String | 문제 파일 경로 | 
| data.problemList[i].solutionURL | String | 해설 파일 경로 | 
| data.problemList[i].state | Integer | 문제 처리 상태 | 
| data.correctCnt | Integer | 맞은 문제 개수 | 
| data.incorrectCnt | Integer | 맞은 문제 개수 | 
| data.unconfirmedCnt | Integer | 채점 대기중인 문제 개수 | 
<br>

### POST /api/note/rate
특정 문제에 대한 정답률을 확인합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| problemID | Integer | 문제 고유 번호 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.correctRate | Real | 정답률 | 
<br>
<!-- /api/note -->

<!-- /api/category -->
### POST /api/category/create
문제 카테고리를 생성합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| course | String | 과목명 | 
| bigChapter | String | 대단원 | 
| middleChapter | String | 중단원 | 
| smallChapter | String | 소단원 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>

### POST /api/category/list
하위 카테고리를 조회합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| course | String | 과목명 | 
| bigChapter | String | 대단원 | 
| middleChapter | String | 중단원 | 
| smallChapter | String | 소단원 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.categories | Array | 카테고리 리스트 | 
| data.categories[i] | String | 카테고리 | 
<br>
<!-- /api/category -->

<!-- /api/room -->
### POST /api/room/create
시험지를 학생들과 공유합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| examID | Integer | 공유할 시험지 번호 | 
| useridList | Array | 공유할 학생 아이디 리스트 | 
| type | Integer | 공유 타입 | 

{ type : 0 } - 시험 타입 <br>
{ type : 1 } - 숙제 타입

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>

### POST /api/room/list
특정 시험지에 대해 공유중인 학생을 조회합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| examID | Integer | 시험 번호 | 
| type | Integer | 공유 타입 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.useridList | Array | 학생 아이디 리스트 | 
| data.nameList | String | 학생 이름 리스트 | 
<br>
<!-- /api/category -->