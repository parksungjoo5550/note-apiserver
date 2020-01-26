// Models
const Student = require('../../../models/').student;

/* 
    * Set student's information
    
    POST /api/student/set
    {
        name              {string},
        school            {string},
        admissionYear     {string},
        mathGrade         {string},
        isRegular         {boolean}
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { name, school, admissionYear, mathGrade, isRegular } = req.body;
   
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
        if ( isRegular !== undefined && mathGrade !== '')
            options.isRegular = isRegular;
        
        if ( await Student.findOneByUserid(userid) )
            await Student.update(options, { where: { studentId: userid } });
        else
            throw new Error('학생 정보 변경 중 오류가 발생했습니다.');
        
        res.json({
            success: true,
            message: '학생 정보 변경이 완료됐습니다.',
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