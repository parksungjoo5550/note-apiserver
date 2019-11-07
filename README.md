


## REST API server
The server provides user account and problems information. 
<br>

## API entries
* **/api/auth**
  * [/api/auth/register](#post-apiauthregister)
  * [/api/auth/login](#post-apiauthlogin) 
  * [/api/auth/validate](#get-apiauthvalidate) 

* **/api/student**
  * [/api/student/set](#post-apistudentset)
  * [/api/student/view](#post-apistudentview)

* **/api/problem**
  * [/api/problem/create](#post-apiproblemcreate)
  * [/api/problem/inquiry](#post-apiprobleminquiry)

* **/api/exam**
  * [/api/exam/create](#post-apiexamcreate)
  * [/api/exam/list](#post-apiexamlist)
  * [/api/exam/:examid](#post-apiexamexamid)
<br>

## API documentation
### POST /api/auth/register
계정을 생성합니다.

#### Parameter 
| Name | Data type | Description | 
---|---|---
| userid | String | 아이디 | 
| password | String | 비밀번호 |  
| password2 | String | 확인용 비밀번호 | 
| name | String | 이름 | 

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

### GET /api/auth/validate
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

### POST /api/student/set
계정 정보를 변경합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| name | String | 이름 | 
| school | String | 학교 | 
| admissionYear | Number | 입학년도| 
| mathGrade | Number | 수학 등급 |

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
| data.admissionYear | Number | 입학년도| 
| data.mathGrade | Number | 수학 등급 |
<br>

### POST /api/problem/create
문제를 생성합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| problemFilename | File | 문제 파일 이름 | 
| solutionFilename | File | 해답 파일 이름 | 
| problemBase64 | File | Base64로 인코딩된 문제 파일 | 
| solutionBase64 | File | Base64로 인코딩된 해답 파일 | 
| isMultipleQuestion | Boolean | 객관식 여부 | 
| answer | String | 답 |
| age | String | 학년 | 
| bigChapter | Number | 대단원 | 
| middleChapter | Number | 중단원 | 
| smallChapter | Number | 소단원 | 
| level | Number | 난이도 | 
| source | Number | 출처 | 
| date | Number | 출제년도 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
<br>

### POST /api/problem/inquiry
조건에 맞는 문제를 반환합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| age | String | 학년 | 
| bigChapter | Number | 대단원 | 
| middleChapter | Number | 중단원 | 
| smallChapter | Number | 소단원 | 
| level | Number | 난이도 | 
| source | Number | 문제 출처 | 
| startDate | Number | 출체범위 시작 | 
| endDate | Number | 출체범위 끝 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.problems | Array | 조건에 맞는 모든 문제 | 
| data.problems[i].problemID | Integer | 문제 고유 번호 | 
| data.problems[i].problemURL | String | 문제 파일 경로 | 
| data.problems[i].isMultipleQuestion | Boolean | 객관식 여부 | 
| data.problems[i].problemCondition.age | String | 학년 | 
| data.problems[i].problemCondition.bigChapter | String | 대단원 | 
| data.problems[i].problemCondition.middleChapter | String | 중단원 | 
| data.problems[i].problemCondition.smallChapter | String | 소단원 | 
| data.problems[i].problemCondition.level | Integer | 난이도 | 
| data.problems[i].problemCondition.source | String | 출처 | 
<br>

### POST /api/exam/create
시험지를 생성합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| title | String | 시험지 제목 | 
| problemList | Array | 시험지에 포함될 문제의 고유 번호 | 

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
| data.papers | Array | 조건에 맞는 모든 시험지 | 
| data.papers[i].examid | Integer | 시험지 고유 번호 | 
| data.papers[i].title | String | 시험지 제목 | 
| data.papers[i].createdAt | Date | 만든 날짜 | 
<br>

### POST /api/exam/:examid
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
| data.problems | Array | 시험지에 포함된 모든 문제 | 
| data.problems[i].problemID | Integet | 문제 고유 번호 | 
| data.problems[i].problemURL | Integet | 문제 파일 경로 | 
<br>

