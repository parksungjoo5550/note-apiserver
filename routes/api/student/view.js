const Student = require('../../../models/').student;

/* 
    * View student's information
    
    POST /api/student/view
    {
        * not required *
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    
    try {
        student = await Student.findOneByUserid(userid);
        
        if (student == null){
            throw new Error('학생 정보 조회 중 오류가 발생했습니다.');
        }
        else {
            res.json({
                success: true,
                message: '학생 정보 조회를 완료했습니다.',
                ecode: 200,
                data: {
                    studentId: student.dataValues.studentId,
                    name: student.dataValues.name,
                    school: student.dataValues.school,
                    admissionYear: student.dataValues.admissionYear,
                    mathGrade: student.dataValues.mathGrade,
                    isRegular: student.dataValues.isRegular
                }
            });
        }
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}