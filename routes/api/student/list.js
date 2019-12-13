const Student = require('../../../models/').student;

/* 
    * List student's information
    
    POST /api/student/list
    {
        * not required *
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    
    try {
        results = await Student.findAll();
		studentList = results.map((student) => student.dataValues );
        studentNameList = results.map((student) => `${student.dataValues.name} ( ${student.dataValues.userid} )` );

        res.json({
            success: true,
            message: '학생 정보 리스트 조회를 완료했습니다.',
            ecode: 200,
            data: {
                studentList: studentList,
				studentNameList: studentNameList
            }
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