// Models
const Problem = require('../../../models/').problem;

module.exports = async (req, res) => {
    const { problemID } = req.body;
    
    try {
        problem =  await Problem.findOneByindex(problemID);
        if ( problem == null ) 
            throw new Error('해당 문제는 존재하지 않습니다.');
        
        res.json({
            success: true,
            message: '문제 정보 조회를 완료했습니다.',
            ecode: 200,
            data: { 
                problem: problem.dataValues
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