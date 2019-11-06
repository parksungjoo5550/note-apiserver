


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
| classOf | Number | 입학년도| 
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
| data.classOf | Number | 입학년도| 
| data.mathGrade | Number | 수학 등급 |
<br>

### POST /api/problem/create
문제를 생성합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| problem | File | 문제 이미지 파일 | 
| solution | File | 해답 이미지 파일 | 
| is_choice | Boolean | 객관식 여부 | 
| answer | String | 답 |
| grade | String | 학년 | 
| unit1 | Number | 대단원 | 
| unit2 | Number | 중단원 | 
| unit3 | Number | 소단원 | 
| difficulty | Number | 난이도 | 
| source | Number | 문제 출처 | 
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
| grade | String | 학년 | 
| unit1 | Number | 대단원 | 
| unit2 | Number | 중단원 | 
| unit3 | Number | 소단원 | 
| difficulty | Number | 난이도 | 
| source | Number | 문제 출처 | 
| start_date | Number | 출체범위 시작 | 
| end_date | Number | 출체범위 끝 | 

#### Response
| Name | Data type | Description | 
---|---|---
| success | Boolean | api 성공 여부 | 
| message | String | 응답 메시지 | 
| ecode | Integer | 응답 코드 | 
| data.problems | JSON Array | 조건에 맞는 모든 문제 | 

##### Response example
```
{ success: true,
  message: "success",
  ecode: 200,
  data.problems: [ { index: 1,
                    problem: '/uploads/problem.jpg',
                    solution: '/uploads/solution.jpg',
                    is_choice: false,
                    answer: 'answer',
                    grade: 'grade',
                    unit1: 'unit1',
                    unit2: 'unit2',
                    unit3: 'unit3',
                    difficulty: 0,
                    source: 'source',
                    date: 2019-10-02T00:00:00.000Z,
                    rate: null } ] }
```
<br>

### POST /api/exam/create
시험지를 생성합니다.

#### Parameter
| Name | Data type | Description | 
---|---|---
| title | String | 시험지 제목 | 
| problems | Array | 시험지에 포함될 문제의 고유 번호 | 

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
| data.papers | JSON Array | 조건에 맞는 모든 시험지 | 
<br>
