const Student = require('../../../models/').Student;

/* 
    * Set student's information
    
    POST /api/student/set
    {
        name              {string},
        school            {string},
        admissionYear     {string},
        mathGrade         {string}
    }
*/

exports.set = async (req, res) => {
    const userid = req.token.userid;
    const { name, school, admissionYear, mathGrade } = req.body;
   
    try {
        let options = {};
        
        if ( name !== undefined && name !== '' )
            options.name = name;
        if ( school !== undefined && school !== '' )
            options.school = school;
        if ( admissionYear !== undefined && admissionYear !== '' )
            options.admissionYear = admissionYear;
        if ( mathGrade !== undefined && mathGrade !== '' )
            options.mathGrade = mathGrade;
        
        if ( await Student.findOneByUserid(userid) )
            await Student.update(options, { where: { userid: userid } });
        else
            throw new Error('학생 정보 변경 중 오류가 발생했습니다.');
        
        res.json({
            success: true,
            message: '학생 정보 변경이 완료됐습니다.',
            ecode: 200
        });
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}

/* 
    * View student's information
    
    POST /api/student/view
    {
        * not required *
    }
*/

exports.view = async (req, res) => {
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
                    name: student.dataValues.name,
                    school: student.dataValues.school,
                    admissionYear: student.dataValues.admissionYear,
                    mathGrade: student.dataValues.mathGrade
                }
            });
        }
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}