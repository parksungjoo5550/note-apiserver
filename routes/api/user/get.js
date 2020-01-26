// Models
const Student = require('../../../models/').student;
const Teacher = require('../../../models/').teacher;
const User = require('../../../models/').user;

/* 
    * Get user information by userid.
    
    POST /api/user/get
    {
        userid              {String},
        useridArray         {Array}
    }
*/

module.exports = async (req, res) => {
    const token = req.token;
    const { userid, useridArray } = req.body;
   
    try {
        let options = {};
        let response = {
            success: true,
            message: '유저 정보를 조회했습니다.',
            data: {},
            ecode: 200
        };
        if ( !userid && !useridArray )
            user = await User.findOneByUserid(token.userid);
        else if ( userid !== undefined && !useridArray )
            user = await User.findOneByUserid(userid);
        else if ( !userid && useridArray !== undefined )
            userArray = await Promise.all(
                useridArray.map(userid => {
                    return User.findOneByUserid(userid);
                })
            );
        else
            throw new Error('모든 항목을 동시에 사용할 수 없습니다.');
        
        if ( user !== undefined ) {
            if ( user == null )
                throw new Error('해당 유저가 존재하지 않습니다.');
            else {
                if ( user.dataValues.type === 'student' ) {
                    student = await Student.findOneByUserid(user.dataValues.userid);
                    if (student == null)
                        throw new Error('학생 정보가 입력되어 있지 않습니다.');
                    user.dataValues.student = student.dataValues;
                }
                else if ( user.dataValues.type === 'teacher' ) {
                    teacher = await Teacher.findOneByUserid(user.dataValues.userid);
                    if (teacher == null)
                        throw new Error('선생 정보가 입력되어 있지 않습니다.');
                    user.dataValues.teacher = teacher.dataValues;
                }
                response.data.user = user.dataValues;
            }
        } else if ( userArray !== undefined ) {
            response.data.userArray = await Promise.all(
                userArray.map(user => {
                    if ( user == null )
                        return null;
                    else {
                        if ( user.dataValues.type === 'student' ) {
                            student = Student.findOneByUserid(user.dataValues.userid);
                            if (student == null)
                                throw new Error('학생 정보가 입력되어 있지 않습니다.');
                            user.dataValues.student = student.dataValues;
                        }
                        else if ( user.dataValues.type === 'teacher' ) {
                            teacher = Teacher.findOneByUserid(user.dataValues.userid);
                            if (teacher == null)
                                throw new Error('선생 정보가 입력되어 있지 않습니다.');
                            user.dataValues.teacher = teacher.dataValues;
                        }
                        return user.dataValues;
                    }
                })
            );
        }

        res.json(response);
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}