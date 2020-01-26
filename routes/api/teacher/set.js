// Models
const Teacher = require('../../../models/').teacher;

/* 
    * Set teacher's information
    
    POST /api/student/set
    {
        name              {string},
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { name } = req.body;
   
    try {
        let options = {};
        
        if ( name !== undefined && name !== '' )
            options.name = name;
        
        if ( await Teacher.findOneByUserid(userid) )
            await Teacher.update(options, { where: { teacherId: userid } });
        else
            throw new Error('선생 정보 변경 중 오류가 발생했습니다.');
        
        res.json({
            success: true,
            message: '선생 정보 변경이 완료됐습니다.',
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