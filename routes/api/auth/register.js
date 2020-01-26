// Models
const User = require('../../../models/').user;
const Teacher = require('../../../models/').teacher;
const Student = require('../../../models/').student;

/* 
    * Create a user account
    
    POST /api/auth/register
    {
        userid,
        password,
        password2,
        name,
        school,
        admissionYear,
        mathGrade,
        token
    }
*/

module.exports = async (req, res) => {
    const { userid, password, password2, type, name, school, admissionYear, mathGrade, token } = req.body;
    
    try {
        if ( !userid || !password || !password2 || !type || (type === "teacher" && !name) || (type === "student" && (!name || !school || !admissionYear || !mathGrade)) ) {
            throw new Error('모든 항목을 입력해주세요.');
        }
        else if ( password !== password2 ) {
            throw new Error('확인 비밀번호가 일치하지 않습니다.');
        }
        else if ( password.length < 6 ) {
            throw new Error('비밀번호가 최소 6자리 이상이여야 합니다.');
        }
        else if ( await User.findOneByUserid(userid) ) {
            throw new Error('이미 존재하는 아이디입니다.');
        }
        
        // Create a user.
        await User.create({
            userid: userid,
            password: password,
            admin: type === "admin" ? true : false,
            type: type
        });
        // Write additional information by type.
        if ( type === "teacher" ) {
            await Teacher.create({
                teacherId: userid,
                name: name
            });
        } else if ( type === "student" ) {
            await Student.create({
                studentId: userid,
                teacherId: token.userid,
                name: name,
                school: school,
                admissionYear: admissionYear,
                mathGrade: mathGrade
            });
        }
        res.json({
            success: true,
            message: '회원 가입이 완료됐습니다.',
            ecode: 200
        });
        
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}