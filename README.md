

## REST API server
The server provides user account and problems information. 

## API entries
* **/api/auth**
  * [/api/auth/register](#post-apiauthregister)
  * [/api/auth/login](#post-apiauthlogin) 
  * [/api/auth/check](#get-apiauthcheck) 

* **/api/student**
  * [/api/student/set](#post-apistudentset)
  * [/api/student/view](#get-apistudentview)
  
<br>

## API documentation
### POST /api/auth/register
Requests registration of a user account.

#### Parameter 
| Name | Data type | Description | 
---|---|---
| userid | String | | 
| password | String | |  
| password2 | String | | 

#### Response
| Name | Data type | Description | 
---|---|---
| message| String | response message| 
<br>

### POST /api/auth/login
Generates a jwt token.

#### Parameter 
| Name | Data type | Description | 
---|---|---
| userid | String | | 
| password | String | | 

#### Response
| Name | Data type | Description | 
---|---|---
| message| String | response message| 
<br>

### GET /api/auth/check
Validate a jwt token (required login)

#### Parameter
not required

#### Response
| Name | Data type | Description | 
---|---|---
| success| Boolean | |  
| info | Json | Details of jwt token | 
<br>

### POST /api/student/set
Set student's information. (required login)

#### Parameter
| Name | Data type | Description | 
---|---|---
| name | String | | 
| school | String | | 
| classOf | Number | Admission year | 
| mathGrade | Number | Grade of math |

#### Response
| Name | Data type | Description | 
---|---|---
| message| String | response message| 
<br>

### GET /api/student/view
View student's information. (required login)

#### Parameter
not required

#### Response
| Name | Data type | Description | 
---|---|---
| name | String | | 
| school | String | | 
| classOf | Number | Admission year | 
| mathGrade | Number | Grade of math | 
<br>