const Teacher = require('../../../models/').teacher;

/* 
    * List teacher's information
    
    POST /api/teacher/list
    {
        * not required *
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    
    try {
        results = await Teacher.findAll();
		teacherList = results.map((teacher) => teacher.dataValues );
        teacherNameList = results.map((teacher) => `${student.dataValues.name} ( ${student.dataValues.teacherId} )` );

        res.json({
            success: true,
            message: '선생 정보 리스트 조회를 완료했습니다.',
            ecode: 200,
            data: {
                teacherList: teacherList,
                teacherNameList: teacherNameList
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