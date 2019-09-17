
### REST API server
The server provides user account and problems information. 

### API entries
* /api/auth
  * [/api/auth/register](#POST-/api/auth/register) 
  * [/api/auth/login](#POST-/api/auth/login) 
  * [/api/auth/check](#GET-/api/auth/check) 
<br>

##### POST /api/auth/register
Requests registration of a user account.

#####  Parameter
| Name | Data type | Description | 
---|---|---
| userid | string | |
| password | string | |
| password2 | string | | 

##### Response
| Name | Data type | Description | 
---|---|---
| message| string | response message|
<br>

##### POST /api/auth/login
Generates a jwt token.
<br>

##### GET /api/auth/check
Validate a jwt token